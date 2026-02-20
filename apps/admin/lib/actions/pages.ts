'use server';

import { db, customPages } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { customPageSchema, type CustomPageInput } from '@/lib/validations/pages';
import { revalidateStorefront } from '../revalidate-storefront';
import { type CustomPage } from '@repo/shared';

export async function getCustomPageBySlug(slug: string): Promise<CustomPage | null> {
  try {
    const page = await db.query.customPages.findFirst({
      where: (pages, { eq }) => eq(pages.slug, slug),
    });
    return (page as CustomPage) || null;
  } catch (error) {
    console.error(`Failed to fetch custom page ${slug}:`, error);
    return null;
  }
}

export async function upsertCustomPage(data: CustomPageInput) {
  const validated = customPageSchema.safeParse(data);

  if (!validated.success) {
    return { error: 'Invalid fields' };
  }

  try {
    const existing = await db.query.customPages.findFirst({
      where: (pages, { eq }) => eq(pages.slug, validated.data.slug),
    });

    if (existing) {
      await db
        .update(customPages)
        .set({
          ...validated.data,
          updatedAt: new Date(),
        })
        .where(eq(customPages.id, existing.id));
    } else {
      await db.insert(customPages).values(validated.data);
    }

    revalidatePath(`/pages/${validated.data.slug}`);
    await revalidateStorefront([`page-${validated.data.slug}`]);

    return { success: true };
  } catch (error) {
    console.error('Error in upsertCustomPage:', error);
    return { error: 'Database error: Failed to update page.' };
  }
}
