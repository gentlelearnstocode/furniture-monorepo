import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@repo/database';
import { ChevronRight } from 'lucide-react';
import { ProductGallery } from './components/product-gallery';
import { ProductInfo } from './components/product-info';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.slug, slug),
    with: {
      catalog: {
        with: {
          parent: true,
        },
      },
      gallery: {
        with: {
          asset: true,
        },
        orderBy: (gallery, { asc }) => [asc(gallery.position)],
      },
    },
  });

  if (!product) {
    notFound();
  }

  const parentCatalog = product.catalog?.parent;
  const currentCatalog = product.catalog;

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      {/* Breadcrumb & Title Section */}
      <div className='container mx-auto px-4 pt-4 pb-6'>
        {/* Breadcrumb */}
        <div className='flex items-center gap-2.5 text-[13px] font-serif italic text-gray-400 mb-8'>
          <Link href='/' className='hover:text-black transition-colors duration-300'>
            Home Page
          </Link>
          <ChevronRight size={14} className='text-gray-300' />
          {currentCatalog?.level === 2 && parentCatalog && (
            <>
              <Link
                href={`/catalog/${parentCatalog.slug}`}
                className='hover:text-black transition-colors duration-300'
              >
                {parentCatalog.name}
              </Link>
              <ChevronRight size={14} className='text-gray-300' />
              <Link
                href={`/catalog/${parentCatalog.slug}/${currentCatalog.slug}`}
                className='hover:text-black transition-colors duration-300'
              >
                {currentCatalog.name}
              </Link>
              <ChevronRight size={14} className='text-gray-300' />
            </>
          )}
          {currentCatalog?.level === 1 && (
            <>
              <Link
                href={`/catalog/${currentCatalog.slug}`}
                className='hover:text-black transition-colors duration-300'
              >
                {currentCatalog.name}
              </Link>
              <ChevronRight size={14} className='text-gray-300' />
            </>
          )}
          <span className='text-black font-medium'>{product.name}</span>
        </div>

        {/* Decorative divider */}
        <div className='relative mb-8'>
          <div className='h-px bg-gradient-to-r from-transparent via-red-800/30 to-transparent w-full' />
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-800/40 rotate-45' />
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20'>
          {/* Left: Gallery */}
          <ProductGallery
            images={product.gallery.map((g) => g.asset?.url).filter((url): url is string => !!url)}
            name={product.name}
          />

          {/* Right: Info */}
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}
