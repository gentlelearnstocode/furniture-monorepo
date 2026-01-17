'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Grid3x3, Grid2x2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StyledImage } from '@/app/components/styled-image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';

// Define the product type based on the schema and query
type Product = {
  id: string;
  name: string;
  slug: string;
  basePrice: string; // Decimal is string in JS usually
  discountPrice: string | null;
  showPrice: boolean;
  gallery: {
    isPrimary: boolean;
    asset: { url: string } | null;
    focusPoint?: { x: number; y: number } | null;
    aspectRatio?: 'original' | '1:1' | '3:4' | '4:3' | '16:9' | string | null;
    objectFit?: 'cover' | 'contain' | string | null;
    position: number;
  }[];
};

interface ProductListingProps {
  products: Product[];
}

export function ProductListing({ products }: ProductListingProps) {
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

  const getSortLabel = (value: string) => {
    switch (value) {
      case 'name_asc':
        return 'Name A-Z';
      case 'name_desc':
        return 'Name Z-A';
      case 'price_asc':
        return 'Price Low to High';
      case 'price_desc':
        return 'Price High to Low';
      default:
        return 'Sort';
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className='flex items-center justify-between mb-8'>
        {/* Left: Sale Filter */}
        <div className='flex items-center gap-4'>
          <button
            onClick={toggleSale}
            className={cn(
              'flex items-center justify-center text-[13px] font-serif italic uppercase tracking-[0.1em] transition-all duration-200 rounded-[2px]',
              'w-[54px] h-[29px]', // Fixed dimensions
              isSaleActive
                ? 'bg-[#D32F2F] text-white border border-[#D32F2F]'
                : 'text-[#D32F2F] hover:bg-red-50 border border-transparent hover:border-red-100'
            )}
          >
            SALE
          </button>
        </div>

        {/* Right: Sort & Layout */}
        <div className='flex items-center gap-4'>
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-2 px-4 py-2 text-[13px] font-serif italic uppercase tracking-[0.1em] text-black/70 hover:text-black transition-colors border border-black/10 hover:border-black/30 rounded-sm bg-white outline-none ring-0 focus:ring-0'>
              <span>{currentSort ? getSortLabel(currentSort) : '~ Sort'}</span>
              <ChevronDown size={14} className='opacity-50' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem onClick={() => handleSort('name_asc')}>Name A-Z</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('name_desc')}>Name Z-A</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('price_asc')}>
                Price Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('price_desc')}>
                Price High to Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Layout Toggle */}
          <div className='flex items-center gap-1 border border-black/10 rounded-sm overflow-hidden bg-white'>
            <button
              onClick={() => setLayout('2-col')}
              className={cn(
                'p-2 transition-colors',
                layout === '2-col'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 text-black/40 hover:text-black'
              )}
              title='2 products per row'
            >
              <Grid2x2 size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setLayout('3-col')}
              className={cn(
                'p-2 transition-colors',
                layout === '3-col'
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 text-black/40 hover:text-black'
              )}
              title='3 products per row'
            >
              <Grid3x3 size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div
        className={cn(
          'grid gap-x-6 gap-y-12 transition-all duration-300',
          layout === '2-col' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'
        )}
      >
        {products.map((product) => {
          const primaryAsset = product.gallery.find((g) => g.isPrimary) || product.gallery[0];
          const imageUrl =
            primaryAsset?.asset?.url ||
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800';
          // Extract display settings from the primary asset
          const displaySettings = primaryAsset
            ? {
                focusPoint: primaryAsset.focusPoint || undefined,
                aspectRatio:
                  (primaryAsset.aspectRatio as 'original' | '1:1' | '3:4' | '4:3' | '16:9') ||
                  undefined,
                objectFit: (primaryAsset.objectFit as 'cover' | 'contain') || undefined,
              }
            : undefined;

          // Calculate aspect ratio for the container
          const ratioMap: Record<string, string> = {
            '1:1': '1 / 1',
            '3:4': '3 / 4',
            '4:3': '4 / 3',
            '16:9': '16 / 9',
          };
          const ratio =
            displaySettings?.aspectRatio && displaySettings.aspectRatio !== 'original'
              ? (ratioMap[displaySettings.aspectRatio] ?? '3 / 4')
              : '3 / 4';

          // Override aspectRatio for StyledImage to prevent double wrapping
          const imageDisplaySettings = displaySettings
            ? { ...displaySettings, aspectRatio: 'original' as const }
            : undefined;

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className='group flex flex-col gap-4'
            >
              <div
                className='relative overflow-hidden bg-gray-100 shadow-md shadow-black/5 group-hover:shadow-xl group-hover:shadow-black/10 transition-all duration-500'
                style={{ aspectRatio: ratio }}
              >
                {product.discountPrice && (
                  <div className='absolute top-3 left-3 z-10 bg-[#D32F2F] text-white text-[10px] w-auto px-2 py-1 font-serif uppercase tracking-[0.15em]'>
                    Sale
                  </div>
                )}
                <StyledImage
                  src={imageUrl}
                  alt={product.name}
                  displaySettings={imageDisplaySettings}
                  className='transition-all duration-700 group-hover:scale-105'
                  sizes={layout === '2-col' ? '50vw' : '(max-width: 768px) 50vw, 33vw'}
                />

                {/* Subtle overlay on hover */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </div>

              {/* Product Info */}
              <div className='flex flex-col gap-1.5'>
                <h3 className='text-[15px] md:text-[17px] font-serif uppercase tracking-[0.05em] text-black/90 group-hover:text-black transition-colors text-center'>
                  {product.name}
                </h3>
                <div className='flex flex-col items-center gap-1'>
                  <p className='text-[11px] md:text-[12px] font-serif italic text-gray-400 tracking-[0.1em] uppercase text-center'>
                    Available in multiple fabric
                  </p>

                  {!product.showPrice ? (
                    <span className='text-[13px] font-serif tracking-wider text-black/70 mt-1 cursor-pointer hover:underline'>
                      Contact for price
                    </span>
                  ) : product.discountPrice ? (
                    <div className='flex items-center gap-3 mt-1'>
                      <span className='text-[13px] font-serif tracking-wider text-gray-400 line-through'>
                        ${product.basePrice}
                      </span>
                      <span className='text-[13px] font-serif tracking-wider text-[#D32F2F]'>
                        ${product.discountPrice}
                      </span>
                    </div>
                  ) : (
                    <span className='text-[13px] font-serif tracking-wider text-black/70 mt-1'>
                      ${product.basePrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
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
