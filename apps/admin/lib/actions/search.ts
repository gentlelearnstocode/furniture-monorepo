'use server';

import {
  db,
  products,
  catalogs,
  collections,
  services,
  projects,
  posts,
  users,
} from '@repo/database';
import { ilike, or } from 'drizzle-orm';
import { auth } from '@/auth';

export type SearchResult = {
  id: string;
  title: string;
  type: 'product' | 'catalog' | 'collection' | 'service' | 'project' | 'blog' | 'user';
  href: string;
  subtitle?: string;
};

export async function searchEntities(query: string): Promise<SearchResult[]> {
  const session = await auth();
  if (!session) {
    return [];
  }

  if (!query || query.length < 2) {
    return [];
  }

  const searchTerm = `%${query}%`;

  try {
    const [dbProducts, dbCatalogs, dbCollections, dbServices, dbProjects, dbPosts, dbUsers] =
      await Promise.all([
        db.query.products.findMany({
          where: or(ilike(products.name, searchTerm), ilike(products.slug, searchTerm)),
          limit: 5,
        }),
        db.query.catalogs.findMany({
          where: or(ilike(catalogs.name, searchTerm), ilike(catalogs.slug, searchTerm)),
          limit: 5,
        }),
        db.query.collections.findMany({
          where: or(ilike(collections.name, searchTerm), ilike(collections.slug, searchTerm)),
          limit: 5,
        }),
        db.query.services.findMany({
          where: or(ilike(services.title, searchTerm), ilike(services.slug, searchTerm)),
          limit: 5,
        }),
        db.query.projects.findMany({
          where: or(ilike(projects.title, searchTerm), ilike(projects.slug, searchTerm)),
          limit: 5,
        }),
        db.query.posts.findMany({
          where: or(ilike(posts.title, searchTerm), ilike(posts.slug, searchTerm)),
          limit: 5,
        }),
        db.query.users.findMany({
          where: or(
            ilike(users.name, searchTerm),
            ilike(users.email, searchTerm),
            ilike(users.username, searchTerm)
          ),
          limit: 5,
        }),
      ]);

    const results: SearchResult[] = [
      ...dbProducts.map((p) => ({
        id: p.id,
        title: p.name,
        type: 'product' as const,
        href: `/products/${p.id}`,
        subtitle: p.slug,
      })),
      ...dbCatalogs.map((c) => ({
        id: c.id,
        title: c.name,
        type: 'catalog' as const,
        href: `/catalogs/${c.id}`,
        subtitle: c.slug,
      })),
      ...dbCollections.map((c) => ({
        id: c.id,
        title: c.name,
        type: 'collection' as const,
        href: `/collections/${c.id}`,
        subtitle: c.slug,
      })),
      ...dbServices.map((s) => ({
        id: s.id,
        title: s.title,
        type: 'service' as const,
        href: `/services/${s.id}`,
        subtitle: s.slug,
      })),
      ...dbProjects.map((p) => ({
        id: p.id,
        title: p.title,
        type: 'project' as const,
        href: `/projects/${p.id}`,
        subtitle: p.slug,
      })),
      ...dbPosts.map((p) => ({
        id: p.id,
        title: p.title,
        type: 'blog' as const,
        href: `/blogs/${p.id}`,
        subtitle: p.slug,
      })),
      ...dbUsers.map((u) => ({
        id: u.id,
        title: u.name || 'Unknown',
        type: 'user' as const,
        href: `/users/${u.id}`,
        subtitle: u.email || undefined,
      })),
    ];

    return results;
  } catch (error) {
    console.error('[searchEntities] Error:', error);
    return [];
  }
}
