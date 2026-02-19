import React from 'react';
import Image from 'next/image';
import { cn } from '@repo/ui/lib/utils';

interface BrandDividerProps {
  className?: string;
  variant?: 'default' | 'light';
  stretch?: boolean;
}

export const BrandDivider = ({
  className,
  variant = 'default',
  stretch = false,
}: BrandDividerProps) => {
  const isLight = variant === 'light';

  return (
    <div
      className={cn(
        'flex items-center gap-3 mt-4 mx-auto',
        stretch ? 'w-full' : 'w-fit',
        className,
      )}
    >
      <div
        className={cn(
          'bg-brand-primary-600',
          stretch ? 'flex-1' : isLight ? 'w-12' : 'w-16',
          isLight ? 'h-[1px] opacity-30' : 'h-[2px] opacity-100',
        )}
      />
      <Image
        src='/symbol.svg'
        alt='decorative symbol'
        width={isLight ? 20 : 24}
        height={isLight ? 20 : 24}
        className={cn('transition-opacity', isLight ? 'opacity-60' : 'opacity-80')}
      />
      <div
        className={cn(
          'bg-brand-primary-600',
          stretch ? 'flex-1' : isLight ? 'w-12' : 'w-16',
          isLight ? 'h-[1px] opacity-30' : 'h-[2px] opacity-100',
        )}
      />
    </div>
  );
};
