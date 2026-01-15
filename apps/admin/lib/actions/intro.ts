'use server';

import { db, siteIntros } from '@repo/database';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { introSchema, type IntroInput } from '@/lib/validations/intro';
import { revalidateStorefront } from '../revalidate-storefront';

export async function getIntro() {
  try {
    const intro = await db.query.siteIntros.findFirst({
      orderBy: (intros, { desc }) => [desc(intros.updatedAt)],
    });
    return intro;
  } catch (error) {
    console.error('Failed to fetch intro:', error);
    return null;
  }
}

export async function upsertIntro(data: IntroInput) {
  console.log('[upsertIntro] Received data:', data);
  const validated = introSchema.safeParse(data);

  if (!validated.success) {
    console.error('[upsertIntro] Validation failed:', validated.error.flatten());
    return { error: 'Invalid fields' };
  }

  try {
    console.log('[upsertIntro] Updating/Inserting into DB');
    // Treat as singleton: always update the first/most recent record if it exists
    const existing = await db.query.siteIntros.findFirst({
      orderBy: (intros, { desc }) => [desc(intros.updatedAt)],
    });

    if (existing) {
      console.log('[upsertIntro] Updating existing record:', existing.id);
      await db
        .update(siteIntros)
        .set({
          ...validated.data,
          updatedAt: new Date(),
        })
        .where(eq(siteIntros.id, existing.id));
    } else {
      console.log('[upsertIntro] Inserting new record');
      await db.insert(siteIntros).values(validated.data);
    }

    console.log('[upsertIntro] Revalidating paths');
    revalidatePath('/');
    revalidatePath('/homepage/intro');
    revalidatePath('/intro'); // legacy if still used
    await revalidateStorefront(['intro']);

    console.log('[upsertIntro] Success');
    return { success: true };
  } catch (error) {
    console.error('[upsertIntro] Error:', error);
    return { error: 'Database error: Failed to update intro.' };
  }
}
