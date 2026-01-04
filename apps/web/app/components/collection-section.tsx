import React from 'react';
import Image from 'next/image';

interface CollectionSectionProps {
  name: string;
  imageUrl: string;
  isFirst?: boolean;
}

export const CollectionSection = ({ name, imageUrl, isFirst }: CollectionSectionProps) => {
  return (
    <section className='relative w-full h-[75vh] md:h-[85vh] overflow-hidden group cursor-pointer'>
      {/* Background Image with Hover Zoom */}
      <div className='absolute inset-0 z-0 transition-transform duration-1000 ease-out group-hover:scale-110'>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className='object-cover'
          priority={isFirst}
          sizes='100vw'
        />
        {/* Subtle Dark Overlay */}
        <div className='absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500' />
      </div>

      {/* Top Branding Overlay */}
      <div className='absolute top-12 left-0 w-full z-10 flex flex-col items-center pointer-events-none'>
        <div className='flex flex-col items-center tracking-[0.3em]'>
          <h2 className='text-3xl md:text-5xl font-bold text-[#E52222] uppercase drop-shadow-sm'>
            Thien An{' '}
            <span className='relative'>
              Furniture
              <span className='absolute -top-1 -right-4 text-xs font-bold leading-none'>®</span>
            </span>
          </h2>
          <div className='flex items-center gap-4 w-full px-4 mt-2'>
            <div className='h-[1px] flex-1 bg-[#E52222]/50' />
            <span className='text-[10px] md:text-xs font-medium text-[#E52222] uppercase whitespace-nowrap'>
              Since 1997
            </span>
            <div className='h-[1px] flex-1 bg-[#E52222]/50' />
          </div>
        </div>
      </div>

      {/* Bottom Content Overlay */}
      <div className='absolute bottom-12 left-12 z-10 flex flex-col pointer-events-none'>
        <div className='flex flex-col'>
          <h3 className='text-4xl md:text-6xl text-white font-serif uppercase tracking-wider leading-none mb-1 drop-shadow-lg'>
            {name}
          </h3>
          <span className='text-4xl md:text-5xl font-cursive text-[#F4C58B] -mt-2 ml-4 lowercase drop-shadow-md'>
            collection
          </span>
        </div>
      </div>
    </section>
  );
};
