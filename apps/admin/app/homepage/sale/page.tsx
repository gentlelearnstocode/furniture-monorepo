import { getSaleSettings, getSaleSectionProducts, getEligibleProducts } from '@/lib/actions/sale';
import { SaleManagement } from './components/sale-management';

export const dynamic = 'force-dynamic';

export default async function SaleSectionPage() {
  const [settings, saleProducts, eligibleProducts] = await Promise.all([
    getSaleSettings(),
    getSaleSectionProducts(),
    getEligibleProducts(),
  ]);

  if (!settings) return null;

  // Transform saleProducts for the management component
  const transformedSaleProducts = saleProducts.map((p) => ({
    id: p.id,
    productId: p.productId,
    position: p.position,
    product: {
      id: p.product.id,
      name: p.product.name,
      shortDescription: p.product.shortDescription,
      basePrice: p.product.basePrice,
      discountPrice: p.product.discountPrice,
      gallery: p.product.gallery.map((g: any) => ({
        asset: {
          url: g.asset.url,
        },
      })),
    },
  }));

  // Transform eligibleProducts
  const transformedEligible = eligibleProducts.map((p: any) => ({
    id: p.id,
    name: p.name,
    basePrice: p.basePrice,
    discountPrice: p.discountPrice,
    gallery:
      p.gallery
        ?.filter((g: any) => g.isPrimary)
        .map((g: any) => ({
          asset: {
            url: g.asset.url,
          },
        })) || [],
  }));

  return (
    <div className='container max-w-5xl py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Homepage Sale Section</h1>
        <p className='mt-2 text-gray-600'>
          Manage the special sales section on your home page. Highlight your best deals here.
        </p>
      </div>

      <SaleManagement
        initialSettings={{ title: settings.title, isActive: settings.isActive }}
        initialSaleProducts={transformedSaleProducts as any}
        eligibleProducts={transformedEligible}
      />
    </div>
  );
}
