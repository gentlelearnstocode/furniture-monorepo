'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { ProductCard } from './product-card';

interface Product {
  id: string;
  name: string;
  slug: string;
  gallery: {
    isPrimary: boolean;
    asset: {
      url: string;
    } | null;
  }[];
}

interface Collection {
  id: string;
  name: string;
  bannerUrl: string | null;
  products: Product[];
}

interface CatalogDetailWrapperProps {
  collections: Collection[];
}

export const CatalogDetailWrapper = ({ collections }: CatalogDetailWrapperProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const currentCollection = collections[currentIndex];
  const bannerImages = collections.map((c) => c.bannerUrl).filter((url): url is string => !!url);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % collections.length);
  }, [collections.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + collections.length) % collections.length);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (collections.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isHovered, collections.length, nextSlide]);

  if (collections.length === 0) return null;

  return (
    <>
      {/* Hero Slider - Collection Banners */}
      {bannerImages.length > 0 && (
        <div className='container mx-auto px-4 mb-16'>
          <div
            className='relative w-full aspect-[21/9] md:aspect-[24/10] overflow-hidden rounded-2xl shadow-2xl shadow-black/10 bg-gray-100 group'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {collections.map((collection, index) => (
              <div
                key={collection.id}
                className={cn(
                  'absolute inset-0 transition-all duration-[1200ms] ease-out',
                  index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
                )}
              >
                {collection.bannerUrl && (
                  <Image
                    src={collection.bannerUrl}
                    alt={collection.name}
                    fill
                    className='object-cover'
                    priority={index === 0}
                    sizes='100vw'
                  />
                )}
              </div>
            ))}

            {/* Gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 z-[15] pointer-events-none' />

            {/* Navigation Arrows */}
            {collections.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className='absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg'
                  aria-label='Previous collection'
                >
                  <ChevronLeft size={26} strokeWidth={1.5} />
                </button>
                <button
                  onClick={nextSlide}
                  className='absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg'
                  aria-label='Next collection'
                >
                  <ChevronRight size={26} strokeWidth={1.5} />
                </button>
              </>
            )}

            {/* Pagination dots */}
            <div className='absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-full'>
              {collections.map((collection, index) => (
                <button
                  key={collection.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'rounded-full transition-all duration-500 hover:scale-110',
                    index === currentIndex
                      ? 'bg-white w-10 h-2.5 shadow-lg shadow-white/30'
                      : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/70'
                  )}
                  aria-label={`Go to ${collection.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shop the look Section - Shows products from current collection */}
      {currentCollection && currentCollection.products.length > 0 && (
        <div className='container mx-auto px-4 pb-20'>
          {/* Section Header with decorative elements */}
          <div className='relative mb-12'>
            <div className='flex items-center justify-center gap-6 mb-3'>
              <div className='h-px w-16 bg-gradient-to-r from-transparent to-black/20' />
              <h2 className='text-5xl md:text-6xl font-serif italic text-center text-black/85 tracking-wide'>
                Shop the look
              </h2>
              <div className='h-px w-16 bg-gradient-to-l from-transparent to-black/20' />
            </div>
            <p className='text-center text-sm font-serif italic text-gray-400 tracking-widest uppercase'>
              {currentCollection.name}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16'>
            {currentCollection.products.map((product) => {
              const primaryAsset = product.gallery.find((g) => g.isPrimary) || product.gallery[0];
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  imageUrl={
                    primaryAsset?.asset?.url ||
                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'
                  }
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
