import { ProductForm } from '@/app/products/components/create-product-form';
import { RecommendedProductSelector } from '@/app/products/components/recommended-product-selector';
import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { getRecommendedProducts, getAvailableProducts } from '@/lib/actions/recommended-products';
import { PageHeader } from '@/components/layout/page-header';
import { type ProductDimensions, type CreateProductInput } from '@repo/shared';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const product = await db.query.products.findFirst({
    where: (products, { eq }) => eq(products.id, id),
    with: {
      gallery: {
        with: {
          asset: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const catalogs = await db.query.catalogs.findMany({
    where: (catalogs, { eq }) => eq(catalogs.level, 2),
    orderBy: (catalogs, { asc }) => [asc(catalogs.name)],
    with: {
      parent: true,
    },
  });

  // Fetch recommended products data
  const [recommendedProducts, availableProducts] = await Promise.all([
    getRecommendedProducts(id),
    getAvailableProducts(id),
  ]);

  // Transform DB product to Form Input type
  const initialData = {
    id: product.id,
    name: product.name,
    nameVi: product.nameVi || undefined,
    slug: product.slug,
    description: product.description || undefined,
    descriptionVi: product.descriptionVi || undefined,
    shortDescription: product.shortDescription || undefined,
    shortDescriptionVi: product.shortDescriptionVi || undefined,
    basePrice: parseFloat(String(product.basePrice)),
    discountPrice: product.discountPrice ? parseFloat(String(product.discountPrice)) : undefined,
    showPrice: product.showPrice,
    catalogId: product.catalogId || undefined,
    isActive: product.isActive,
    dimensions: product.dimensions as unknown as ProductDimensions,
    images: product.gallery.map((g) => ({
      assetId: g.assetId,
      url: g.asset.url,
      isPrimary: g.isPrimary,
      // Display settings
      focusPoint: g.focusPoint as { x: number; y: number } | undefined,
      aspectRatio: g.aspectRatio as 'original' | '1:1' | '3:4' | '4:3' | '16:9' | undefined,
      objectFit: g.objectFit as 'cover' | 'contain' | undefined,
    })),
  };

  return (
    <div className='space-y-8'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Edit' },
        ]}
        title='Edit Product'
        description='Update product details, dimensions, and images.'
      />

      <ProductForm
        catalogs={catalogs.map((c) => ({
          id: c.id,
          name: c.parent ? `${c.parent.name} > ${c.name}` : c.name,
        }))}
        initialData={initialData as CreateProductInput & { id: string }}
      />

      {/* Recommended Products Section */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-xl font-semibold tracking-tight'>Recommended Products</h2>
          <p className='text-sm text-gray-500'>
            Select products to recommend on this product&apos;s detail page.
          </p>
        </div>
        <RecommendedProductSelector
          productId={id}
          availableProducts={availableProducts}
          initialRecommended={recommendedProducts}
        />
      </div>
    </div>
  );
}
