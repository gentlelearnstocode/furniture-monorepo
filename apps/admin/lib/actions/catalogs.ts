'use server';

import { db, catalogs } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createCatalogSchema, type CreateCatalogInput } from '@/lib/validations/catalogs';
import { revalidateStorefront } from '../revalidate-storefront';
import { createNotification } from '../notifications';
import { auth } from '@/auth';

export async function createCatalog(data: CreateCatalogInput) {
  const session = await auth();
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

    // Determine level: if parentId is set, it's level 2, otherwise level 1
    const level = parentId ? 2 : 1;

    await db.insert(catalogs).values({
      name,
      slug,
      description: description || null,
      parentId: parentId || null,
      level,
      imageId: imageId || null,

      createdById: session?.user?.id || null,
    });

    await createNotification({
      type: 'entity_created',
      title: 'New Catalog Created',
      message: `Catalog "${name}" has been created successfully.`,
      link: '/catalogs',
    });
  } catch (error) {
    console.error('Failed to create catalog:', error);
    return { error: 'Database error: Failed to create catalog.' };
  }

  revalidatePath('/catalogs');
  await revalidateStorefront(['catalogs']);
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

    // Determine level: if parentId is set, it's level 2, otherwise level 1
    const level = parentId ? 2 : 1;

    await db
      .update(catalogs)
      .set({
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
        level,
        imageId: imageId || null,

        updatedAt: new Date(),
      })
      .where(eq(catalogs.id, id));

    await createNotification({
      type: 'entity_updated',
      title: 'Catalog Updated',
      message: `Catalog "${name}" has been updated.`,
      link: '/catalogs',
    });
  } catch (error) {
    console.error('Failed to update catalog:', error);
    return { error: 'Database error: Failed to update catalog.' };
  }

  revalidatePath('/catalogs');
  await revalidateStorefront(['catalogs']);
  return { success: true };
}

export async function deleteCatalog(id: string) {
  try {
    await db.delete(catalogs).where(eq(catalogs.id, id));
    revalidatePath('/catalogs');
    await revalidateStorefront(['catalogs']);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete catalog:', error);
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      return { error: 'This catalog cannot be deleted because it is still being referenced.' };
    }
    return { error: 'Database error: Failed to delete catalog.' };
  }
}

export async function bulkDeleteCatalogs(ids: string[]) {
  try {
    const { inArray } = await import('drizzle-orm');
    await db.delete(catalogs).where(inArray(catalogs.id, ids));
    revalidatePath('/catalogs');
    await revalidateStorefront(['catalogs']);
    return { success: true };
  } catch (error) {
    console.error('Failed to bulk delete catalogs:', error);
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      return {
        error: 'One or more catalogs cannot be deleted because they are still being referenced.',
      };
    }
    return { error: 'Failed to bulk delete catalogs' };
  }
}
