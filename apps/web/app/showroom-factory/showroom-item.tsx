'use client';

import Image from 'next/image';

interface ShowroomItemProps {
  showroom: {
    id: string;
    title: string;
    subtitle?: string | null;
    contentHtml?: string | null;
    image?: string | { url: string } | null;
  };
  index: number;
}

export function ShowroomItem({ showroom, index }: ShowroomItemProps) {
  const imageUrl = typeof showroom.image === 'string' ? showroom.image : showroom.image?.url;

  return (
    <div className='group space-y-12'>
      {/* 1. Large Image */}
      <div className='relative w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-sm shadow-sm'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={showroom.title}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-105'
          />
        ) : (
          <div className='w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-300'>
            No Image
          </div>
        )}
      </div>

      <div className='grid md:grid-cols-12 gap-10 md:gap-20 items-start'>
        <div className='md:col-span-12 lg:col-span-5 space-y-6'>
          <div className='space-y-2'>
            <h3 className='text-2xl md:text-xl text-neutral-400 uppercase tracking-wide'>
              {showroom.title}
            </h3>
            {showroom.subtitle && (
              <p className='text-lg md:text-xl text-neutral-300 uppercase tracking-widest'>
                {showroom.subtitle}
              </p>
            )}
          </div>

          <div className='text-2xl md:text-6xl lg:text-4xl leading-none pt-1'>
            <span className='text-[#b80022] block font-bold tracking-tight'>THIÊN ẤN</span>
            <span className='text-[#222] block font-bold tracking-tight'>SHOWROOM</span>
          </div>
        </div>

        {/* Right Column: Description */}
        <div className='md:col-span-12 lg:col-span-7 pt-2'>
          {showroom.contentHtml && (
            <div
              className='prose prose-lg prose-neutral text-neutral-600 leading-relaxed max-w-none text-justify'
              dangerouslySetInnerHTML={{ __html: showroom.contentHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
