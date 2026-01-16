'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
    }[];
  };
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const primaryAsset = product.gallery.find((g) => g.isPrimary) || product.gallery[0];
  const imageUrl =
    primaryAsset?.asset?.url ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800';

  const hasDiscount = !!product.discountPrice;
  const displayPrice = hasDiscount ? product.discountPrice : product.basePrice;
  const originalPrice = product.basePrice;
  const showPrice = product.showPrice ?? true;

  return (
    <Link href={`/product/${product.slug}`} className={cn('group flex flex-col gap-4', className)}>
      {/* Product Image Container */}
      <div className='relative aspect-[3/4] overflow-hidden bg-gray-100 shadow-md shadow-black/5 group-hover:shadow-xl group-hover:shadow-black/10 transition-all duration-500'>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className='object-cover transition-all duration-700 group-hover:scale-105'
          sizes='(max-width: 768px) 50vw, 25vw'
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className='absolute top-0 right-0 z-10'>
            <div className='bg-[#49000D] text-white p-2 flex items-center justify-center'>
              <span className='text-[14px] font-bold'>%</span>
            </div>
          </div>
        )}

        {/* Subtle overlay on hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </div>

      {/* Product Info */}
      <div className='flex flex-col gap-2'>
        <h3 className='text-[15px] md:text-[17px] font-serif uppercase tracking-[0.05em] text-black/90 group-hover:text-black transition-colors text-center font-medium'>
          {product.name}
        </h3>

        <p className='text-[11px] md:text-[12px] font-serif italic text-gray-400 tracking-[0.1em] uppercase text-center min-h-[1.5em]'>
          {product.shortDescription || 'Available in multiple finishes'}
        </p>

        {showPrice && (
          <div className='flex items-center justify-center gap-2 mt-1'>
            {hasDiscount ? (
              <>
                <span className='text-[14px] md:text-[16px] font-serif font-bold text-[#49000D]'>
                  ${displayPrice}
                </span>
                <span className='text-[12px] md:text-[14px] font-serif line-through text-gray-400'>
                  ${originalPrice}
                </span>
              </>
            ) : (
              <span className='text-[14px] md:text-[16px] font-serif text-black/90 font-medium'>
                ${originalPrice}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};
