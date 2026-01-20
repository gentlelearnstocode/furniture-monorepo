'use client';

import { ChevronDown, Grid3x3, Grid2x2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { useLocalizedText } from '@/providers/language-provider';
import { useTranslations } from 'next-intl';

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
  const tl = useLocalizedText();
  const t = useTranslations('Toolbar');
  const tc = useTranslations('Common');

  const getSortLabel = (value: string) => {
    switch (value) {
      case 'name_asc':
        return t('sortAz');
      case 'name_desc':
        return t('sortZa');
      case 'price_asc':
        return t('priceLowHigh');
      case 'price_desc':
        return t('priceHighLow');
      default:
        return t('sort');
    }
  };

  const activeCatalog = catalogOptions.find((opt) => opt.value === currentCatalog);
  const currentCatalogLabel = activeCatalog ? tl(activeCatalog, 'label') : tc('category');

  return (
    <div className='flex flex-wrap items-center justify-between gap-4 md:gap-0 mb-6 md:mb-8 pb-4 border-b border-black/5'>
      {/* Left: Filters & Results Count */}
      <div className='flex flex-wrap items-center gap-3 md:gap-6'>
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
              <span className='text-[18px] md:text-[24px] font-serif font-bold text-[#222] capitalize leading-normal transition-colors group-hover:text-[#49000D]'>
                {currentCatalogLabel}
              </span>
              <ChevronDown
                size={14}
                className='md:w-4 md:h-4 text-[#222] transition-transform group-data-[state=open]:rotate-180'
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
                  {tl(option, 'label')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className='hidden sm:block text-[12px] md:text-[13px] font-serif italic text-black/50 uppercase tracking-[0.1em]'>
          {t('showingResults', { count: totalResults })}
        </div>
      </div>

      {/* Right: Controls */}
      <div className='flex items-center gap-3 md:gap-6'>
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-2 px-4 py-2 text-[13px] font-serif italic uppercase tracking-[0.1em] text-black/70 hover:text-black transition-colors border border-black/10 hover:border-black/30 rounded-sm bg-white outline-none ring-0 focus:ring-0'>
            <span>{currentSort ? getSortLabel(currentSort) : t('sortPlaceholder')}</span>
            <ChevronDown size={14} className='opacity-50' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuItem onClick={() => onSortChange('name_asc')}>
              {t('sortAz')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('name_desc')}>
              {t('sortZa')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('price_asc')}>
              {t('priceLowHigh')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('price_desc')}>
              {t('priceHighLow')}
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
