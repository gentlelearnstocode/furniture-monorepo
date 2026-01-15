'use server';

import { db, siteContacts } from '@repo/database';
import { asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const siteContactSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(['phone', 'zalo', 'facebook', 'messenger', 'email', 'whatsapp']),
  label: z.string().optional(),
  value: z.string().min(1, 'Value is required'),
  isActive: z.boolean().default(true),
  position: z.number().default(0),
});

const siteContactsUpdateSchema = z.object({
  contacts: z.array(siteContactSchema),
});

export type SiteContactInput = z.infer<typeof siteContactSchema>;
export type SiteContactsUpdateInput = z.infer<typeof siteContactsUpdateSchema>;

export async function getSiteContacts() {
  try {
    return await db.query.siteContacts.findMany({
      orderBy: [asc(siteContacts.position)],
    });
  } catch (error) {
    console.error('[getSiteContacts] Error:', error);
    return [];
  }
}

export async function upsertSiteContacts(data: SiteContactsUpdateInput) {
  const validated = siteContactsUpdateSchema.safeParse(data);

  if (!validated.success) {
    console.error('[upsertSiteContacts] Validation failed:', validated.error.flatten());
    return { error: 'Invalid fields' };
  }

  try {
    const { contacts } = validated.data;

    // A simple approach: delete all and re-insert to maintain order and clean up removed ones
    // In a more complex app, we might want to do individual updates
    await db.delete(siteContacts);

    if (contacts.length > 0) {
      await db.insert(siteContacts).values(
        contacts.map((contact, index) => ({
          type: contact.type,
          label: contact.label || null,
          value: contact.value,
          isActive: contact.isActive,
          position: index,
        }))
      );
    }

    revalidatePath('/', 'layout');
    revalidatePath('/homepage/contacts');
    return { success: true };
  } catch (error) {
    console.error('[upsertSiteContacts] Error:', error);
    return { error: 'Database error: Failed to update site contacts.' };
  }
}
