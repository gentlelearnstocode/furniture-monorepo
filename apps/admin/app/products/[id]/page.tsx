import { ProductForm } from '@/app/products/components/create-product-form';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { db } from '@repo/database';
import { Button } from '@repo/ui/ui/button';
import { notFound } from 'next/navigation';

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

  // Transform DB product to Form Input type
  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || undefined,
    shortDescription: product.shortDescription || undefined,
    basePrice: parseFloat(product.basePrice as any),
    discountPrice: product.discountPrice ? parseFloat(product.discountPrice as any) : undefined,
    showPrice: product.showPrice,
    catalogId: product.catalogId || undefined,
    isActive: product.isActive,
    dimensions: product.dimensions as any,
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
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/products'>
          <Button variant='outline' size='icon'>
            <MoveLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Edit Product</h1>
          <p className='text-sm text-gray-500'>Update product details, dimensions, and images.</p>
        </div>
      </div>

      <ProductForm
        catalogs={catalogs.map((c) => ({
          id: c.id,
          name: c.parent ? `${c.parent.name} > ${c.name}` : c.name,
        }))}
        initialData={initialData as any}
      />
    </div>
  );
}
