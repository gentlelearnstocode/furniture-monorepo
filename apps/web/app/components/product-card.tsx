'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  StyledImage,
  getDisplaySettings,
  type ImageDisplaySettings,
  type ObjectFit,
} from './styled-image';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription?: string | null;
    basePrice: string;
    discountPrice?: string | null;
    showPrice?: boolean;
    gallery: {
      isPrimary: boolean;
      asset: {
        url: string;
      };
      // Display settings from admin
      focusPoint?: { x: number; y: number } | null;
      aspectRatio?: string | null;
      objectFit?: string | null;
    }[];
    colorVariants?: { color: string }[];
  };
  className?: string;
  imageRatio?: string | null;
}

export const ProductCard = ({ product, className, imageRatio }: ProductCardProps) => {
  const primaryAsset = product.gallery.find((g) => g.isPrimary) || product.gallery[0];
  const imageUrl =
    primaryAsset?.asset?.url ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800';

  // Extract display settings from the primary asset
  const displaySettings: ImageDisplaySettings | undefined = primaryAsset
    ? {
        ...getDisplaySettings(primaryAsset),
        aspectRatio: 'original', // Always use original here to let the ProductCard container handle the ratio
        objectFit: (primaryAsset.objectFit as ObjectFit) || 'cover', // Default to cover to fill the frame
      }
    : { objectFit: 'cover', aspectRatio: 'original' };

  const hasDiscount = !!product.discountPrice;
  const showPrice = product.showPrice ?? true;

  // Default color variants if not provided
  const colorVariants = product.colorVariants || [
    { color: '#B80022' },
    { color: '#93001B' },
    { color: '#49000D' },
  ];

  return (
    <Link href={`/product/${product.slug}`} className={cn('group flex flex-col gap-2', className)}>
      {/* Product Image Container */}
      <div
        className={cn(
          'relative overflow-hidden bg-[#F2F2F2] group-hover:bg-[#B80022] transition-colors duration-500 rounded-[12px]',
          imageRatio
            ? {
                'aspect-auto': imageRatio === 'original',
                'aspect-square': imageRatio === '1:1',
                'aspect-[3/4]': imageRatio === '3:4',
                'aspect-[4/3]': imageRatio === '4:3',
                'aspect-video': imageRatio === '16:9',
                'aspect-[4/5]': imageRatio === '4:5',
              }[imageRatio] || 'aspect-[4/5]'
            : 'aspect-[4/5]',
        )}
      >
        <StyledImage
          src={imageUrl}
          alt={product.name}
          displaySettings={displaySettings}
          className='transition-transform duration-500 group-hover:scale-105'
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

        {/* Subtle overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>

      {/* Product Info */}
      <div className='pt-2 flex flex-col items-start'>
        <h3 className='text-[24px] md:text-[32px] font-serif font-medium text-black leading-tight group-hover:text-[#49000D] transition-colors'>
          {product.name}
        </h3>

        <p className='text-[16px] md:text-[20px] font-serif text-[#666] leading-snug'>
          {product.shortDescription || 'Available in multiple finishes'}
        </p>

        {/* Color Dots */}
        <div className='flex items-center gap-2 mt-2'>
          {colorVariants.slice(0, 3).map((variant, index) => (
            <div
              key={index}
              className='w-5 h-5 rounded-full border border-black/5'
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
