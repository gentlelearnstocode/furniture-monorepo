'use server';

import { db, saleSectionSettings, homepageSaleProducts } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { eq, asc, and } from 'drizzle-orm';
import { revalidateStorefront } from '../revalidate-storefront';

export async function getSaleSettings() {
  try {
    const settings = await db.query.saleSectionSettings.findFirst();
    if (!settings) {
      // Create default settings if they don't exist
      const [newSettings] = await db
        .insert(saleSectionSettings)
        .values({
          title: 'SUMMER SALES',
          isActive: true,
        })
        .returning();
      return newSettings;
    }
    return settings;
  } catch (error) {
    console.error('Failed to get sale settings:', error);
    return null;
  }
}

export async function updateSaleSettings(data: { title: string; isActive: boolean }) {
  try {
    const settings = await getSaleSettings();
    if (settings) {
      await db
        .update(saleSectionSettings)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(saleSectionSettings.id, settings.id));
    }
    revalidatePath('/homepage');
    await revalidateStorefront(['settings']);
    return { success: true };
  } catch (error) {
    console.error('Failed to update sale settings:', error);
    return { error: 'Failed to update settings' };
  }
}

export async function getSaleSectionProducts() {
  try {
    return await db.query.homepageSaleProducts.findMany({
      orderBy: [asc(homepageSaleProducts.position)],
      with: {
        product: {
          with: {
            gallery: {
              with: {
                asset: true,
              },
              where: (assets, { eq }) => eq(assets.isPrimary, true),
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch sale section products:', error);
    return [];
  }
}

export async function getEligibleSaleProducts() {
  try {
    // Only products with a discountPrice are eligible for the sale section
    return await db.query.products.findMany({
      where: (products, { isNotNull, eq }) =>
        and(isNotNull(products.discountPrice), eq(products.isActive, true)),
      with: {
        gallery: {
          with: {
            asset: true,
          },
          where: (assets, { eq }) => eq(assets.isPrimary, true),
        },
      },
    });
  } catch (error) {
    // Need to import 'and' from drizzle-orm if I use it here,
    // but the above is wrong because db.query helper uses a different syntax.
    // Let's fix the syntax based on findMany usage.
    console.error('Failed to fetch eligible products:', error);
    return [];
  }
}

// Correcting the function with proper query syntax
export async function getEligibleProducts() {
  try {
    const allProducts = await db.query.products.findMany({
      where: (products, { isNotNull, eq, and }) =>
        and(isNotNull(products.discountPrice), eq(products.isActive, true)),
      with: {
        gallery: {
          with: {
            asset: true,
          },
        },
      },
    });
    return allProducts;
  } catch (error) {
    console.error('Failed to fetch eligible products:', error);
    return [];
  }
}

export async function addProductToSaleSection(productId: string) {
  try {
    // Get current count for position
    const current = await db.query.homepageSaleProducts.findMany();

    // Check if already exists
    const existing = current.find((p) => p.productId === productId);
    if (existing) return { error: 'Product already in sale section' };

    await db.insert(homepageSaleProducts).values({
      productId,
      position: current.length,
    });

    revalidatePath('/homepage');
    await revalidateStorefront(['products']);
    return { success: true };
  } catch (error) {
    console.error('Failed to add product back to sale section:', error);
    return { error: 'Failed to add product' };
  }
}

export async function removeProductFromSaleSection(productId: string) {
  try {
    await db.delete(homepageSaleProducts).where(eq(homepageSaleProducts.productId, productId));
    revalidatePath('/homepage');
    await revalidateStorefront(['products']);
    return { success: true };
  } catch (error) {
    console.error('Failed to remove product from sale section:', error);
    return { error: 'Failed to remove product' };
  }
}

export async function reorderSaleProducts(productIds: string[]) {
  try {
    await db.transaction(async (tx) => {
      // 1. Delete all currently selected products for the homepage sale section
      await tx.delete(homepageSaleProducts);

      // 2. Insert the new list in the specified order
      if (productIds.length > 0) {
        await tx.insert(homepageSaleProducts).values(
          productIds.map((productId, index) => ({
            productId,
            position: index,
          }))
        );
      }
    });

    revalidatePath('/homepage');
    await revalidateStorefront(['products']);
    return { success: true };
  } catch (error) {
    console.error('Failed to sync sale products:', error);
    return { error: 'Failed to update selected products' };
  }
}
