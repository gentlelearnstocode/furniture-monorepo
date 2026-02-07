import { getSaleProductsByCatalog } from '@/lib/queries';
import { ProductCard } from '@/app/components/product-card';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getLocale, getLocalizedText } from '@/lib/i18n';

export const revalidate = 3600;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CatalogSalePage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations('Sale');
  const tb = await getTranslations('Breadcrumbs');
  const locale = await getLocale();

  // Fetch the catalog to check if it exists and get its name
  const catalog = await db.query.catalogs.findFirst({
    where: (catalogs, { eq }) => eq(catalogs.slug, slug),
  });

  if (!catalog) {
    notFound();
  }

  const saleProducts = await getSaleProductsByCatalog(slug);
  const catalogName = getLocalizedText(catalog, 'name', locale);

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          { label: catalogName, href: `/catalog/${slug}` },
          { label: tb('sale') },
        ]}
      />

      <div className='container pt-10 pb-2'>
        {/* Decorative section header */}
        <div className='relative mb-8'>
          <div className='flex items-center justify-center gap-6 mb-3'>
            <div className='h-px w-12 bg-gradient-to-r from-transparent to-black/20' />
            <h1 className='text-xl md:text-2xl font-serif text-center text-black/85 tracking-wide'>
              {catalogName} {t('title')}
            </h1>
            <div className='h-px w-12 bg-gradient-to-l from-transparent to-black/20' />
          </div>
          <p className='text-center text-[14px] md:text-[15px] leading-relaxed text-gray-600 max-w-2xl mx-auto font-serif'>
            {t('description')}
          </p>
        </div>

        {/* Filter Bar Stub */}
        <div className='flex items-center justify-between mb-8 pb-4 border-b border-black/5'>
          <div className='text-[13px] font-serif italic text-black/50 uppercase tracking-[0.1em]'>
            {saleProducts.length} Results
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className='container pb-20'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12'>
          {saleProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {saleProducts.length === 0 && (
          <div className='text-center py-20'>
            <p className='text-xl font-serif italic text-gray-400'>
              No products in this category are currently on sale.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
