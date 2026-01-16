import React from 'react';
import Image from 'next/image';
import { getIntroData } from '@/lib/queries';

export const IntroSection = async () => {
  const intro = await getIntroData();

  if (!intro) return null;

  return (
    <section className='relative py-24 md:py-32 overflow-hidden'>
      {/* Background Layer */}
      <div className='absolute inset-0 z-0'>
        {intro.backgroundImage ? (
          <Image
            src={intro.backgroundImage.url}
            alt='Section Background'
            fill
            className='object-cover'
          />
        ) : (
          <div className='absolute inset-0 bg-[#7B0C0C]' /> // Default deep red if no background provided
        )}
        {/* Subtle Pattern Overlay if needed - could be implemented with CSS masks */}
        <div className='absolute inset-0 bg-black/10 mix-blend-multiply opacity-50' />
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center'>
          {/* Left: Intro Image */}
          <div className='relative group'>
            {intro.introImage && (
              <div className='relative aspect-[4/3] w-full overflow-hidden rounded-sm shadow-2xl'>
                <Image
                  src={intro.introImage.url}
                  alt={intro.title}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-105'
                  sizes='(max-width: 1024px) 100vw, 50vw'
                />
              </div>
            )}
            {/* Elegant border accent */}
            <div className='absolute -inset-4 border border-white/10 -z-10 rounded-sm' />
          </div>

          {/* Right: Content */}
          <div className='text-white max-w-xl'>
            {intro.subtitle && (
              <span className='block text-lg md:text-xl font-serif italic mb-2 tracking-wide text-white/90'>
                {intro.subtitle}
              </span>
            )}
            <h2 className='text-4xl md:text-5xl font-bold font-serif mb-8 leading-tight tracking-tight border-b border-white/20 pb-4'>
              {intro.title}
            </h2>
            <div
              className='prose prose-invert prose-sm md:prose-base max-w-none text-white/80 leading-relaxed font-light'
              dangerouslySetInnerHTML={{ __html: intro.contentHtml }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
