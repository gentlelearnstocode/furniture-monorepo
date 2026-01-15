import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@repo/database';
import { ChevronRight, Grid3x3, List } from 'lucide-react';
import Image from 'next/image';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    slug: string;
    childSlug: string;
  }>;
}

export default async function CatalogLevel2Page({ params }: Props) {
  const { slug, childSlug } = await params;

  // Fetch the parent catalog (level 1) and child catalog (level 2) with products
  const parentCatalog = await db.query.catalogs.findFirst({
    where: (catalogs, { eq }) => eq(catalogs.slug, slug),
  });

  if (!parentCatalog) {
    notFound();
  }

  // Fetch the child catalog (level 2) with its products
  const catalog = await db.query.catalogs.findFirst({
    where: (catalogs, { eq, and }) =>
      and(eq(catalogs.slug, childSlug), eq(catalogs.parentId, parentCatalog.id)),
    with: {
      image: true,
      products: {
        with: {
          gallery: {
            with: {
              asset: true,
            },
            orderBy: (gallery, { asc }) => [asc(gallery.position)],
          },
        },
        where: (products, { eq }) => eq(products.isActive, true),
      },
    },
  });

  if (!catalog) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      <AppBreadcrumb
        items={[
          { label: 'Home Page', href: '/' },
          { label: parentCatalog.name, href: `/catalog/${slug}` },
          { label: catalog.name },
        ]}
      />

      <div className='container mx-auto px-4 pt-4 pb-6'>
        {/* Title & Description */}
        <div className='mb-8'>
          <h1 className='text-5xl md:text-6xl font-serif italic text-black/90 tracking-wide mb-4'>
            {catalog.name}
          </h1>
          {catalog.description && (
            <p className='text-[15px] leading-relaxed text-gray-600 max-w-4xl font-serif'>
              {catalog.description}
            </p>
          )}
        </div>

        {/* Filter Bar */}
        <div className='flex items-center justify-between mb-8'>
          {/* Left: Category Filter & Sort */}
          <div className='flex items-center gap-4'>
            <button className='px-4 py-2 text-[13px] font-serif italic uppercase tracking-[0.1em] text-black/70 hover:text-black transition-colors border border-black/10 hover:border-black/30 rounded-sm'>
              SALE
            </button>
            <div className='relative'>
              <select className='appearance-none px-4 py-2 pr-8 text-[13px] font-serif italic uppercase tracking-[0.1em] text-black/70 hover:text-black transition-colors border border-black/10 hover:border-black/30 rounded-sm bg-white cursor-pointer'>
                <option>Category ~</option>
                <option>All Products</option>
                <option>Featured</option>
                <option>New Arrivals</option>
              </select>
              <ChevronRight
                size={14}
                className='absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-black/40 pointer-events-none'
              />
            </div>
          </div>

          {/* Right: Sort & View Toggle */}
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <select className='appearance-none px-4 py-2 pr-8 text-[13px] font-serif italic uppercase tracking-[0.1em] text-black/70 hover:text-black transition-colors border border-black/10 hover:border-black/30 rounded-sm bg-white cursor-pointer'>
                <option>~ Sort</option>
                <option>Name A-Z</option>
                <option>Name Z-A</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
              </select>
              <ChevronRight
                size={14}
                className='absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-black/40 pointer-events-none'
              />
            </div>

            {/* View Toggle */}
            <div className='flex items-center gap-1 border border-black/10 rounded-sm overflow-hidden'>
              <button className='p-2 bg-black text-white transition-colors'>
                <Grid3x3 size={16} strokeWidth={1.5} />
              </button>
              <button className='p-2 hover:bg-gray-100 text-black/40 hover:text-black transition-colors'>
                <List size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className='container mx-auto px-4 pb-20'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12'>
          {catalog.products.map((product) => {
            const primaryAsset = product.gallery.find((g) => g.isPrimary) || product.gallery[0];
            const imageUrl =
              primaryAsset?.asset?.url ||
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800';

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className='group flex flex-col gap-4'
              >
                {/* Product Image */}
                <div className='relative aspect-[3/4] overflow-hidden bg-gray-100 shadow-md shadow-black/5 group-hover:shadow-xl group-hover:shadow-black/10 transition-all duration-500'>
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className='object-cover transition-all duration-700 group-hover:scale-105'
                    sizes='(max-width: 768px) 50vw, 25vw'
                  />

                  {/* Subtle overlay on hover */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                </div>

                {/* Product Info */}
                <div className='flex flex-col gap-1.5'>
                  <h3 className='text-[15px] md:text-[17px] font-serif uppercase tracking-[0.05em] text-black/90 group-hover:text-black transition-colors text-center'>
                    {product.name}
                  </h3>
                  <p className='text-[11px] md:text-[12px] font-serif italic text-gray-400 tracking-[0.1em] uppercase text-center'>
                    Available in multiple fabric
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {catalog.products.length === 0 && (
          <div className='text-center py-20'>
            <p className='text-xl font-serif italic text-gray-400'>
              No products available in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
