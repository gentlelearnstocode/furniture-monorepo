import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { db, productImportJobs, products, catalogs } from '@repo/database';
import { eq } from 'drizzle-orm';
import { productImportRowSchema, validateDimensions } from '@/lib/validations/product-import';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read the file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    // Get the first sheet (Products)
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json({ error: 'No sheets found in the file' }, { status: 400 });
    }
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      return NextResponse.json({ error: 'Could not read worksheet' }, { status: 400 });
    }

    // Convert to JSON, skipping header row
    const rawRows = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

    if (rawRows.length === 0) {
      return NextResponse.json({ error: 'No data rows found in the file' }, { status: 400 });
    }

    // Create import job
    const [job] = await db
      .insert(productImportJobs)
      .values({
        status: 'processing',
        totalRows: rawRows.length,
        createdBy: session.user.id,
      })
      .returning();

    if (!job) {
      return NextResponse.json({ error: 'Failed to create import job' }, { status: 500 });
    }

    // Fetch all level 2 catalogs for validation
    const allCatalogs = await db.query.catalogs.findMany({
      where: eq(catalogs.level, 2),
    });
    const catalogMap = new Map(allCatalogs.map((c) => [c.name.toLowerCase(), c.id]));

    // Fetch existing slugs to check for duplicates
    const existingSlugs = new Set(
      (await db.query.products.findMany({ columns: { slug: true } })).map((p) => p.slug)
    );

    const errors: { row: number; field: string; message: string }[] = [];
    const validProducts: {
      name: string;
      slug: string;
      description: string | null;
      shortDescription: string | null;
      basePrice: string;
      catalogId: string | null;
      isActive: boolean;
      dimensions: { width: number; height: number; depth: number; unit: string } | null;
    }[] = [];

    // Track slugs being imported to catch duplicates within the file
    const importSlugs = new Set<string>();

    // Validate and process each row
    for (let i = 0; i < rawRows.length; i++) {
      const rowNum = i + 2; // +2 because of header row and 1-indexing
      const rawRow = rawRows[i];

      // Parse with zod
      const parsed = productImportRowSchema.safeParse(rawRow);

      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          errors.push({
            row: rowNum,
            field: issue.path.join('.'),
            message: issue.message,
          });
        });
        continue;
      }

      const row = parsed.data;

      // Check for duplicate slug in file
      if (importSlugs.has(row.slug)) {
        errors.push({
          row: rowNum,
          field: 'slug',
          message: `Duplicate slug "${row.slug}" found in import file`,
        });
        continue;
      }

      // Check for existing slug in database
      if (existingSlugs.has(row.slug)) {
        errors.push({
          row: rowNum,
          field: 'slug',
          message: `Slug "${row.slug}" already exists in database`,
        });
        continue;
      }

      // Validate catalog name
      let catalogId: string | null = null;
      if (row.catalog_name) {
        catalogId = catalogMap.get(row.catalog_name.toLowerCase()) || null;
        if (!catalogId) {
          errors.push({
            row: rowNum,
            field: 'catalog_name',
            message: `Catalog "${row.catalog_name}" not found`,
          });
          continue;
        }
      }

      // Validate dimensions
      const dimensionError = validateDimensions(row);
      if (dimensionError) {
        errors.push({
          row: rowNum,
          field: 'dimensions',
          message: dimensionError,
        });
        continue;
      }

      // Build dimensions object if all fields present
      let dimensions = null;
      if (
        row.dimensions_width !== undefined &&
        row.dimensions_height !== undefined &&
        row.dimensions_depth !== undefined &&
        row.dimensions_unit
      ) {
        dimensions = {
          width: row.dimensions_width,
          height: row.dimensions_height,
          depth: row.dimensions_depth,
          unit: row.dimensions_unit,
        };
      }

      importSlugs.add(row.slug);
      validProducts.push({
        name: row.name,
        slug: row.slug,
        description: row.description || null,
        shortDescription: row.short_description || null,
        basePrice: row.base_price.toString(),
        catalogId,
        isActive: row.is_active,
        dimensions,
      });

      // Update progress periodically
      if (i % 10 === 0) {
        await db
          .update(productImportJobs)
          .set({ processedRows: i + 1 })
          .where(eq(productImportJobs.id, job.id));
      }
    }

    // Insert valid products
    let successCount = 0;
    if (validProducts.length > 0) {
      const inserted = await db.insert(products).values(validProducts).returning();
      successCount = inserted.length;
    }

    // Update job with final status
    await db
      .update(productImportJobs)
      .set({
        status: 'completed',
        processedRows: rawRows.length,
        successCount,
        errorCount: errors.length,
        errors: errors.length > 0 ? errors : null,
        completedAt: new Date(),
      })
      .where(eq(productImportJobs.id, job.id));

    // Revalidate storefront cache after successful import
    const { revalidateStorefront } = await import('@/lib/revalidate-storefront');
    await revalidateStorefront(['products', 'catalogs']);

    return NextResponse.json({
      jobId: job.id,
      totalRows: rawRows.length,
      successCount,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : null,
    });
  } catch (error) {
    console.error('Import failed:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}
