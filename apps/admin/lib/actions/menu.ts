'use server';

import { db, catalogs, services, navMenuItems } from '@repo/database';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { saveNavMenuItemsSchema, type SaveNavMenuItemsInput } from '@/lib/validations/menu';
import { revalidateStorefront } from '../revalidate-storefront';

// Fetch all nav menu items with their associated catalog/service data
export async function getNavMenuItems() {
  try {
    const items = await db.query.navMenuItems.findMany({
      orderBy: [asc(navMenuItems.position)],
      with: {
        catalog: {
          with: {
            image: true,
            children: {
              with: {
                image: true,
              },
            },
          },
        },
        service: {
          with: {
            image: true,
          },
        },
      },
    });
    return items;
  } catch (error) {
    console.error('Failed to fetch nav menu items:', error);
    return [];
  }
}

// Fetch all catalogs and services for the selector
export async function getCatalogsAndServicesForMenu() {
  try {
    const [catalogsList, servicesList] = await Promise.all([
      db.query.catalogs.findMany({
        with: {
          image: true,
          parent: true,
        },
        orderBy: [asc(catalogs.name)],
      }),
      db.query.services.findMany({
        where: eq(services.isActive, true),
        with: {
          image: true,
        },
        orderBy: [asc(services.title)],
      }),
    ]);

    // Transform catalogs into a flat list with type indicator
    const catalogItems = catalogsList.map((catalog) => ({
      id: catalog.id,
      name: catalog.name,
      slug: catalog.slug,
      type: catalog.level === 1 ? ('catalog' as const) : ('subcatalog' as const),
      parentName: catalog.parent?.name || null,
      image: catalog.image,
    }));

    // Transform services
    const serviceItems = servicesList.map((service) => ({
      id: service.id,
      name: service.title,
      slug: service.slug,
      type: 'service' as const,
      parentName: null,
      image: service.image,
    }));

    return [...catalogItems, ...serviceItems];
  } catch (error) {
    console.error('Failed to fetch catalogs and services:', error);
    return [];
  }
}

// Save nav menu items (replace all existing items)
export async function saveNavMenuItems(data: SaveNavMenuItemsInput) {
  const validated = saveNavMenuItemsSchema.safeParse(data);

  if (!validated.success) {
    console.error('Validation error:', validated.error);
    return { error: 'Invalid menu items data' };
  }

  try {
    // Delete all existing items
    await db.delete(navMenuItems);

    // Insert new items
    if (validated.data.items.length > 0) {
      await db.insert(navMenuItems).values(
        validated.data.items.map((item, index) => ({
          itemType: item.itemType,
          catalogId: item.catalogId || null,
          serviceId: item.serviceId || null,
          position: index,
          isActive: item.isActive ?? true,
        })),
      );
    }

    revalidatePath('/homepage/menu');
    await revalidateStorefront(['menu']);
    return { success: true };
  } catch (error) {
    console.error('Failed to save nav menu items:', error);
    return { error: 'Database error: Failed to save menu items.' };
  }
}
