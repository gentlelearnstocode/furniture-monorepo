import React from 'react';
import Image from 'next/image';
import { getIntroData } from '@/lib/queries';
import { getLocale, getLocalizedText, getLocalizedHtml } from '@/lib/i18n';
import { getTranslations } from 'next-intl/server';

export const IntroSection = async () => {
  const intro = await getIntroData();
  const locale = await getLocale();
  const t = await getTranslations('Intro');

  if (!intro) return null;

  return (
    <section className='relative py-16 md:py-20 overflow-hidden'>
      {/* Background Layer */}
      <div className='absolute inset-0 z-0'>
        {intro.backgroundImage ? (
          <Image src={intro.backgroundImage.url} alt={t('bgAlt')} fill className='object-cover' />
        ) : (
          <div className='absolute inset-0 bg-[#7B0C0C]' /> // Default deep red if no background provided
        )}
        {/* Subtle Pattern Overlay if needed - could be implemented with CSS masks */}
        <div className='absolute inset-0 bg-black/10 mix-blend-multiply opacity-50' />
      </div>

      <div className='container relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center'>
          {/* Left: Intro Image - "Painting on wall" effect */}
          <div className='relative group px-4 sm:px-0'>
            {intro.introImage && (
              <div
                className='relative aspect-[4/3] w-full overflow-hidden'
                style={{
                  borderRadius: '4px',
                  boxShadow: `
                    0 67px 19px 0 rgba(0, 0, 0, 0.01),
                    0 43px 17px 0 rgba(0, 0, 0, 0.12),
                    0 24px 15px 0 rgba(0, 0, 0, 0.40),
                    0 11px 11px 0 rgba(0, 0, 0, 0.68),
                    0 3px 6px 0 rgba(0, 0, 0, 0.79)
                  `,
                }}
              >
                <Image
                  src={intro.introImage.url}
                  alt={intro.title}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-105'
                  sizes='(max-width: 1024px) 100vw, 50vw'
                />
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className='text-white max-w-xl'>
            {intro.subtitle && (
              <span className='block text-base md:text-lg font-serif italic mb-2 tracking-wide text-white/90'>
                {getLocalizedText(intro, 'subtitle', locale)}
              </span>
            )}
            <h2 className='text-2xl md:text-3xl font-bold font-serif mb-6 leading-tight tracking-tight border-b border-white/20 pb-3'>
              {getLocalizedText(intro, 'title', locale)}
            </h2>
            {(() => {
              const content = getLocalizedHtml(intro, 'contentHtml', locale);
              return content ? (
                <div
                  className='prose-brand prose-invert prose-sm md:prose-base max-w-none text-white/80 leading-relaxed font-light'
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : null;
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};
