import { getSaleProducts, getSaleProductsByCatalog } from '@/lib/queries';
import { db } from '@repo/database';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { ProductListing, type Product } from '@/app/components/product-listing';

export const revalidate = 3600;

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; catalog?: string }>;
}) {
  const { sort, catalog: catalogSlug } = await searchParams;

  // Fetch products based on whether a catalog filter is active
  const saleProducts = catalogSlug
    ? await getSaleProductsByCatalog(catalogSlug)
    : await getSaleProducts(undefined, sort);

  // Fetch all root-level catalogs for the "Category" filter
  const catalogs = await db.query.catalogs.findMany({
    where: (catalogs, { isNull }) => isNull(catalogs.parentId),
    columns: { name: true, slug: true },
  });

  const products = saleProducts.map((product) => ({
    id: product.id,
    name: product.name,
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
      <AppBreadcrumb items={[{ label: 'Home Page', href: '/' }, { label: 'Sale' }]} />

      <div className='container mx-auto px-4 pt-6 pb-2'>
        {/* Title & Description */}
        <div className='mb-8'>
          <h1 className='text-5xl md:text-6xl font-serif text-black/90 tracking-wide mb-4'>
            Sale Off
          </h1>
          <p className='text-[15px] leading-relaxed text-gray-600 max-w-4xl font-serif'>
            Explore our exclusive discounts on premium furniture. Limited time offers on selected
            items.
          </p>
        </div>
      </div>

      {/* Product Listing (Toolbar + Grid) */}
      <div className='container mx-auto px-4 pb-20'>
        <ProductListing
          products={products as Product[]}
          showSaleToggle={false}
          showCatalog={true}
          catalogOptions={[
            { label: 'All Categories', value: '/sale' },
            ...catalogs.map((c) => ({
              label: c.name,
              value: `/sale?catalog=${c.slug}`,
            })),
          ]}
          currentCatalog={catalogSlug ? `/sale?catalog=${catalogSlug}` : '/sale'}
        />
      </div>
    </div>
  );
}
