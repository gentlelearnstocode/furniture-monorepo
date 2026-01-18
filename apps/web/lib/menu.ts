import { db, navMenuItems } from '@repo/database';
import { asc } from 'drizzle-orm';
import { createCachedQuery } from './cache';

export interface NavMenuItem {
  id: string;
  itemType: 'catalog' | 'subcatalog' | 'service';
  position: number;
  catalog: {
    id: string;
    name: string;
    slug: string;
    image: { url: string } | null;
    children: {
      id: string;
      name: string;
      slug: string;
      image: { url: string } | null;
    }[];
  } | null;
  service: {
    id: string;
    title: string;
    slug: string;
    image: { url: string } | null;
  } | null;
}

export const getNavMenuItems = createCachedQuery(
  async (): Promise<NavMenuItem[]> => {
    const items = await db.query.navMenuItems.findMany({
      where: (items, { eq }) => eq(items.isActive, true),
      orderBy: [asc(navMenuItems.position)],
      with: {
        catalog: {
          with: {
            image: true,
            children: {
              with: {
                image: true,
              },
              orderBy: (children, { asc }) => [asc(children.name)],
            },
          },
        },
        service: {
          with: {
            image: true,
          },
        },
      },
    });
    return items as NavMenuItem[];
  },
  ['nav-menu-items'],
  { revalidate: 3600, tags: ['menu'] },
);
