'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { StyledImage, type ImageDisplaySettings } from '@/app/[locale]/components/styled-image';

interface GalleryImage {
  url: string;
  displaySettings?: ImageDisplaySettings;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  name: string;
  imageRatio?: string | null;
}

export function ProductGallery({ images, name, imageRatio }: ProductGalleryProps) {
  console.log('imageRatio', imageRatio);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const activeImage = images[activeIndex];

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, images.length]);

  if (images.length === 0 || !activeImage) {
    return (
      <div className='aspect-square relative bg-gray-100 rounded-sm overflow-hidden'>
        <div className='absolute inset-0 flex items-center justify-center text-gray-400 font-serif italic'>
          No images available
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Main Image */}
      <div
        onClick={() => setIsFullscreen(true)}
        className={cn(
          'relative bg-[#F9F9F9] rounded-sm overflow-hidden shadow-sm cursor-zoom-in group',
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
          src={activeImage.url}
          alt={name}
          displaySettings={activeImage.displaySettings}
          className='transition-transform duration-500'
          priority
          sizes='(max-width: 1024px) 100vw, 50vw'
        />
      </div>

      {/* Thumbnails */}
      <div className='grid grid-cols-4 md:grid-cols-5 gap-4'>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'relative bg-[#F9F9F9] rounded-sm overflow-hidden transition-all duration-300 border-2',
              {
                'aspect-auto': imageRatio === 'original',
                'aspect-square': imageRatio === '1:1',
                'aspect-[3/4]': imageRatio === '3:4',
                'aspect-[4/3]': imageRatio === '4:3',
                'aspect-video': imageRatio === '16:9',
                'aspect-[4/5]': imageRatio === '4:5' || !imageRatio,
              },
              activeIndex === index
                ? 'border-red-800'
                : 'border-transparent opacity-70 hover:opacity-100',
            )}
          >
            <StyledImage
              src={image.url}
              alt={`${name} thumbnail ${index + 1}`}
              displaySettings={image.displaySettings}
              sizes='(max-width: 768px) 25vw, 10vw'
            />
          </button>
        ))}
      </div>
      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          className='fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm'
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className='absolute top-4 right-4 z-50 p-2 text-white/50 hover:text-white transition-colors'
            aria-label='Close fullscreen'
          >
            <X className='w-8 h-8' />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }}
            className='absolute left-4 z-50 p-2 text-white/50 hover:text-white transition-colors'
            aria-label='Previous image'
          >
            <ChevronLeft className='w-12 h-12' />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }}
            className='absolute right-4 z-50 p-2 text-white/50 hover:text-white transition-colors'
            aria-label='Next image'
          >
            <ChevronRight className='w-12 h-12' />
          </button>

          <div
            className='relative w-full h-[90vh] max-w-7xl px-16 flex items-center justify-center cursor-default'
            onClick={(e) => e.stopPropagation()}
          >
            <StyledImage
              src={activeImage.url}
              alt={name}
              displaySettings={{
                ...activeImage.displaySettings,
                aspectRatio: 'original',
                objectFit: 'contain',
              }}
              className='object-contain'
              sizes='100vw'
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
