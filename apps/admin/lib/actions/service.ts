'use server';

import { db, services, serviceAssets } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { serviceSchema, type ServiceInput } from '@/lib/validations/service';
import { revalidateStorefront } from '../revalidate-storefront';
import { auth } from '@/auth';

export async function getServices() {
  try {
    const data = await db.query.services.findMany({
      orderBy: (services, { desc }) => [desc(services.updatedAt)],
      with: {
        image: true,
      },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
}

export async function getService(id: string) {
  try {
    const service = await db.query.services.findFirst({
      where: eq(services.id, id),
      with: {
        image: true,
        gallery: {
          with: {
            asset: true,
          },
          orderBy: (assets, { asc }) => [asc(assets.position)],
        },
      },
    });

    if (!service) return null;

    return {
      ...service,
      imageUrl: service.image?.url,
      images: service.gallery.map((g) => ({
        assetId: g.assetId,
        url: g.asset.url,
        isPrimary: g.isPrimary,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return null;
  }
}

export async function upsertService(data: ServiceInput & { id?: string }) {
  const validated = serviceSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const session = await auth();
    const { images, ...serviceData } = validated.data;
    const primaryImage = images.find((img) => img.isPrimary) || images[0];

    const [result] = await db
      .insert(services)
      .values({
        id: data.id,
        ...serviceData,
        imageId: primaryImage?.assetId,
        createdById: data.id ? undefined : session?.user?.id || null, // Only set on create
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: services.id,
        set: {
          ...serviceData,
          imageId: primaryImage?.assetId,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!result) {
      throw new Error('Failed to upsert service');
    }

    if (data.id) {
      await db.delete(serviceAssets).where(eq(serviceAssets.serviceId, result.id));
    }

    if (images.length > 0) {
      await db.insert(serviceAssets).values(
        images.map((img, index) => ({
          serviceId: result.id,
          assetId: img.assetId,
          position: index,
          isPrimary: img.isPrimary,
        }))
      );
    }

    revalidatePath('/services');
    revalidatePath('/'); // Revalidate homepage if services are displayed there
    await revalidateStorefront(['services']);
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return { error: 'Slug already exists' };
    }
    console.error('Failed to upsert service:', error);
    return { error: 'Database error: Failed to save service.' };
  }
}

export async function deleteService(id: string) {
  try {
    await db.delete(services).where(eq(services.id, id));
    revalidatePath('/services');
    revalidatePath('/');
    await revalidateStorefront(['services']);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete service:', error);
    return { error: 'Database error: Failed to delete service.' };
  }
}

export async function bulkDeleteServices(ids: string[]) {
  try {
    const { inArray } = await import('drizzle-orm');
    await db.delete(services).where(inArray(services.id, ids));
    revalidatePath('/services');
    revalidatePath('/');
    await revalidateStorefront(['services']);
    return { success: true };
  } catch (error) {
    console.error('Failed to bulk delete services:', error);
    return { error: 'Failed to bulk delete services' };
  }
}
