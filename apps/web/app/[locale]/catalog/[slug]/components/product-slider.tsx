'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';

interface ProductSliderProps {
  images: string[];
}

export const ProductSlider = ({ images }: ProductSliderProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isHovered, images.length, nextSlide]);

  if (images.length === 0) return null;

  return (
    <div
      className='relative w-full aspect-[21/9] md:aspect-[24/10] overflow-hidden rounded-2xl shadow-2xl shadow-black/10 bg-gray-100 group'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-all duration-[1200ms] ease-out',
            index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105',
          )}
        >
          <Image
            src={image}
            alt={`Slide ${index + 1}`}
            fill
            className='object-cover'
            priority={index === 0}
            sizes='100vw'
          />
        </div>
      ))}

      {/* Gradient overlay for better button visibility */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 z-[15] pointer-events-none' />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className='absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg'
            aria-label='Previous slide'
          >
            <ChevronLeft className='w-5 h-5 md:w-6 md:h-6' strokeWidth={1.5} />
          </button>
          <button
            onClick={nextSlide}
            className='absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg'
            aria-label='Next slide'
          >
            <ChevronRight className='w-5 h-5 md:w-6 md:h-6' strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Pagination dots */}
      <div className='absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-2.5 bg-black/20 backdrop-blur-md px-3 py-2 md:px-4 md:py-2.5 rounded-full'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'rounded-full transition-all duration-500 hover:scale-110',
              index === currentIndex
                ? 'bg-white w-8 h-2 md:w-10 md:h-2.5 shadow-lg shadow-white/30'
                : 'bg-white/50 w-2 h-2 md:w-2.5 md:h-2.5 hover:bg-white/70',
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
