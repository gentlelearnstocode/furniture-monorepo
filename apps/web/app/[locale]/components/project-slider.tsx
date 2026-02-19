'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { useLocalizedText } from '@/providers/language-provider';

// Define a minimal interface for what we need
export interface Project {
  id: string;
  title: string;
  titleVi?: string | null;
  slug: string;
  image: {
    url: string;
    altText?: string | null;
  } | null;
}

interface ProjectSliderProps {
  projects: Project[];
}

export const ProjectSlider = ({ projects }: ProjectSliderProps) => {
  const t = useLocalizedText();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    if (e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // If we have fewer than 3 projects, we might want to handle it gracefully,
  // but the requirement implies 3 latest projects.
  // We'll assume at least 3 for the full effect, but code should be robust.

  const count = projects.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isHovered || count < 2) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovered, count, nextSlide]);

  if (!projects.length) return null;

  // Helper to determine position
  const getPosition = (index: number) => {
    if (index === currentIndex) return 'active';

    // Calculate relative position with wrapping
    // For 3 items:
    // If current is 0: 1 is right, 2 is left (2 is -1)
    // If current is 1: 2 is right, 0 is left.
    // Generic logic for "Left" and "Right" neighbors
    const prevIndex = (currentIndex - 1 + count) % count;
    const nextIndex = (currentIndex + 1) % count;

    if (index === prevIndex) return 'left';
    if (index === nextIndex) return 'right';

    return 'hidden';
  };

  return (
    <div
      className='relative w-full max-w-7xl mx-auto h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center perspective-1000'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className='relative w-full h-full flex items-center justify-center overflow-hidden md:overflow-visible'>
        {projects.map((project, index) => {
          const position = getPosition(index);
          const isActive = position === 'active';

          return (
            <div
              key={project.id}
              className={cn(
                'absolute transition-all duration-700 ease-in-out cursor-pointer',
                isActive
                  ? 'z-30 w-[85%] md:w-[60%] h-[80%] md:h-full opacity-100 scale-100'
                  : position === 'left'
                    ? 'z-10 w-[70%] md:w-[45%] h-[70%] md:h-[80%] opacity-40 -translate-x-[15%] md:-translate-x-[60%] hover:opacity-60'
                    : position === 'right'
                      ? 'z-10 w-[70%] md:w-[45%] h-[70%] md:h-[80%] opacity-40 translate-x-[15%] md:translate-x-[60%] hover:opacity-60'
                      : 'z-0 opacity-0 scale-50',
              )}
              onClick={() => {
                if (position === 'left') prevSlide();
                if (position === 'right') nextSlide();
              }}
            >
              {isActive ? (
                <Link
                  href={`/projects/${project.slug}`}
                  className='block relative w-full h-full group'
                >
                  <div
                    className={cn(
                      'relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500',
                      isActive ? 'shadow-black/20' : 'shadow-none',
                    )}
                  >
                    {project.image ? (
                      <div className='absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110'>
                        <Image
                          src={project.image.url}
                          alt={project.image.altText || project.title}
                          fill
                          className='object-cover'
                          sizes={isActive ? '(max-width: 768px) 100vw, 60vw' : '40vw'}
                          priority={isActive}
                        />
                      </div>
                    ) : (
                      <div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400'>
                        No Image
                      </div>
                    )}

                    {/* Dark Overlay - 30% default on mobile, 0% default on desktop, 30% on hover */}
                    <div className='absolute inset-0 bg-black/30 md:bg-black/0 md:group-hover:bg-black/30 transition-colors duration-700 z-10' />

                    {/* Centered Content - Static on Mobile, Visible on Hover on Desktop */}
                    <div className='absolute inset-0 z-20 flex flex-col items-center justify-center text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 px-4'>
                      <h3 className='text-3xl md:text-5xl font-serif text-white tracking-wide drop-shadow-lg transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700'>
                        {t(project, 'title')}
                      </h3>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  className={cn(
                    'relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500',
                    isActive ? 'shadow-black/20' : 'shadow-none',
                  )}
                >
                  {project.image ? (
                    <Image
                      src={project.image.url}
                      alt={project.image.altText || project.title}
                      fill
                      className='object-cover'
                      sizes={isActive ? '(max-width: 768px) 100vw, 60vw' : '40vw'}
                      priority={isActive}
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400'>
                      No Image
                    </div>
                  )}
                  <div
                    className={cn(
                      'absolute inset-0 bg-black/10 transition-opacity duration-500',
                      isActive ? 'opacity-0' : 'opacity-30 group-hover:opacity-10',
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className='absolute top-1/2 left-4 md:left-10 -translate-y-1/2 z-40 hidden md:block'>
        <button
          onClick={prevSlide}
          className='w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110'
          aria-label='Previous project'
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className='absolute top-1/2 right-4 md:right-10 -translate-y-1/2 z-40 hidden md:block'>
        <button
          onClick={nextSlide}
          className='w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110'
          aria-label='Next project'
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Pagination - Glassmorphism style from CatalogDetailWrapper */}
      <div className='absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-2.5 bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-full'>
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={cn(
              'rounded-full transition-all duration-500 hover:scale-110',
              idx === currentIndex
                ? 'bg-white w-10 h-2.5 shadow-lg shadow-white/30'
                : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/70',
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
