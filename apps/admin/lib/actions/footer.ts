'use server';

import { db, siteFooter, footerAddresses, footerContacts, footerSocialLinks } from '@repo/database';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { revalidateStorefront } from '../revalidate-storefront';

import { footerSettingsSchema, type FooterSettingsInput } from '../validations/footer';

export async function getFooterSettings() {
  try {
    const footer = await db.query.siteFooter.findFirst({
      orderBy: (footer, { desc }) => [desc(footer.updatedAt)],
    });

    const addresses = await db.query.footerAddresses.findMany({
      orderBy: [asc(footerAddresses.position)],
    });

    const contacts = await db.query.footerContacts.findMany({
      orderBy: [asc(footerContacts.position)],
    });

    const socialLinks = await db.query.footerSocialLinks.findMany({
      orderBy: [asc(footerSocialLinks.position)],
    });

    return {
      footer,
      addresses,
      contacts,
      socialLinks,
    };
  } catch (error) {
    console.error('[getFooterSettings] Error:', error);
    return { footer: null, addresses: [], contacts: [], socialLinks: [] };
  }
}

export async function upsertFooterSettings(data: FooterSettingsInput) {
  const validated = footerSettingsSchema.safeParse(data);

  if (!validated.success) {
    console.error('[upsertFooterSettings] Validation failed:', validated.error.flatten());
    return { error: 'Invalid fields' };
  }

  try {
    const { addresses, contacts, socialLinks, ...footerData } = validated.data;

    // Upsert main footer settings
    const existing = await db.query.siteFooter.findFirst({
      orderBy: (footer, { desc }) => [desc(footer.updatedAt)],
    });

    if (existing) {
      await db
        .update(siteFooter)
        .set({
          ...footerData,
          updatedAt: new Date(),
        })
        .where(eq(siteFooter.id, existing.id));
    } else {
      await db.insert(siteFooter).values(footerData);
    }

    // Handle addresses - delete all and re-insert
    await db.delete(footerAddresses);
    if (addresses.length > 0) {
      await db.insert(footerAddresses).values(
        addresses.map((addr, index) => ({
          label: addr.label,
          address: addr.address,
          position: index,
        }))
      );
    }

    // Handle contacts - delete all and re-insert
    await db.delete(footerContacts);
    if (contacts.length > 0) {
      await db.insert(footerContacts).values(
        contacts.map((contact, index) => ({
          type: contact.type,
          label: contact.label || null,
          value: contact.value,
          position: index,
        }))
      );
    }

    // Handle social links - delete all and re-insert
    await db.delete(footerSocialLinks);
    if (socialLinks.length > 0) {
      await db.insert(footerSocialLinks).values(
        socialLinks.map((link, index) => ({
          platform: link.platform,
          url: link.url,
          isActive: link.isActive ?? true,
          position: index,
        }))
      );
    }

    revalidatePath('/');
    revalidatePath('/homepage/footer');
    await revalidateStorefront(['footer']);
    return { success: true };
  } catch (error) {
    console.error('[upsertFooterSettings] Error:', error);
    return { error: 'Database error: Failed to update footer settings.' };
  }
}
