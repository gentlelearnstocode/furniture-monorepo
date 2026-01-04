'use client';

import React from 'react';
import Image from 'next/image';

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop';

export const Hero = () => {
  return (
    <section className='relative h-screen w-full flex items-center justify-center overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0'>
        <Image
          src={HERO_IMAGE_URL}
          alt='Luxury Furniture Hero'
          fill
          className='object-cover'
          priority
          sizes='100vw'
        />
        {/* Dark Overlay for Readability */}
        <div className='absolute inset-0 bg-black/40' />
      </div>

      {/* Hero Content */}
      <div className='relative z-10 text-center text-white px-4 max-w-4xl'>
        <h1 className='text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight tracking-tight'>
          Excellence in <br /> Craftsmanship
        </h1>
        <p className='text-lg md:text-xl font-light tracking-widest uppercase mb-10 text-white/90'>
          Timeless furniture for your home since 1997.
        </p>
        <button className='px-10 py-4 bg-white text-black text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors'>
          Explore Collections
        </button>
      </div>

      {/* Bottom Gradient Fade */}
      <div className='absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent' />
    </section>
  );
};
