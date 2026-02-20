'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { type Product } from '@repo/shared';

import { ProductCard } from '@/app/[locale]/components/product-card';
import { ProductListToolbar } from '@/app/[locale]/components/product-list-toolbar';

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
  const t = useTranslations('Common');
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for layout (local preference)
  const [layout, setLayout] = useState<'2-col' | '3-col'>('3-col');

  // Default to 2 columns on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setLayout('2-col');
    }
  }, []);

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
          'grid gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 md:gap-x-6 md:gap-y-12 transition-all duration-300',
          layout === '2-col' ? 'grid-cols-2' : 'grid-cols-3',
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product as Product} imageRatio={imageRatio} />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className='text-center py-20'>
          <p className='text-xl font-serif italic text-gray-400'>{t('noResults')}</p>
        </div>
      )}
    </div>
  );
}
