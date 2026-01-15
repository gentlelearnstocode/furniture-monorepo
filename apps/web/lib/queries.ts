import { db } from '@repo/database';
import { createCachedQuery } from './cache';

export const getSiteContacts = createCachedQuery(
  async () => {
    return await db.query.siteContacts.findMany({
      where: (contacts, { eq }) => eq(contacts.isActive, true),
      orderBy: (contacts, { asc }) => [asc(contacts.position)],
    });
  },
  ['site-contacts'],
  { revalidate: 3600, tags: ['contacts'] }
);
