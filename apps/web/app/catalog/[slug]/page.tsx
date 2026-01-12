import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@repo/database';
import { ProductSlider } from './components/product-slider';
import { ProductCard } from './components/product-card';
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
    <div className='min-h-screen bg-[#FDFCFB]'>
      {/* Breadcrumb & Catalog Title */}
      <div className='container mx-auto px-4 pt-44 pb-4'>
        <div className='flex items-center gap-2 text-[14px] font-serif italic text-gray-500 mb-8'>
          <Link href='/' className='hover:text-black transition-colors'>
            Home Page
          </Link>
          <ChevronRight size={12} className='text-gray-300' />
          <span className='text-black'>{catalog.name}</span>
        </div>
        <div className='h-px bg-red-800/20 w-full mb-12' />
      </div>

      {/* Hero Slider */}
      <div className='container mx-auto px-4 mb-24'>
        <ProductSlider images={sliderImages.slice(0, 5)} />
      </div>

      {/* Shop the look Section */}
      <div className='container mx-auto px-4 pb-32'>
        <h2 className='text-4xl md:text-5xl font-serif italic text-center mb-16 text-black/80'>
          Shop the look
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
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
    </div>
  );
}
