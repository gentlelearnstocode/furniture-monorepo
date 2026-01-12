'use server';

import { db, collections, collectionProducts, catalogCollections } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createCollectionSchema, type CreateCollectionInput } from '@/lib/validations/collections';

export async function createCollection(data: CreateCollectionInput) {
  const validated = createCollectionSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  const {
    name,
    slug,
    description,
    bannerId,
    isActive,
    showOnHome,
    homeLayout,
    productIds,
    catalogIds,
  } = validated.data;

  try {
    // Check for existing slug
    const existing = await db.query.collections.findFirst({
      where: (collections, { eq }) => eq(collections.slug, slug),
    });

    if (existing) {
      return { error: 'Slug already exists.' };
    }

    const [collection] = await db
      .insert(collections)
      .values({
        name,
        slug,
        description: description || null,
        bannerId: bannerId || null,
        isActive: isActive ?? true,
        showOnHome: showOnHome ?? false,
        homeLayout: homeLayout || 'full',
      })
      .returning();

    if (collection && productIds && productIds.length > 0) {
      await db.insert(collectionProducts).values(
        productIds.map((productId) => ({
          collectionId: collection.id,
          productId,
        }))
      );
    }

    if (collection && catalogIds && catalogIds.length > 0) {
      await db.insert(catalogCollections).values(
        catalogIds.map((catalogId) => ({
          collectionId: collection.id,
          catalogId,
        }))
      );
    }
  } catch (error) {
    console.error('Failed to create collection:', error);
    return { error: 'Database error: Failed to create collection.' };
  }

  revalidatePath('/collections');
  redirect('/collections');
}

export async function updateCollection(id: string, data: CreateCollectionInput) {
  const validated = createCollectionSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  const {
    name,
    slug,
    description,
    bannerId,
    isActive,
    showOnHome,
    homeLayout,
    productIds,
    catalogIds,
  } = validated.data;

  try {
    // Check if slug is taken by another collection
    const existing = await db.query.collections.findFirst({
      where: (collections, { eq, and, ne }) =>
        and(eq(collections.slug, slug), ne(collections.id, id)),
    });

    if (existing) {
      return { error: 'Slug already exists.' };
    }

    await db
      .update(collections)
      .set({
        name,
        slug,
        description: description || null,
        bannerId: bannerId || null,
        isActive: isActive ?? true,
        showOnHome: showOnHome ?? false,
        homeLayout: homeLayout || 'full',
        updatedAt: new Date(),
      })
      .where(eq(collections.id, id));

    // Sync products
    await db.delete(collectionProducts).where(eq(collectionProducts.collectionId, id));

    if (productIds && productIds.length > 0) {
      await db.insert(collectionProducts).values(
        productIds.map((productId) => ({
          collectionId: id,
          productId,
        }))
      );
    }

    // Sync catalogs
    await db.delete(catalogCollections).where(eq(catalogCollections.collectionId, id));

    if (catalogIds && catalogIds.length > 0) {
      await db.insert(catalogCollections).values(
        catalogIds.map((catalogId) => ({
          collectionId: id,
          catalogId,
        }))
      );
    }
  } catch (error) {
    console.error('Failed to update collection:', error);
    return { error: 'Database error: Failed to update collection.' };
  }

  revalidatePath('/collections');
  revalidatePath(`/collections/${id}`);
  return { success: true };
}

export async function deleteCollection(id: string) {
  try {
    await db.delete(collections).where(eq(collections.id, id));
  } catch (error) {
    console.error('Failed to delete collection:', error);
    return { error: 'Database error: Failed to delete collection.' };
  }

  revalidatePath('/collections');
  return { success: true };
}

export async function toggleCollectionHomeVisibility(id: string, value: boolean) {
  try {
    await db
      .update(collections)
      .set({
        showOnHome: value,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, id));
  } catch (error) {
    console.error('Failed to toggle collection home visibility:', error);
    return { error: 'Database error: Failed to update visibility.' };
  }

  revalidatePath('/collections');
  revalidatePath('/homepage/collections');
  return { success: true };
}
