import { getSaleProducts, getSaleProductsByCatalog } from '@/lib/queries';
import { db } from '@repo/database';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { ProductListing, type Product } from '@/app/components/product-listing';
import { getTranslations } from 'next-intl/server';

export const revalidate = 3600;

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; catalog?: string }>;
}) {
  const { sort, catalog: catalogSlug } = await searchParams;
  const t = await getTranslations('Sale');
  const tb = await getTranslations('Breadcrumbs');

  // Fetch products based on whether a catalog filter is active
  const saleProducts = catalogSlug
    ? await getSaleProductsByCatalog(catalogSlug)
    : await getSaleProducts(undefined, sort);

  // Fetch all root-level catalogs for the "Category" filter
  const catalogs = await db.query.catalogs.findMany({
    where: (catalogs, { isNull }) => isNull(catalogs.parentId),
    columns: { name: true, nameVi: true, slug: true },
  });

  const products = saleProducts.map((product) => ({
    id: product.id,
    name: product.name,
    nameVi: product.nameVi,
    slug: product.slug,
    basePrice: product.basePrice,
    discountPrice: product.discountPrice,
    showPrice: product.showPrice,
    gallery: product.gallery
      .filter((g) => g.asset !== null)
      .map((g) => ({
        isPrimary: g.isPrimary,
        asset: g.asset as { url: string },
        focusPoint: g.focusPoint as { x: number; y: number } | null,
        aspectRatio: g.aspectRatio,
        objectFit: g.objectFit,
        position: g.position,
      })),
  }));

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      <AppBreadcrumb items={[{ label: tb('home'), href: '/' }, { label: tb('sale') }]} />

      <div className='container pt-10 pb-2'>
        {/* Decorative section header */}
        <div className='relative mb-8'>
          <div className='flex items-center justify-center gap-6 mb-3'>
            <div className='h-px w-12 bg-gradient-to-r from-transparent to-black/20' />
            <h1 className='text-xl md:text-2xl font-serif text-center text-black/85 tracking-wide'>
              {t('title')}
            </h1>
            <div className='h-px w-12 bg-gradient-to-l from-transparent to-black/20' />
          </div>
          <p className='text-center text-[14px] md:text-[15px] leading-relaxed text-gray-600 max-w-2xl mx-auto font-serif'>
            {t('description')}
          </p>
        </div>
      </div>

      {/* Product Listing (Toolbar + Grid) */}
      <div className='container pb-20'>
        <ProductListing
          products={products as Product[]}
          showSaleToggle={false}
          showCatalog={true}
          catalogOptions={[
            {
              label: t('allCategories'),
              value: '/sale',
            },
            ...catalogs.map((c) => ({
              label: c.name,
              labelVi: c.nameVi,
              value: `/sale?catalog=${c.slug}`,
            })),
          ]}
          currentCatalog={catalogSlug ? `/sale?catalog=${catalogSlug}` : '/sale'}
        />
      </div>
    </div>
  );
}
