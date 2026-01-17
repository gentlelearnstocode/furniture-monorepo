'use client';

import React, { useState } from 'react';
import { cn } from '@repo/ui/lib/utils';
import { StyledImage, type ImageDisplaySettings } from '@/app/components/styled-image';

interface GalleryImage {
  url: string;
  displaySettings?: ImageDisplaySettings;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

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
      <div className='aspect-[4/3] relative bg-[#F9F9F9] rounded-sm overflow-hidden shadow-sm'>
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
              'aspect-video relative bg-[#F9F9F9] rounded-sm overflow-hidden transition-all duration-300 border-2',
              activeIndex === index
                ? 'border-red-800'
                : 'border-transparent opacity-70 hover:opacity-100'
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
    </div>
  );
}
