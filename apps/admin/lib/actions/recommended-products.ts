'use server';

import { db, recommendedProducts, products } from '@repo/database';
import { eq, and, ne, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { revalidateStorefront } from '../revalidate-storefront';

export async function getRecommendedProducts(productId: string) {
  try {
    const recommendations = await db.query.recommendedProducts.findMany({
      where: eq(recommendedProducts.sourceProductId, productId),
      orderBy: [asc(recommendedProducts.position)],
      with: {
        recommendedProduct: {
          with: {
            gallery: {
              with: {
                asset: true,
              },
              orderBy: (gallery, { asc }) => [asc(gallery.position)],
              limit: 1,
            },
          },
        },
      },
    });

    return recommendations.map((r) => ({
      id: r.recommendedProduct.id,
      name: r.recommendedProduct.name,
      basePrice: r.recommendedProduct.basePrice,
      discountPrice: r.recommendedProduct.discountPrice,
      gallery: r.recommendedProduct.gallery,
      position: r.position,
    }));
  } catch (error) {
    console.error('Failed to get recommended products:', error);
    return [];
  }
}

export async function getAvailableProducts(excludeProductId: string) {
  try {
    const allProducts = await db.query.products.findMany({
      where: and(eq(products.isActive, true), ne(products.id, excludeProductId)),
      orderBy: [asc(products.name)],
      with: {
        gallery: {
          with: {
            asset: true,
          },
          orderBy: (gallery, { asc }) => [asc(gallery.position)],
          limit: 1,
        },
      },
    });

    return allProducts.map((p) => ({
      id: p.id,
      name: p.name,
      basePrice: p.basePrice,
      discountPrice: p.discountPrice,
      gallery: p.gallery,
    }));
  } catch (error) {
    console.error('Failed to get available products:', error);
    return [];
  }
}

export async function updateRecommendedProducts(
  productId: string,
  recommendedProductIds: string[],
) {
  try {
    // Delete existing recommendations
    await db.delete(recommendedProducts).where(eq(recommendedProducts.sourceProductId, productId));

    // Insert new recommendations with positions
    if (recommendedProductIds.length > 0) {
      await db.insert(recommendedProducts).values(
        recommendedProductIds.map((id, index) => ({
          sourceProductId: productId,
          recommendedProductId: id,
          position: index,
        })),
      );
    }

    revalidatePath(`/products/${productId}`);
    await revalidateStorefront(['products']);

    return { success: true };
  } catch (error) {
    console.error('Failed to update recommended products:', error);
    return { error: 'Failed to update recommended products' };
  }
}
