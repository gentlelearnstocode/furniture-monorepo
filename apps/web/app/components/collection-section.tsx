import React from 'react';
import Image from 'next/image';

interface CollectionSectionProps {
  name: string;
  imageUrl: string;
  isFirst?: boolean;
  layout?: 'full' | 'half' | 'third';
}

export const CollectionSection = ({
  name,
  imageUrl,
  isFirst,
  layout = 'full',
}: CollectionSectionProps) => {
  const isSmall = layout === 'half' || layout === 'third';

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden group cursor-pointer transition-all duration-500',
        layout === 'full' && 'h-[75vh] md:h-[85vh]',
        layout === 'half' && 'h-[50vh] md:h-[60vh]',
        layout === 'third' && 'h-[40vh] md:h-[50vh]'
      )}
    >
      {/* Background Image with Hover Zoom */}
      <div className='absolute inset-0 z-0 transition-transform duration-1000 ease-out group-hover:scale-110'>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className='object-cover'
          priority={isFirst}
          sizes={layout === 'full' ? '100vw' : layout === 'half' ? '50vw' : '33vw'}
        />
        {/* Dark Overlay - 30% default, 50% on hover */}
        <div className='absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500 z-10' />
      </div>

      {/* Centered Content - Visible on Hover */}
      <div className='absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-4 text-center'>
        <h3
          className={cn(
            'text-white font-serif uppercase tracking-widest mb-4 drop-shadow-xl',
            isSmall ? 'text-3xl md:text-5xl' : 'text-5xl md:text-7xl'
          )}
        >
          {name}
        </h3>
        <div className='flex flex-col items-center gap-2'>
          <span className='text-white text-sm md:text-base font-medium tracking-[0.2em] uppercase border-b border-white pb-1'>
            SEE ALL
          </span>
        </div>
      </div>
    </section>
  );
};

import { cn } from '@repo/ui/lib/utils';
