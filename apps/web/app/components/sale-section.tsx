'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StyledImage } from './styled-image';

interface SaleSectionProps {
  products: any[];
  settings: any;
}

interface SaleProductCardProps {
  product: any;
  className?: string;
}

const SaleProductCard = ({ product, className }: SaleProductCardProps) => {
  const primaryAsset = product.gallery?.find((g: any) => g.isPrimary) || product.gallery?.[0];
  const imageUrl =
    primaryAsset?.asset?.url ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800';

  // Extract display settings from the primary asset
  const displaySettings = primaryAsset
    ? {
        focusPoint: primaryAsset.focusPoint || undefined,
        aspectRatio:
          (primaryAsset.aspectRatio as 'original' | '1:1' | '3:4' | '4:3' | '16:9') || undefined,
        objectFit: (primaryAsset.objectFit as 'cover' | 'contain') || 'contain', // Default to contain for sale cards
      }
    : { objectFit: 'contain' as const };

  const hasDiscount = !!product.discountPrice;
  const showPrice = product.showPrice ?? true;

  // Extract color variants if available (mock for now based on design)
  const colorVariants = product.colorVariants || [
    { color: '#B80022' },
    { color: '#93001B' },
    { color: '#49000D' },
  ];

  return (
    <Link href={`/product/${product.slug}`} className={cn('group flex flex-col gap-2', className)}>
      {/* Product Image Container */}
      <div className='relative aspect-[4/5] overflow-hidden bg-[#EBEBEB] group-hover:bg-[#B80022] transition-colors duration-500 rounded-[12px]'>
        <StyledImage
          src={imageUrl}
          alt={product.name}
          displaySettings={displaySettings}
          className='p-8 transition-transform duration-500 group-hover:scale-105'
          sizes='(max-width: 768px) 50vw, 25vw'
        />

        {/* Sale Badge - Top Left */}
        {hasDiscount && (
          <div className='absolute top-3 left-3 z-10'>
            <div className='bg-[#B80022] text-white group-hover:bg-white group-hover:text-[#B80022] w-14 h-9 flex items-center justify-center rounded-[4px] transition-colors duration-500'>
              <span className='text-lg font-bold font-serif italic'>%</span>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className='pt-2 flex flex-col items-start'>
        <h3 className='text-[24px] md:text-[32px] font-serif font-medium text-black leading-tight group-hover:text-[#49000D] transition-colors'>
          {product.name || 'Product Name'}
        </h3>

        <p className='text-[16px] md:text-[20px] font-serif text-[#666] leading-snug'>
          {product.shortDescription || 'Fabric - Lacquered'}
        </p>

        {/* Color Dots */}
        <div className='flex items-center gap-2 mt-2'>
          {colorVariants.slice(0, 3).map((variant: any, index: number) => (
            <div
              key={index}
              className='w-5 h-5 rounded-full'
              style={{ backgroundColor: variant.color }}
            />
          ))}
        </div>

        {/* Price Display */}
        {showPrice && (
          <div className='flex items-center gap-3 mt-2'>
            {hasDiscount ? (
              <>
                <span className='text-[18px] md:text-[22px] font-serif font-bold text-[#b80022]'>
                  ${product.discountPrice}
                </span>
                <span className='text-[14px] md:text-[16px] font-serif line-through text-gray-500'>
                  ${product.basePrice}
                </span>
              </>
            ) : (
              <span className='text-[18px] md:text-[22px] font-serif text-black font-medium'>
                ${product.basePrice}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export const SaleSection = ({ products, settings }: SaleSectionProps) => {
  if (!settings || !settings.isActive || products.length === 0) {
    return null;
  }

  return (
    <section className='bg-white py-16 md:py-20'>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='flex flex-col items-center mb-12'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-serif text-[#49000D] tracking-wide uppercase'>
            {settings.title || 'Sales'}
          </h2>

          {/* Decorative divider with icon */}
          <div className='flex items-center gap-3 mt-4'>
            <div className='w-16 h-[2px] bg-[#8B0000]' />
            <Image
              src='/symbol.svg'
              alt='decorative symbol'
              width={24}
              height={24}
              className='opacity-80'
            />
            <div className='w-16 h-[2px] bg-[#8B0000]' />
          </div>
        </div>

        {/* Product Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {products.slice(0, 4).map((product) => (
            <SaleProductCard
              key={product.id}
              product={product}
              className='animate-in fade-in slide-in-from-bottom-4 duration-700'
            />
          ))}
        </div>

        {/* Expand Your View Link */}
        <div className='flex justify-center mt-10'>
          <Link
            href='/sale'
            className='group flex items-center gap-2 text-[13px] font-medium tracking-wider text-gray-700 hover:text-[#49000D] transition-colors'
          >
            <span>Expand Your View</span>
            <div className='w-5 h-5 rounded-full border border-current flex items-center justify-center transition-transform group-hover:translate-x-1'>
              <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
