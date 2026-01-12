import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@repo/database';
import { ProductSlider } from './components/product-slider';
import { ProductCard } from './components/product-card';
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
    },
  });

  if (!catalog) {
    notFound();
  }

  // Flatten products from all collections
  const collections = catalog.collections.map((cc) => cc.collection);
  const allProducts = collections.flatMap((c) => c.products.map((cp) => cp.product));

  // Remove duplicates based on ID (a product might be in multiple collections)
  const uniqueProducts = Array.from(new Map(allProducts.map((p) => [p.id, p])).values());

  // Gather images for the slider (primary images from each product)
  const sliderImages = uniqueProducts
    .map((product) => {
      const primaryAsset = product.gallery.find((g) => g.isPrimary) || product.gallery[0];
      return primaryAsset?.asset?.url;
    })
    .filter((url): url is string => !!url);

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      {/* Breadcrumb & Catalog Title */}
      <div className='container mx-auto px-4 pt-8 pb-4'>
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

      {/* Hero Slider */}
      <div className='container mx-auto px-4 mb-16'>
        <ProductSlider images={sliderImages.slice(0, 5)} />
      </div>

      {/* Shop the look Section */}
      <div className='container mx-auto px-4 pb-20'>
        {/* Section Header with decorative elements */}
        <div className='relative mb-12'>
          <div className='flex items-center justify-center gap-6 mb-3'>
            <div className='h-px w-16 bg-gradient-to-r from-transparent to-black/20' />
            <h2 className='text-5xl md:text-6xl font-serif italic text-center text-black/85 tracking-wide'>
              Shop the look
            </h2>
            <div className='h-px w-16 bg-gradient-to-l from-transparent to-black/20' />
          </div>
          <p className='text-center text-sm font-serif italic text-gray-400 tracking-widest uppercase'>
            Curated Collection
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16'>
          {uniqueProducts.map((product) => {
            const primaryAsset = product.gallery.find((g) => g.isPrimary) || product.gallery[0];
            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                imageUrl={
                  primaryAsset?.asset?.url ||
                  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'
                }
              />
            );
          })}
        </div>
      </div>

      {/* Catalog Level 2 Section */}
      <SubCatalogGrid subCatalogs={catalog.children} />
    </div>
  );
}
