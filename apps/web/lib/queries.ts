import { db } from '@repo/database';
import { createCachedQuery } from './cache';

export const getHeroData = createCachedQuery(
  async () => {
    return await db.query.siteHeros.findFirst({
      where: (heros, { eq }) => eq(heros.isActive, true),
      orderBy: (heros, { desc }) => [desc(heros.updatedAt)],
      with: {
        backgroundImage: true,
        backgroundVideo: true,
      },
    });
  },
  ['hero-data'],
  { revalidate: 1800, tags: ['hero'] },
);

export const getSiteContacts = createCachedQuery(
  async () => {
    return await db.query.siteContacts.findMany({
      where: (contacts, { eq }) => eq(contacts.isActive, true),
      orderBy: (contacts, { asc }) => [asc(contacts.position)],
    });
  },
  ['site-contacts'],
  { revalidate: 3600, tags: ['contacts'] },
);

export const getIntroData = createCachedQuery(
  async () => {
    return await db.query.siteIntros.findFirst({
      where: (intros, { eq }) => eq(intros.isActive, true),
      orderBy: (intros, { desc }) => [desc(intros.updatedAt)],
      with: {
        introImage: true,
        backgroundImage: true,
      },
    });
  },
  ['intro-data'],
  { revalidate: 3600, tags: ['intro'] },
);

export const getSaleProducts = createCachedQuery(
  async (limit?: number, sort?: string) => {
    return await db.query.products.findMany({
      where: (products, { isNotNull, eq, and }) =>
        and(isNotNull(products.discountPrice), eq(products.isActive, true)),
      with: {
        gallery: {
          with: {
            asset: true,
          },
          orderBy: (gallery, { asc }) => [asc(gallery.position)],
        },
      },
      orderBy: (products, { asc, desc }) => {
        switch (sort) {
          case 'name_desc':
            return [desc(products.name)];
          case 'price_asc':
            return [asc(products.basePrice)];
          case 'price_desc':
            return [desc(products.basePrice)];
          case 'name_asc':
          default:
            return [asc(products.name)];
        }
      },
      limit,
    });
  },
  ['sale-products'],
  { revalidate: 3600, tags: ['products'] },
);

export const getHomepageSaleProducts = createCachedQuery(
  async () => {
    const saleItems = await db.query.homepageSaleProducts.findMany({
      orderBy: (items, { asc }) => [asc(items.position)],
      limit: 10,
      with: {
        product: {
          with: {
            gallery: {
              with: {
                asset: true,
              },
              orderBy: (gallery, { asc }) => [asc(gallery.position)],
            },
          },
        },
      },
    });
    return saleItems.map((item) => item.product);
  },
  ['homepage-sale-products'],
  { revalidate: 3600, tags: ['products'] },
);

export const getSaleSettings = createCachedQuery(
  async () => {
    return await db.query.saleSectionSettings.findFirst();
  },
  ['sale-settings'],
  { revalidate: 3600, tags: ['settings'] },
);

export const getSaleProductsByCatalog = createCachedQuery(
  async (catalogSlug: string) => {
    const catalog = await db.query.catalogs.findFirst({
      where: (catalogs, { eq }) => eq(catalogs.slug, catalogSlug),
    });

    if (!catalog) return [];

    // Products can be in subcatalogs. If this is a level 1 catalog, we need to find products in ALL subcatalogs.
    // However, the products are linked to subcatalogs (level 2).

    // Simplification for now: find all products under this catalog (level 2) or children of this catalog.
    const subcatalogIds = await db.query.catalogs
      .findMany({
        where: (catalogs, { eq }) => eq(catalogs.parentId, catalog.id),
        columns: { id: true },
      })
      .then((res) => res.map((c) => c.id));

    const targetIds = [catalog.id, ...subcatalogIds];

    const { inArray } = await import('drizzle-orm');

    return await db.query.products.findMany({
      where: (products, { isNotNull, eq, and }) =>
        and(
          isNotNull(products.discountPrice),
          eq(products.isActive, true),
          inArray(products.catalogId, targetIds),
        ),
      with: {
        gallery: {
          with: {
            asset: true,
          },
          orderBy: (gallery, { asc }) => [asc(gallery.position)],
        },
      },
    });
  },
  ['catalog-sale-products'],
  { revalidate: 3600, tags: ['products', 'catalogs'] },
);
export const getCustomPageBySlug = createCachedQuery(
  async (slug: string) => {
    return await db.query.customPages.findFirst({
      where: (pages, { eq }) => eq(pages.slug, slug),
    });
  },
  ['custom-page'],
  {
    revalidate: 3600,
    tags: (slug: string) => ['pages', `page-${slug}`],
  },
);
