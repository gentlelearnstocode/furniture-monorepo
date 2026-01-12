'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

export const ProductCard = ({ name, slug, imageUrl }: ProductCardProps) => {
  return (
    <Link href={`/product/${slug}`} className='group flex flex-col gap-4'>
      <div className='relative aspect-[4/5] overflow-hidden bg-gray-100'>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-105'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
        />
      </div>
      <div className='flex items-center gap-2 group-hover:gap-3 transition-all duration-300'>
        <div className='w-5 h-5 rounded-full border border-black flex items-center justify-center'>
          <ChevronRight size={12} className='text-black' />
        </div>
        <span className='text-[14px] font-serif italic uppercase tracking-widest text-black/80'>
          Expand Your View
        </span>
      </div>
    </Link>
  );
};
