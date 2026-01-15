import { db } from '@repo/database';

export async function getSiteContacts() {
  return await db.query.siteContacts.findMany({
    where: (contacts, { eq }) => eq(contacts.isActive, true),
    orderBy: (contacts, { asc }) => [asc(contacts.position)],
  });
}
