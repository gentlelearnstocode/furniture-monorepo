'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { useLocalizedText } from '@/providers/language-provider';
import { useTranslations } from 'next-intl';
import { type Product, type Collection } from '@repo/shared';
import { ProductCard } from './product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@repo/ui/ui/carousel';

interface CatalogDetailWrapperProps {
  collections: Collection[];
}

export const CatalogDetailWrapper = ({ collections }: CatalogDetailWrapperProps) => {
  const tl = useLocalizedText();
  const tc = useTranslations('Catalog');
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

  // Auto-slide disabled per user request
  React.useEffect(() => {
    // If collections.length <= 1 || isHovered) return;
    // const interval = setInterval(() => {
    //   nextSlide();
    // }, 5000);
    // return () => clearInterval(interval);
  }, [currentIndex, isHovered, collections.length, nextSlide]);

  if (collections.length === 0) return null;

  return (
    <>
      {/* Hero Slider - Collection Banners */}
      {bannerImages.length > 0 && (
        <div className='container mt-10'>
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
                  index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105',
                )}
              >
                {collection.bannerUrl && (
                  <Image
                    src={collection.bannerUrl}
                    alt={tl(collection, 'name')}
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
                  className='absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg'
                  aria-label={tc('prevCollection')}
                >
                  <ChevronLeft className='w-5 h-5 md:w-6 md:h-6' strokeWidth={1.5} />
                </button>
                <button
                  onClick={nextSlide}
                  className='absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg'
                  aria-label={tc('nextCollection')}
                >
                  <ChevronRight className='w-5 h-5 md:w-6 md:h-6' strokeWidth={1.5} />
                </button>
              </>
            )}

            {/* Pagination dots */}
            <div className='absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-2.5 bg-black/20 backdrop-blur-md px-3 py-2 md:px-4 md:py-2.5 rounded-full'>
              {collections.map((collection, index) => (
                <button
                  key={collection.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'rounded-full transition-all duration-500 hover:scale-110',
                    index === currentIndex
                      ? 'bg-white w-8 h-2 md:w-10 md:h-2.5 shadow-lg shadow-white/30'
                      : 'bg-white/50 w-2 h-2 md:w-2.5 md:h-2.5 hover:bg-white/70',
                  )}
                  aria-label={tc('goToCollection', { name: tl(collection, 'name') })}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shop the look Section - Shows products from current collection */}
      {currentCollection && currentCollection.products && currentCollection.products.length > 0 && (
        <div className='container pb-12 md:pb-16'>
          {/* Section Header with decorative elements */}
          <div className='relative mb-8'>
            <div className='flex items-center justify-center gap-6 mb-3'>
              <div className='h-px w-16 bg-gradient-to-r from-transparent to-black/20' />
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-serif text-center text-black/85 tracking-wide'>
                {tc('shopTheLook')}
              </h2>
              <div className='h-px w-16 bg-gradient-to-l from-transparent to-black/20' />
            </div>
            <p className='text-center text-sm font-serif text-gray-400 tracking-widest uppercase'>
              {tl(currentCollection, 'name')}
            </p>
          </div>

          {/* Product Carousel */}
          <div className='relative px-4 md:px-12'>
            <Carousel
              opts={{
                align: 'start',
                loop: false,
              }}
              className='w-full'
            >
              <CarouselContent className='-ml-4'>
                {currentCollection.products.map((product: Product) => (
                  <CarouselItem key={product.id} className='pl-4 basis-1/2 lg:basis-1/4'>
                    <ProductCard
                      product={{
                        ...product,
                        basePrice: '0',
                        gallery: product.gallery?.map((g) => ({
                          ...g,
                          asset: g.asset || { url: '' },
                        })),
                      }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='-left-3 md:-left-6 top-[38%] md:top-[40%] z-20' />
              <CarouselNext className='-right-3 md:-right-6 top-[38%] md:top-[40%] z-20' />
              <CarouselDots className='mt-10' />
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
};
