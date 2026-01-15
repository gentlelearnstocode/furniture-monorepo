import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { db } from '@repo/database';

export async function GET() {
  try {
    // Fetch all level 2 catalogs for the dropdown hint
    const catalogs = await db.query.catalogs.findMany({
      where: (catalogs, { eq }) => eq(catalogs.level, 2),
      columns: { name: true },
    });

    const catalogNames = catalogs.map((c) => c.name);

    // Define headers
    const headers = [
      'name',
      'slug',
      'catalog_name',
      'description',
      'short_description',
      'base_price',
      'is_active',
      'dimensions_width',
      'dimensions_height',
      'dimensions_depth',
      'dimensions_unit',
    ];

    // Create example row
    const exampleRow = {
      name: 'Example Product Name',
      slug: 'example-product-name',
      catalog_name: catalogNames[0] || 'Subcatalog Name',
      description: 'Full product description here',
      short_description: 'Short description',
      base_price: 199.99,
      is_active: 'true',
      dimensions_width: 100,
      dimensions_height: 50,
      dimensions_depth: 30,
      dimensions_unit: 'cm',
    };

    // Create instructions sheet data
    const instructionsData = [
      ['Product Import Template Instructions'],
      [''],
      ['Required Fields:'],
      ['- name: Product name (required)'],
      ['- slug: URL-friendly identifier, lowercase with hyphens (required)'],
      ['- base_price: Product price, positive number (required)'],
      [''],
      ['Optional Fields:'],
      ['- catalog_name: Must match an existing subcatalog name exactly'],
      ['- description: Full product description'],
      ['- short_description: Brief summary'],
      ['- is_active: true/false, defaults to true'],
      ['- dimensions_*: If any dimension is provided, all 4 fields are required'],
      [''],
      ['Available Catalogs:'],
      ...catalogNames.map((name) => [`- ${name}`]),
      [''],
      ['Notes:'],
      ['- Images can be added via the product edit page after import'],
      ['- Duplicate slugs will cause validation errors'],
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create products sheet
    const productsWs = XLSX.utils.json_to_sheet([exampleRow], { header: headers });

    // Set column widths
    productsWs['!cols'] = headers.map((h) => ({
      wch: h === 'description' ? 40 : h === 'short_description' ? 30 : 20,
    }));

    XLSX.utils.book_append_sheet(wb, productsWs, 'Products');

    // Create instructions sheet
    const instructionsWs = XLSX.utils.aoa_to_sheet(instructionsData);
    instructionsWs['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, instructionsWs, 'Instructions');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="product-import-template.xlsx"',
      },
    });
  } catch (error) {
    console.error('Failed to generate template:', error);
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 });
  }
}
