'use server';

import { db, siteHeros } from '@repo/database';
import { eq, desc } from 'drizzle-orm';
import { heroSchema, type HeroInput } from '../validations/hero';
import { revalidatePath } from 'next/cache';

export async function getHero() {
  try {
    const hero = await db.query.siteHeros.findFirst({
      orderBy: [desc(siteHeros.updatedAt)],
      with: {
        backgroundImage: true,
        backgroundVideo: true,
      },
    });
    return hero;
  } catch (error) {
    console.error('[getHero] Error:', error);
    return null;
  }
}

export async function upsertHero(data: HeroInput) {
  try {
    const validated = heroSchema.parse(data);

    // For now, we only keep one active hero or just update the latest one
    const existing = await db.query.siteHeros.findFirst({
      orderBy: [desc(siteHeros.updatedAt)],
    });

    if (existing) {
      await db
        .update(siteHeros)
        .set({
          ...validated,
          updatedAt: new Date(),
        })
        .where(eq(siteHeros.id, existing.id));
    } else {
      await db.insert(siteHeros).values({
        ...validated,
        title: validated.title, // Ensure title is present for TS
      });
    }

    revalidatePath('/homepage/hero');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('[upsertHero] Error:', error);
    return { error: 'Failed to update hero section' };
  }
}
