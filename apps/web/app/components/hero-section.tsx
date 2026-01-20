'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocalizedText } from '@/providers/language-provider';

interface HeroProps {
  data: {
    title?: string | null;
    titleVi?: string | null;
    subtitle?: string | null;
    subtitleVi?: string | null;
    buttonText?: string | null;
    buttonTextVi?: string | null;
    buttonLink?: string | null;
    backgroundType: 'image' | 'video';
    backgroundImageUrl?: string | null;
    backgroundVideoUrl?: string | null;
  } | null;
}

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop';

export const Hero = ({ data }: HeroProps) => {
  const t = useLocalizedText();

  if (!data) return null;

  const title = data.title ? t(data, 'title') : null;
  const subtitle = data.subtitle ? t(data, 'subtitle') : null;
  const buttonText = data.buttonText ? t(data, 'buttonText') : null;

  const showVideo = data.backgroundType === 'video' && data.backgroundVideoUrl;
  const imageUrl = data.backgroundImageUrl || DEFAULT_HERO_IMAGE;

  return (
    <section className='relative h-screen w-full flex items-center justify-center overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 z-0'>
        {showVideo ? (
          <video
            src={data.backgroundVideoUrl!}
            autoPlay
            muted
            loop
            playsInline
            className='w-full h-full object-cover'
          />
        ) : (
          <Image
            src={imageUrl}
            alt={data.title || 'Hero Image'}
            fill
            className='object-cover'
            priority
            sizes='100vw'
          />
        )}
        {/* Dark Overlay for Readability */}
        <div className='absolute inset-0 bg-black/40' />
      </div>

      {/* Hero Content */}
      {(title || subtitle || (buttonText && data.buttonLink)) && (
        <div className='relative z-10 text-center text-white px-4 max-w-4xl'>
          {title && (
            <h1 className='text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight tracking-tight whitespace-pre-line'>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className='text-lg md:text-xl font-light tracking-widest uppercase mb-10 text-white/90'>
              {subtitle}
            </p>
          )}
          {buttonText && data.buttonLink && (
            <Link
              href={data.buttonLink}
              className='inline-block px-10 py-4 bg-white text-black text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors'
            >
              {buttonText}
            </Link>
          )}
        </div>
      )}

      {/* Bottom Gradient Fade */}
      <div className='absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent' />
    </section>
  );
};
