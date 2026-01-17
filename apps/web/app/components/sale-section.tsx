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

  // Extract color variants if available (mock for now based on design)
  const colorVariants = product.colorVariants || [
    { color: '#8B0000' },
    { color: '#4A0000' },
    { color: '#2C2C2C' },
  ];

  return (
    <Link href={`/product/${product.slug}`} className={cn('group flex flex-col', className)}>
      {/* Product Image Container */}
      <div className='relative aspect-[4/5] overflow-hidden bg-white'>
        <StyledImage
          src={imageUrl}
          alt={product.name}
          displaySettings={displaySettings}
          className='p-4 transition-transform duration-500 group-hover:scale-105'
          sizes='(max-width: 768px) 50vw, 25vw'
        />

        {/* Sale Badge - Top Left */}
        {hasDiscount && (
          <div className='absolute top-3 left-3 z-10'>
            <div className='bg-[#8B0000] text-white w-8 h-8 flex items-center justify-center'>
              <span className='text-xs font-bold'>%</span>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className='pt-4 flex flex-col gap-1'>
        <h3 className='text-[13px] md:text-[14px] font-medium text-black tracking-wide'>
          {product.name || 'Product Name'}
        </h3>

        <p className='text-[11px] md:text-[12px] text-gray-500 italic'>
          {product.shortDescription || 'Fabric - Lacquered'}
        </p>

        {/* Color Dots */}
        <div className='flex items-center gap-1.5 mt-1'>
          {colorVariants.slice(0, 3).map((variant: any, index: number) => (
            <div
              key={index}
              className='w-3 h-3 rounded-full border border-gray-200'
              style={{ backgroundColor: variant.color }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export const SaleSection = ({ products, settings }: SaleSectionProps) => {
  if (!settings || !settings.isActive || products.length === 0) {
    return null;
  }

  return (
    <section className='bg-[#EBEBEB] py-16 md:py-20'>
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
