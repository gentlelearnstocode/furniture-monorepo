'use client';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { type Product } from '@repo/shared';
import {
  StyledImage,
  getDisplaySettings,
  type ImageDisplaySettings,
  type ObjectFit,
} from './styled-image';
import { useLocalizedText } from '@/providers/language-provider';

interface ProductCardProps {
  product: Product;
  className?: string;
  imageRatio?: string | null;
}

export const ProductCard = ({ product, className, imageRatio }: ProductCardProps) => {
  const tl = useLocalizedText();
  const productName = tl(product, 'name');
  const productDesc = tl(product, 'shortDescription');

  const primaryAsset = product.gallery?.find((g) => g.isPrimary) || product.gallery?.[0];
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

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn('group flex flex-col gap-2 cursor-pointer', className)}
    >
      {/* Product Image Container */}
      <div
        className={cn(
          'relative overflow-hidden bg-brand-neutral-100 transition-colors duration-500 rounded-[12px]',
          {
            'aspect-auto': imageRatio === 'original',
            'aspect-square': imageRatio === '1:1',
            'aspect-[3/4] w-2/3': imageRatio === '3:4',
            'aspect-[4/3]': imageRatio === '4:3',
            'aspect-video': imageRatio === '16:9',
            'aspect-[4/5]': imageRatio === '4:5' || !imageRatio,
          },
        )}
      >
        <StyledImage
          src={imageUrl}
          alt={productName}
          displaySettings={displaySettings}
          className='transition-transform duration-500 group-hover:scale-105'
          sizes='(max-width: 768px) 50vw, 25vw'
        />

        {/* Sale Badge - Top Left */}
        {hasDiscount && (
          <div className='absolute top-3 left-3 z-10'>
            <div className='bg-brand-primary-600 text-white group-hover:bg-white group-hover:text-brand-primary-600 w-14 h-9 flex items-center justify-center rounded-[4px] transition-colors duration-500'>
              <span className='text-lg font-bold font-serif italic'>%</span>
            </div>
          </div>
        )}

        {/* Subtle overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>

      {/* Product Info */}
      <div className='pt-1.5 sm:pt-2 flex flex-col items-start'>
        <h3 className='text-[14px] sm:text-[18px] md:text-[22px] font-serif font-medium text-black leading-tight group-hover:text-brand-primary-900 transition-colors'>
          {productName}
        </h3>

        {productDesc && (
          <p className='text-[11px] sm:text-[13px] md:text-[15px] font-serif text-brand-neutral-500 leading-snug mt-0.5'>
            {productDesc}
          </p>
        )}

        {/* Price Display */}
        {showPrice && (
          <div className='flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2'>
            {hasDiscount ? (
              <>
                <span className='text-[13px] sm:text-[15px] md:text-[17px] font-serif font-bold text-brand-primary-600'>
                  ${product.discountPrice}
                </span>
                <span className='text-[10px] sm:text-[12px] md:text-[14px] font-serif line-through text-brand-neutral-400'>
                  ${product.basePrice}
                </span>
              </>
            ) : (
              <span className='text-[13px] sm:text-[15px] md:text-[17px] font-serif text-black font-medium'>
                ${product.basePrice}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};
