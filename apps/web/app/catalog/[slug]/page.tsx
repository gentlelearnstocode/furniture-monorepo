import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@repo/database';
import { CatalogDetailWrapper } from './components/catalog-detail-wrapper';
import { SubCatalogGrid } from './components/sub-catalog-grid';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CatalogPage({ params }: Props) {
  const { slug } = await params;

  // Fetch the catalog and its linked collections/products
  const catalog = await db.query.catalogs.findFirst({
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

  if (!catalog) {
    notFound();
  }

  // Prepare collections data for the client component (Level 1 catalogs)
  type CollectionData = {
    id: string;
    name: string;
    bannerUrl: string | null;
    products: {
      id: string;
      name: string;
      slug: string;
      gallery: {
        isPrimary: boolean;
        asset: { url: string } | null;
      }[];
    }[];
  };

  let collectionsData: CollectionData[] = [];

  if (catalog.level === 1) {
    // Level 1 catalog: Use collections with their banner images
    collectionsData = catalog.collections.map((cc) => ({
      id: cc.collection.id,
      name: cc.collection.name,
      bannerUrl: cc.collection.banner?.url || null,
      products: cc.collection.products.map((cp) => ({
        id: cp.product.id,
        name: cp.product.name,
        slug: cp.product.slug,
        gallery: cp.product.gallery.map((g) => ({
          isPrimary: g.isPrimary,
          asset: g.asset ? { url: g.asset.url } : null,
        })),
      })),
    }));
  } else if (catalog.level === 2) {
    // Level 2 catalog: Create a single virtual collection with products directly assigned
    collectionsData = [
      {
        id: catalog.id,
        name: catalog.name,
        bannerUrl: null, // Level 2 catalogs don't have banner images in the same way
        products: catalog.products.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          gallery: product.gallery.map((g) => ({
            isPrimary: g.isPrimary,
            asset: g.asset ? { url: g.asset.url } : null,
          })),
        })),
      },
    ];
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      {/* Breadcrumb & Catalog Title */}
      <div className='container mx-auto px-4 pt-4 pb-4'>
        <div className='flex items-center gap-2.5 text-[13px] font-serif italic text-gray-400 mb-6'>
          <Link href='/' className='hover:text-black transition-colors duration-300'>
            Home Page
          </Link>
          <ChevronRight size={14} className='text-gray-300' />
          <span className='text-black font-medium'>{catalog.name}</span>
        </div>

        {/* Decorative divider */}
        <div className='relative mb-10'>
          <div className='h-px bg-gradient-to-r from-transparent via-red-800/30 to-transparent w-full' />
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-800/40 rotate-45' />
        </div>
      </div>

      {/* Client component handles slider + shop the look with collection state */}
      <CatalogDetailWrapper collections={collectionsData} />

      {/* Catalog Level 2 Section - Only show for Level 1 catalogs */}
      {catalog.level === 1 && catalog.children.length > 0 && (
        <SubCatalogGrid subCatalogs={catalog.children} parentSlug={catalog.slug} />
      )}
    </div>
  );
}
