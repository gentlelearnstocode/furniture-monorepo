import { getSaleSettings, getSaleSectionProducts, getEligibleProducts } from '@/lib/actions/sale';
import { SaleManagement } from './components/sale-management';
import { PageHeader } from '@/components/layout/page-header';
import { type Product } from '@repo/shared';

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
      gallery: p.product.gallery.map((g) => ({
        isPrimary: g.isPrimary,
        asset: {
          url: g.asset.url,
        },
      })),
    } as Product,
  }));

  // Transform eligibleProducts
  const transformedEligible = eligibleProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    basePrice: p.basePrice,
    discountPrice: p.discountPrice,
    gallery:
      p.gallery
        ?.filter((g) => g.isPrimary)
        .map((g) => ({
          isPrimary: g.isPrimary,
          asset: {
            url: g.asset.url,
          },
        })) || [],
  } as Product));

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Homepage', href: '/homepage' },
          { label: 'Sale Section' },
        ]}
        title='Homepage Sale Section'
        description='Manage the special sales section on your home page. Highlight your best deals here.'
      />

      <SaleManagement
        initialSettings={{ title: settings.title, isActive: settings.isActive }}
        initialSaleProducts={transformedSaleProducts}
        eligibleProducts={transformedEligible}
      />
    </div>
  );
}
