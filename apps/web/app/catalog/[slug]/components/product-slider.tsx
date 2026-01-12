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

  if (images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className='relative w-full aspect-[21/9] md:aspect-[24/10] overflow-hidden bg-gray-100 group'>
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-in-out',
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
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

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className='absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/40 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300'
            aria-label='Previous slide'
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          <button
            onClick={nextSlide}
            className='absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/40 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300'
            aria-label='Next slide'
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>
        </>
      )}

      {/* Pagination dots (Optional, but good for UX) */}
      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              index === currentIndex ? 'bg-white w-8' : 'bg-white/40'
            )}
          />
        ))}
      </div>
    </div>
  );
};
