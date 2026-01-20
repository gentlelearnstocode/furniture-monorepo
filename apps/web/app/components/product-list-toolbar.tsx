'use client';

import { ChevronDown, Grid3x3, Grid2x2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { useLanguage, useLocalizedText } from '@/providers/language-provider';

interface CatalogOption {
  label: string;
  labelVi?: string | null;
  value: string;
}

interface ProductListToolbarProps {
  totalResults: number;
  layout: '2-col' | '3-col';
  onLayoutChange: (layout: '2-col' | '3-col') => void;
  showSaleToggle?: boolean;
  isSaleActive?: boolean;
  onSaleToggle?: () => void;
  showCatalog?: boolean;
  catalogOptions?: CatalogOption[];
  currentCatalog?: string;
  onCatalogChange?: (value: string) => void;
  currentSort: string;
  onSortChange: (value: string) => void;
}

export function ProductListToolbar({
  totalResults,
  layout,
  onLayoutChange,
  showSaleToggle = false,
  isSaleActive = false,
  onSaleToggle,
  showCatalog = false,
  catalogOptions = [],
  currentCatalog,
  onCatalogChange,
  currentSort,
  onSortChange,
}: ProductListToolbarProps) {
  const { locale } = useLanguage();
  const t = useLocalizedText();

  const getSortLabel = (value: string) => {
    switch (value) {
      case 'name_asc':
        return locale === 'vi' ? 'Tên A-Z' : 'Name A-Z';
      case 'name_desc':
        return locale === 'vi' ? 'Tên Z-A' : 'Name Z-A';
      case 'price_asc':
        return locale === 'vi' ? 'Giá thấp đến cao' : 'Price Low to High';
      case 'price_desc':
        return locale === 'vi' ? 'Giá cao đến thấp' : 'Price High to Low';
      default:
        return locale === 'vi' ? 'Sắp xếp' : 'Sort';
    }
  };

  const activeCatalog = catalogOptions.find((opt) => opt.value === currentCatalog);
  const currentCatalogLabel = activeCatalog
    ? t(activeCatalog, 'label')
    : locale === 'vi'
      ? 'Danh mục'
      : 'Category';

  return (
    <div className='flex items-center justify-between mb-8 pb-4 border-b border-black/5'>
      {/* Left: Filters & Results Count */}
      <div className='flex items-center gap-6'>
        {/* Sale Toggle */}
        {showSaleToggle && (
          <button
            onClick={onSaleToggle}
            className={cn(
              'flex items-center justify-center text-[13px] font-serif uppercase tracking-[0.1em] transition-all duration-200 rounded-[2px]',
              'w-[54px] h-[29px]',
              isSaleActive
                ? 'bg-[#D32F2F] text-white border border-[#D32F2F]'
                : 'text-[#D32F2F] hover:bg-red-50 border border-transparent hover:border-red-100',
            )}
          >
            SALE
          </button>
        )}

        {/* Category Filter */}
        {showCatalog && catalogOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-[6px] outline-none group'>
              <span className='text-[24px] font-serif font-bold text-[#222] capitalize leading-normal transition-colors group-hover:text-[#49000D]'>
                {currentCatalogLabel}
              </span>
              <ChevronDown
                size={16}
                className='text-[#222] transition-transform group-data-[state=open]:rotate-180'
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='min-w-[200px]'>
              {catalogOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onCatalogChange?.(option.value)}
                  className={cn(
                    'text-[16px] font-serif',
                    currentCatalog === option.value && 'bg-accent font-bold',
                  )}
                >
                  {t(option, 'label')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className='text-[13px] font-serif italic text-black/50 uppercase tracking-[0.1em]'>
          {locale === 'vi' ? `Hiển thị ${totalResults} kết quả` : `Showing ${totalResults} results`}
        </div>
      </div>

      {/* Right: Controls */}
      <div className='flex items-center gap-6'>
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-2 px-4 py-2 text-[13px] font-serif italic uppercase tracking-[0.1em] text-black/70 hover:text-black transition-colors border border-black/10 hover:border-black/30 rounded-sm bg-white outline-none ring-0 focus:ring-0'>
            <span>
              {currentSort ? getSortLabel(currentSort) : locale === 'vi' ? '~ Sắp xếp' : '~ Sort'}
            </span>
            <ChevronDown size={14} className='opacity-50' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuItem onClick={() => onSortChange('name_asc')}>
              {locale === 'vi' ? 'Tên A-Z' : 'Name A-Z'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('name_desc')}>
              {locale === 'vi' ? 'Tên Z-A' : 'Name Z-A'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('price_asc')}>
              {locale === 'vi' ? 'Giá thấp đến cao' : 'Price Low to High'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('price_desc')}>
              {locale === 'vi' ? 'Giá cao đến thấp' : 'Price High to Low'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Layout Toggle */}
        <div className='flex items-center gap-1 border border-black/10 rounded-sm overflow-hidden bg-white'>
          <button
            onClick={() => onLayoutChange('2-col')}
            className={cn(
              'p-2 transition-colors',
              layout === '2-col'
                ? 'bg-black text-white'
                : 'hover:bg-gray-100 text-black/40 hover:text-black',
            )}
            title='2 products per row'
          >
            <Grid2x2 size={16} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onLayoutChange('3-col')}
            className={cn(
              'p-2 transition-colors',
              layout === '3-col'
                ? 'bg-black text-white'
                : 'hover:bg-gray-100 text-black/40 hover:text-black',
            )}
            title='3 products per row'
          >
            <Grid3x3 size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
