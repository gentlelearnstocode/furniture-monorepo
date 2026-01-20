import { notFound } from 'next/navigation';
import { db } from '@repo/database';
import { CatalogDetailWrapper } from './components/catalog-detail-wrapper';
import { SubCatalogGrid } from './components/sub-catalog-grid';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { createCachedQuery } from '@/lib/cache';
import { getLocale, getLocalizedText } from '@/lib/i18n';
import { getTranslations } from 'next-intl/server';

import type { Metadata } from 'next';

// Revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const catalog = await db.query.catalogs.findFirst({
    where: (catalogs, { eq }) => eq(catalogs.slug, slug),
  });

  if (!catalog) {
    return {
      title: 'Catalog Not Found',
    };
  }

  const name = getLocalizedText(catalog, 'name', locale);

  return {
    title: `${name} | Thien An Furniture`,
    description: `Browse our ${name} collection - handcrafted luxury furniture.`,
  };
}

// Generate static params for all catalogs at build time
export async function generateStaticParams() {
  const catalogs = await db.query.catalogs.findMany({
    columns: { slug: true },
  });

  return catalogs.map((catalog) => ({
    slug: catalog.slug,
  }));
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const getCatalogBySlug = (slug: string) =>
  createCachedQuery(
    async () => {
      return await db.query.catalogs.findFirst({
        where: (catalogs, { eq }) => eq(catalogs.slug, slug),
        with: {
          children: {
            with: {
              image: true,
            },
          },
          collections: {
            with: {
              collection: {
                with: {
                  banner: true,
                  products: {
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
                  },
                },
              },
            },
          },
          products: {
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
    },
    ['catalog-detail', slug],
    { revalidate: 3600, tags: ['catalogs', `catalog-${slug}`] },
  );

export default async function CatalogPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const tb = await getTranslations('Breadcrumbs');

  // Fetch the catalog and its linked collections/products
  const catalog = await getCatalogBySlug(slug)();

  if (!catalog) {
    notFound();
  }

  // Prepare collections data for the client component (Level 1 catalogs)
  type CollectionData = {
    id: string;
    name: string;
    nameVi: string | null;
    bannerUrl: string | null;
    products: {
      id: string;
      name: string;
      nameVi: string | null;
      slug: string;
      shortDescription: string | null;
      shortDescriptionVi: string | null;
      gallery: {
        isPrimary: boolean;
        asset: { url: string } | null;
        // Display settings from admin
        focusPoint: { x: number; y: number } | null;
        aspectRatio: string | null;
        objectFit: string | null;
      }[];
    }[];
  };

  let collectionsData: CollectionData[] = [];

  if (catalog.level === 1) {
    // Level 1 catalog: Use collections with their banner images
    collectionsData = catalog.collections.map((cc) => ({
      id: cc.collection.id,
      name: cc.collection.name,
      nameVi: cc.collection.nameVi,
      bannerUrl: cc.collection.banner?.url || null,
      products: cc.collection.products.map((cp) => ({
        id: cp.product.id,
        name: cp.product.name,
        nameVi: cp.product.nameVi,
        slug: cp.product.slug,
        shortDescription: cp.product.shortDescription,
        shortDescriptionVi: cp.product.shortDescriptionVi,
        gallery: cp.product.gallery.map((g) => ({
          isPrimary: g.isPrimary,
          asset: g.asset ? { url: g.asset.url } : null,
          // Include display settings
          focusPoint: g.focusPoint as { x: number; y: number } | null,
          aspectRatio: g.aspectRatio,
          objectFit: g.objectFit,
        })),
      })),
    }));
  } else if (catalog.level === 2) {
    // Level 2 catalog: Create a single virtual collection with products directly assigned
    collectionsData = [
      {
        id: catalog.id,
        name: catalog.name,
        nameVi: catalog.nameVi,
        bannerUrl: null, // Level 2 catalogs don't have banner images in the same way
        products: catalog.products.map((product) => ({
          id: product.id,
          name: product.name,
          nameVi: product.nameVi,
          slug: product.slug,
          shortDescription: product.shortDescription,
          shortDescriptionVi: product.shortDescriptionVi,
          gallery: product.gallery.map((g) => ({
            isPrimary: g.isPrimary,
            asset: g.asset ? { url: g.asset.url } : null,
            // Include display settings
            focusPoint: g.focusPoint as { x: number; y: number } | null,
            aspectRatio: g.aspectRatio,
            objectFit: g.objectFit,
          })),
        })),
      },
    ];
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          { label: getLocalizedText(catalog, 'name', locale) },
        ]}
      />

      {/* Client component handles slider + shop the look with collection state */}
      <CatalogDetailWrapper collections={collectionsData} />

      {/* Catalog Level 2 Section - Only show for Level 1 catalogs */}
      {catalog.level === 1 && catalog.children.length > 0 && (
        <SubCatalogGrid
          subCatalogs={catalog.children}
          parentSlug={catalog.slug}
          showSeparator={collectionsData.length > 0}
        />
      )}
    </div>
  );
}
