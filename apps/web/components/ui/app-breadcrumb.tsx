import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function AppBreadcrumb({ items, className }: AppBreadcrumbProps) {
  return (
    <div className={cn('bg-transparent w-full', className)}>
      <div className='container mx-auto py-2 sm:py-3'>
        <nav aria-label='Breadcrumb' className='flex items-center flex-wrap gap-1 sm:gap-2'>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <div key={index} className='flex items-center gap-1 sm:gap-2'>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className='capitalize font-playfair text-[12px] sm:text-[14px] md:text-[16px] text-[#222222]/80 hover:text-[#222222] transition-colors whitespace-nowrap'
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'capitalize font-playfair text-[12px] sm:text-[14px] md:text-[16px] whitespace-nowrap',
                      isLast ? 'text-[#222222] font-semibold' : 'text-[#222222]/80',
                    )}
                  >
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRight size={16} className='sm:w-5 sm:h-5 text-[#222222]/40 shrink-0' />
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
