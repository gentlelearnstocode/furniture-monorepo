'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { StyledImage, type ImageDisplaySettings } from '@/app/components/styled-image';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  displaySettings?: ImageDisplaySettings;
}

export const ProductCard = ({ name, slug, imageUrl, displaySettings }: ProductCardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link
      href={`/product/${slug}`}
      className='group flex flex-col gap-5'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-xl shadow-lg shadow-black/5 group-hover:shadow-2xl group-hover:shadow-black/10 transition-all duration-500'>
        <StyledImage
          src={imageUrl}
          alt={name}
          displaySettings={displaySettings}
          className='transition-all duration-700 group-hover:scale-110'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
        />

        {/* Elegant overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

        {/* Product name overlay on hover */}
        <div className='absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500'>
          <h3 className='text-white text-lg font-serif italic tracking-wide drop-shadow-lg'>
            {name}
          </h3>
        </div>
      </div>

      <div className='flex items-center gap-2.5 group-hover:gap-4 transition-all duration-300'>
        <div
          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isHovered
              ? 'border-black bg-black text-white scale-110'
              : 'border-black/40 bg-transparent text-black/60'
          }`}
        >
          <ChevronRight size={14} strokeWidth={2} />
        </div>
        <span
          className={`text-[13px] font-serif italic uppercase tracking-[0.15em] transition-colors duration-300 ${
            isHovered ? 'text-black' : 'text-black/60'
          }`}
        >
          Expand Your View
        </span>
      </div>
    </Link>
  );
};
