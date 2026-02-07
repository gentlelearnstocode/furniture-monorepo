'use server';

import { db, showrooms } from '@repo/database';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { showroomSchema, type ShowroomInput } from '@/lib/validations/showrooms';
import { revalidateStorefront } from '../revalidate-storefront';

export async function getShowrooms() {
  try {
    const items = await db.query.showrooms.findMany({
      orderBy: [asc(showrooms.position)],
      with: {
        image: true,
      },
    });
    return items;
  } catch (error) {
    console.error('Failed to fetch showrooms:', error);
    return [];
  }
}

export async function upsertShowroom(data: ShowroomInput) {
  const validated = showroomSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  try {
    if (data.id) {
      await db
        .update(showrooms)
        .set({
          ...validated.data,
          updatedAt: new Date(),
        })
        .where(eq(showrooms.id, data.id));
    } else {
      // Get max position to append to end
      const existing = await db.query.showrooms.findMany({
        columns: { position: true },
        orderBy: [asc(showrooms.position)],
      });
      const maxPosition = existing.length > 0 ? Math.max(...existing.map((e) => e.position)) : -1;

      await db.insert(showrooms).values({
        ...validated.data,
        position: maxPosition + 1,
      });
    }

    revalidatePath('/pages/showroom-factory');
    await revalidateStorefront(['showrooms']);
    return { success: true };
  } catch (error) {
    console.error('Error in upsertShowroom:', error);
    return { error: 'Database error: Failed to save showroom.' };
  }
}

export async function deleteShowroom(id: string) {
  try {
    await db.delete(showrooms).where(eq(showrooms.id, id));
    revalidatePath('/pages/showroom-factory');
    await revalidateStorefront(['showrooms']);
    return { success: true };
  } catch (error) {
    console.error('Error deleting showroom:', error);
    return { error: 'Failed to delete showroom' };
  }
}

export async function reorderShowrooms(items: { id: string; position: number }[]) {
  try {
    await db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .update(showrooms)
          .set({ position: item.position })
          .where(eq(showrooms.id, item.id));
      }
    });
    revalidatePath('/pages/showroom-factory');
    await revalidateStorefront(['showrooms']);
    return { success: true };
  } catch (error) {
    console.error('Error reordering showrooms:', error);
    return { error: 'Failed to reorder showrooms' };
  }
}
