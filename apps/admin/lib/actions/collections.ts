'use server';

import { db, collections, collectionProducts, catalogCollections } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createCollectionSchema, type CreateCollectionInput } from '@/lib/validations/collections';
import { revalidateStorefront } from '../revalidate-storefront';
import { createNotification } from '../notifications';
import { auth } from '@/auth';

export async function createCollection(data: CreateCollectionInput) {
  const session = await auth();
  const validated = createCollectionSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  const {
    name,
    nameVi,
    slug,
    description,
    descriptionVi,
    bannerId,
    isActive,
    productIds,
    catalogIds,
  } = validated.data;

  console.log('Creating collection with catalogIds:', catalogIds);

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
        nameVi: nameVi || null,
        slug,
        description: description || null,
        descriptionVi: descriptionVi || null,
        bannerId: bannerId || null,
        isActive: isActive ?? true,
        createdById: session?.user?.id || null,
      })
      .returning();

    if (collection) {
      await createNotification({
        type: 'entity_created',
        title: 'New Collection Created',
        message: `Collection "${name}" has been created successfully.`,
        link: '/collections',
      });
    }

    if (collection && productIds && productIds.length > 0) {
      await db.insert(collectionProducts).values(
        productIds.map((productId) => ({
          collectionId: collection.id,
          productId,
        })),
      );
    }

    if (collection && catalogIds && catalogIds.length > 0) {
      console.log('Inserting catalog associations:', catalogIds);
      await db.insert(catalogCollections).values(
        catalogIds.map((catalogId) => ({
          collectionId: collection.id,
          catalogId,
        })),
      );
    } else {
      console.log('No catalogIds to insert');
    }
  } catch (error) {
    console.error('Failed to create collection:', error);
    return { error: 'Database error: Failed to create collection.' };
  }

  revalidatePath('/collections');
  await revalidateStorefront(['collections', 'catalogs']);
  redirect('/collections');
}

export async function updateCollection(id: string, data: CreateCollectionInput) {
  const validated = createCollectionSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  const {
    name,
    nameVi,
    slug,
    description,
    descriptionVi,
    bannerId,
    isActive,
    productIds,
    catalogIds,
  } = validated.data;

  console.log('Updating collection with catalogIds:', catalogIds);

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
        nameVi: nameVi || null,
        slug,
        description: description || null,
        descriptionVi: descriptionVi || null,
        bannerId: bannerId || null,
        isActive: isActive ?? true,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, id));

    await createNotification({
      type: 'entity_updated',
      title: 'Collection Updated',
      message: `Collection "${name}" has been updated.`,
      link: `/collections/${id}`,
    });

    // Sync products
    await db.delete(collectionProducts).where(eq(collectionProducts.collectionId, id));

    if (productIds && productIds.length > 0) {
      await db.insert(collectionProducts).values(
        productIds.map((productId) => ({
          collectionId: id,
          productId,
        })),
      );
    }

    // Sync catalogs
    await db.delete(catalogCollections).where(eq(catalogCollections.collectionId, id));

    if (catalogIds && catalogIds.length > 0) {
      console.log('Inserting catalog associations for update:', catalogIds);
      await db.insert(catalogCollections).values(
        catalogIds.map((catalogId) => ({
          collectionId: id,
          catalogId,
        })),
      );
    } else {
      console.log('No catalogIds to update');
    }
  } catch (error) {
    console.error('Failed to update collection:', error);
    return { error: 'Database error: Failed to update collection.' };
  }

  revalidatePath('/collections');
  revalidatePath(`/collections/${id}`);
  await revalidateStorefront(['collections', 'catalogs']);
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
  await revalidateStorefront(['collections']);
  return { success: true };
}

export async function bulkDeleteCollections(ids: string[]) {
  try {
    const { inArray } = await import('drizzle-orm');
    await db.delete(collections).where(inArray(collections.id, ids));
    revalidatePath('/collections');
    await revalidateStorefront(['collections']);
    return { success: true };
  } catch (error) {
    console.error('Failed to bulk delete collections:', error);
    return { error: 'Failed to bulk delete collections' };
  }
}
