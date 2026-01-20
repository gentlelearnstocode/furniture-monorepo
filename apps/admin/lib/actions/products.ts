'use server';

import { db, products, productAssets, homepageSaleProducts } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { createProductSchema, type CreateProductInput } from '@/lib/validations/products';
import { eq } from 'drizzle-orm';
import { revalidateStorefront } from '../revalidate-storefront';
import { createNotification } from '../notifications';
import { auth } from '@/auth';

export async function createProduct(data: CreateProductInput) {
  const session = await auth();
  const validated = createProductSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  const {
    name,
    nameVi,
    slug,
    description,
    descriptionVi,
    shortDescription,
    shortDescriptionVi,
    basePrice,
    discountPrice,
    showPrice,
    catalogId,
    isActive,
    dimensions,
    images,
  } = validated.data;

  try {
    // Check for existing slug
    const existing = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.slug, slug),
    });

    if (existing) {
      return { error: 'Slug already exists. Please choose a unique name or slug.' };
    }

    // Validate that catalog is level 2 (subcatalog) if provided
    if (catalogId) {
      const catalog = await db.query.catalogs.findFirst({
        where: (catalogs, { eq }) => eq(catalogs.id, catalogId),
      });

      if (!catalog) {
        return { error: 'Selected catalog does not exist.' };
      }

      if (catalog.level !== 2) {
        return { error: 'Products can only be assigned to level 2 catalogs (subcatalogs).' };
      }
    }

    const [product] = await db
      .insert(products)
      .values({
        name,
        nameVi: nameVi || null,
        slug,
        description: description || null,
        descriptionVi: descriptionVi || null,
        shortDescription: shortDescription || null,
        shortDescriptionVi: shortDescriptionVi || null,
        basePrice: basePrice.toString(), // Decimal types often expect strings in ORMs to preserve precision
        discountPrice: discountPrice?.toString() || null,
        showPrice,
        catalogId: catalogId || null,
        isActive,
        dimensions: dimensions || null,
        createdById: session?.user?.id || null,
      })
      .returning();

    if (product) {
      await createNotification({
        type: 'entity_created',
        title: 'New Product Created',
        message: `Product "${name}" has been created successfully.`,
        link: `/products/${product.id}`,
      });
    }

    if (product && images && images.length > 0) {
      await db.insert(productAssets).values(
        images.map((img, index) => ({
          productId: product.id,
          assetId: img.assetId,
          position: index,
          isPrimary: img.isPrimary,
          // Display settings
          focusPoint: img.focusPoint || null,
          aspectRatio: img.aspectRatio || 'original',
          objectFit: img.objectFit || 'cover',
        })),
      );
    }

    // Auto-add to sale section if product has discountPrice
    if (product && discountPrice) {
      const currentSaleProducts = await db.query.homepageSaleProducts.findMany();
      await db.insert(homepageSaleProducts).values({
        productId: product.id,
        position: currentSaleProducts.length,
      });
    }
  } catch (error) {
    console.error('Failed to create product:', error);
    return { error: 'Database error: Failed to create product.' };
  }

  revalidatePath('/products');
  await revalidateStorefront(['products', 'catalogs']);
  return { success: true };
}

export async function updateProduct(id: string, data: CreateProductInput) {
  const validated = createProductSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  const {
    name,
    nameVi,
    slug,
    description,
    descriptionVi,
    shortDescription,
    shortDescriptionVi,
    basePrice,
    discountPrice,
    showPrice,
    catalogId,
    isActive,
    dimensions,
    images,
  } = validated.data;

  try {
    // Check for existing slug (excluding current product)
    const existing = await db.query.products.findFirst({
      where: (products, { eq, and, ne }) => and(eq(products.slug, slug), ne(products.id, id)),
    });

    if (existing) {
      return { error: 'Slug already exists. Please choose a unique name or slug.' };
    }

    // Validate that catalog is level 2 (subcatalog) if provided
    if (catalogId) {
      const catalog = await db.query.catalogs.findFirst({
        where: (catalogs, { eq }) => eq(catalogs.id, catalogId),
      });

      if (!catalog) {
        return { error: 'Selected catalog does not exist.' };
      }

      if (catalog.level !== 2) {
        return { error: 'Products can only be assigned to level 2 catalogs (subcatalogs).' };
      }
    }

    await db
      .update(products)
      .set({
        name,
        nameVi: nameVi || null,
        slug,
        description: description || null,
        descriptionVi: descriptionVi || null,
        shortDescription: shortDescription || null,
        shortDescriptionVi: shortDescriptionVi || null,
        basePrice: basePrice.toString(),
        discountPrice: discountPrice?.toString() || null,
        showPrice,
        catalogId: catalogId || null,
        isActive,
        dimensions: dimensions || null,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

    await createNotification({
      type: 'entity_updated',
      title: 'Product Updated',
      message: `Product "${name}" has been updated.`,
      link: `/products/${id}`,
    });

    // Update images: delete old ones and insert new ones
    // A more efficient way would be to diff, but for now this is simpler
    await db.delete(productAssets).where(eq(productAssets.productId, id));

    if (images && images.length > 0) {
      await db.insert(productAssets).values(
        images.map((img, index) => ({
          productId: id,
          assetId: img.assetId,
          position: index,
          isPrimary: img.isPrimary,
          // Display settings
          focusPoint: img.focusPoint || null,
          aspectRatio: img.aspectRatio || 'original',
          objectFit: img.objectFit || 'cover',
        })),
      );
    }

    // Auto-sync with sale section based on discountPrice
    if (discountPrice) {
      // Add to sale section if not already there
      const existingInSale = await db.query.homepageSaleProducts.findFirst({
        where: (hsp, { eq }) => eq(hsp.productId, id),
      });

      if (!existingInSale) {
        // Get current count for position
        const currentSaleProducts = await db.query.homepageSaleProducts.findMany();
        await db.insert(homepageSaleProducts).values({
          productId: id,
          position: currentSaleProducts.length,
        });
      }
    } else {
      // Remove from sale section if discountPrice is cleared
      await db.delete(homepageSaleProducts).where(eq(homepageSaleProducts.productId, id));
    }
  } catch (error) {
    console.error('Failed to update product:', error);
    return { error: 'Database error: Failed to update product.' };
  }

  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  await revalidateStorefront(['products', 'catalogs']);
  return { success: true };
}

export async function deleteProduct(id: string) {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath('/products');
    await revalidateStorefront(['products', 'catalogs']);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { error: 'Failed to delete product' };
  }
}

export async function bulkDeleteProducts(ids: string[]) {
  try {
    const { inArray } = await import('drizzle-orm');
    await db.delete(products).where(inArray(products.id, ids));
    revalidatePath('/products');
    await revalidateStorefront(['products', 'catalogs']);
    return { success: true };
  } catch (error) {
    console.error('Failed to bulk delete products:', error);
    return { error: 'Failed to bulk delete products' };
  }
}
