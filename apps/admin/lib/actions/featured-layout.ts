'use server';

import { db } from '@repo/database';
import { featuredCatalogRows, featuredCatalogRowItems, catalogs } from '@repo/database/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type LayoutRow = {
  id?: string;
  position: number;
  columns: number;
  items: {
    id?: string;
    catalogId: string;
    position: number;
  }[];
};

export async function getFeaturedLayout() {
  const rows = await db.query.featuredCatalogRows.findMany({
    orderBy: [asc(featuredCatalogRows.position)],
    with: {
      items: {
        with: {
          catalog: {
            with: {
              image: true,
            },
          },
        },
        orderBy: (items, { asc }) => [asc(items.position)],
      },
    },
  });

  return rows;
}

export async function getAvailableCatalogs() {
  // Get Level 1 catalogs that can be featured
  const availableCatalogs = await db.query.catalogs.findMany({
    where: eq(catalogs.level, 1),
    with: {
      image: true,
    },
    orderBy: [asc(catalogs.name)],
  });

  return availableCatalogs;
}

export async function saveFeaturedLayout(layoutRows: LayoutRow[]) {
  try {
    // Delete all existing rows and items (cascade will handle items)
    await db.delete(featuredCatalogRows);

    // Insert new rows and items
    for (const row of layoutRows) {
      // Skip empty rows
      if (row.items.length === 0) continue;

      const [insertedRow] = await db
        .insert(featuredCatalogRows)
        .values({
          position: row.position,
          columns: row.columns,
        })
        .returning();

      if (insertedRow && row.items.length > 0) {
        await db.insert(featuredCatalogRowItems).values(
          row.items.map((item) => ({
            rowId: insertedRow.id,
            catalogId: item.catalogId,
            position: item.position,
          }))
        );
      }
    }

    revalidatePath('/');
    revalidatePath('/homepage/featured');

    return { success: true };
  } catch (error) {
    console.error('Failed to save featured layout:', error);
    return { error: 'Failed to save layout' };
  }
}
