'use server';

import { db, catalogs } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createCatalogSchema, type CreateCatalogInput } from '@/lib/validations/catalogs';

export async function createCatalog(data: CreateCatalogInput) {
  const validated = createCatalogSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  const { name, slug, description, parentId, imageId } = validated.data;

  try {
    // Check for existing slug
    const existing = await db.query.catalogs.findFirst({
      where: (catalogs, { eq }) => eq(catalogs.slug, slug),
    });

    if (existing) {
      return { error: 'Slug already exists.' };
    }

    await db.insert(catalogs).values({
      name,
      slug,
      description: description || null,
      parentId: parentId || null,
      imageId: imageId || null,
    });
  } catch (error) {
    console.error('Failed to create catalog:', error);
    return { error: 'Database error: Failed to create catalog.' };
  }

  revalidatePath('/catalogs');
  return { success: true };
}

export async function updateCatalog(id: string, data: CreateCatalogInput) {
  const validated = createCatalogSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  const { name, slug, description, parentId, imageId } = validated.data;

  try {
    // Check for existing slug on other catalogs
    const existing = await db.query.catalogs.findFirst({
      where: (catalogs, { eq, and, ne }) => and(eq(catalogs.slug, slug), ne(catalogs.id, id)),
    });

    if (existing) {
      return { error: 'Slug already exists.' };
    }

    await db
      .update(catalogs)
      .set({
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
        imageId: imageId || null,
        updatedAt: new Date(),
      })
      .where(eq(catalogs.id, id));
  } catch (error) {
    console.error('Failed to update catalog:', error);
    return { error: 'Database error: Failed to update catalog.' };
  }

  revalidatePath('/catalogs');
  return { success: true };
}

export async function deleteCatalog(id: string) {
  try {
    await db.delete(catalogs).where(eq(catalogs.id, id));
    revalidatePath('/catalogs');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete catalog:', error);
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      return { error: 'This catalog cannot be deleted because it is still being referenced.' };
    }
    return { error: 'Database error: Failed to delete catalog.' };
  }
}
