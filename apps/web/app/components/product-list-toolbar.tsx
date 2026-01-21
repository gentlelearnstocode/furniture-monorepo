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
    <div className='flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8 pb-3 sm:pb-4 border-b border-black/5'>
      {/* Left: Category + Sale Toggle */}
      <div className='flex items-center gap-1.5 sm:gap-3 md:gap-6 min-w-0'>
        {/* Sale Toggle */}
        {showSaleToggle && (
          <button
            onClick={onSaleToggle}
            className={cn(
              'flex items-center justify-center text-[10px] sm:text-[12px] font-serif uppercase tracking-[0.05em] sm:tracking-[0.1em] transition-all duration-200 rounded-[2px] flex-shrink-0',
              'w-[38px] sm:w-[50px] h-[22px] sm:h-[28px]',
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
            <DropdownMenuTrigger className='flex items-center gap-0.5 sm:gap-1 outline-none group min-w-0'>
              <span className='text-[12px] sm:text-[16px] md:text-[20px] font-serif font-bold text-[#222] capitalize leading-normal transition-colors group-hover:text-[#49000D] truncate'>
                {currentCatalogLabel}
              </span>
              <ChevronDown
                size={10}
                className='sm:w-3 sm:h-3 md:w-4 md:h-4 text-[#222] transition-transform group-data-[state=open]:rotate-180 flex-shrink-0'
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='min-w-[160px] sm:min-w-[200px]'>
              {catalogOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onCatalogChange?.(option.value)}
                  className={cn(
                    'text-[13px] sm:text-[15px] font-serif',
                    currentCatalog === option.value && 'bg-accent font-bold',
                  )}
                >
                  {tl(option, 'label')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className='hidden md:block text-[11px] md:text-[13px] font-serif italic text-black/50 uppercase tracking-[0.08em]'>
          {t('showingResults', { count: totalResults })}
        </div>
      </div>

      {/* Right: Sort + Layout Toggle */}
      <div className='flex items-center gap-1.5 sm:gap-3 md:gap-6 flex-shrink-0'>
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[12px] font-serif italic uppercase tracking-[0.05em] sm:tracking-[0.1em] text-black/70 hover:text-black transition-colors border border-black/10 hover:border-black/30 rounded-sm bg-white outline-none ring-0 focus:ring-0'>
            <span className='hidden sm:inline'>
              {currentSort ? getSortLabel(currentSort) : t('sortPlaceholder')}
            </span>
            <span className='sm:hidden'>{t('sort')}</span>
            <ChevronDown size={10} className='opacity-50 flex-shrink-0 sm:w-3 sm:h-3' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40 sm:w-48'>
            <DropdownMenuItem
              onClick={() => onSortChange('name_asc')}
              className='text-[12px] sm:text-[14px]'
            >
              {t('sortAz')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange('name_desc')}
              className='text-[12px] sm:text-[14px]'
            >
              {t('sortZa')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange('price_asc')}
              className='text-[12px] sm:text-[14px]'
            >
              {t('priceLowHigh')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange('price_desc')}
              className='text-[12px] sm:text-[14px]'
            >
              {t('priceHighLow')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Layout Toggle */}
        <div className='flex items-center gap-0 border border-black/10 rounded-sm overflow-hidden bg-white'>
          <button
            onClick={() => onLayoutChange('2-col')}
            className={cn(
              'p-1 sm:p-1.5 transition-colors',
              layout === '2-col'
                ? 'bg-black text-white'
                : 'hover:bg-gray-100 text-black/40 hover:text-black',
            )}
            title='2 products per row'
          >
            <Grid2x2 size={12} className='sm:w-4 sm:h-4' strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onLayoutChange('3-col')}
            className={cn(
              'p-1 sm:p-1.5 transition-colors',
              layout === '3-col'
                ? 'bg-black text-white'
                : 'hover:bg-gray-100 text-black/40 hover:text-black',
            )}
            title='3 products per row'
          >
            <Grid3x3 size={12} className='sm:w-4 sm:h-4' strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
