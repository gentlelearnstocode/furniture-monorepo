'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

import { ProductCard } from '@/app/components/product-card';
import { ProductListToolbar } from '@/app/components/product-list-toolbar';

// Define the product type based on the schema and query
export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  basePrice: string; // Decimal is string in JS usually
  discountPrice: string | null;
  showPrice: boolean;
  gallery: {
    isPrimary: boolean;
    asset: { url: string };
    focusPoint?: { x: number; y: number } | null;
    aspectRatio?: 'original' | '1:1' | '3:4' | '4:3' | '16:9' | string | null;
    objectFit?: 'cover' | 'contain' | string | null;
    position: number;
  }[];
};

interface ProductListingProps {
  products: Product[];
  catalogOptions?: { label: string; value: string }[];
  currentCatalog?: string;
  showSaleToggle?: boolean;
  showCatalog?: boolean;
  imageRatio?: string | null;
}

export function ProductListing({
  products,
  catalogOptions,
  currentCatalog,
  showSaleToggle = true,
  showCatalog = false,
  imageRatio,
}: ProductListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for layout (local preference)
  const [layout, setLayout] = useState<'2-col' | '3-col'>('3-col');

  // URL params
  const currentSort = searchParams.get('sort') || '';
  const isSaleActive = searchParams.get('sale') === 'true';

  // Handlers
  const handleSort = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) {
      params.set('sort', sortValue);
    } else {
      params.delete('sort');
    }
    router.push(`?${params.toString()}`);
  };

  const toggleSale = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isSaleActive) {
      params.delete('sale');
    } else {
      params.set('sale', 'true');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <ProductListToolbar
        totalResults={products.length}
        layout={layout}
        onLayoutChange={setLayout}
        showSaleToggle={showSaleToggle}
        isSaleActive={isSaleActive}
        onSaleToggle={toggleSale}
        showCatalog={showCatalog || !!catalogOptions?.length}
        catalogOptions={catalogOptions}
        currentCatalog={currentCatalog}
        onCatalogChange={(value) => {
          // Navigate to the selected subcatalog
          router.push(value);
        }}
        currentSort={currentSort}
        onSortChange={handleSort}
      />

      {/* Product Grid */}
      <div
        className={cn(
          'grid gap-x-6 gap-y-12 transition-all duration-300',
          layout === '2-col' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3',
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product as Product} imageRatio={imageRatio} />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className='text-center py-20'>
          <p className='text-xl font-serif italic text-gray-400'>No products match your filter.</p>
        </div>
      )}
    </div>
  );
}
