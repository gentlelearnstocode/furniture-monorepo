import { getSaleProducts } from '@/lib/queries';
import { ProductCard } from '@/app/components/product-card';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';

export const revalidate = 3600;

export default async function SalePage() {
  const saleProducts = await getSaleProducts();

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      <AppBreadcrumb items={[{ label: 'Home Page', href: '/' }, { label: 'Sale' }]} />

      <div className='container mx-auto px-4 pt-12 pb-6'>
        {/* Title & Description */}
        <div className='mb-8'>
          <h1 className='text-5xl md:text-6xl font-serif italic text-black/90 tracking-wide mb-4'>
            Sale Off
          </h1>
          <p className='text-[15px] leading-relaxed text-gray-600 max-w-4xl font-serif'>
            Explore our exclusive discounts on premium furniture. Limited time offers on selected
            items.
          </p>
        </div>

        {/* Filter Bar Stub (matching layout of catalog page) */}
        <div className='flex items-center justify-between mb-8 pb-4 border-b border-black/5'>
          <div className='text-[13px] font-serif italic text-black/50 uppercase tracking-[0.1em]'>
            Showing {saleProducts.length} results
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className='container mx-auto px-4 pb-20'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12'>
          {saleProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {saleProducts.length === 0 && (
          <div className='text-center py-20'>
            <p className='text-xl font-serif italic text-gray-400'>
              No products are currently on sale. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
