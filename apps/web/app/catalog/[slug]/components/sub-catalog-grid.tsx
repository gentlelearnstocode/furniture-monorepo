'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocalizedText } from '@/providers/language-provider';
import { useTranslations } from 'next-intl';

interface SubCatalog {
  id: string;
  name: string;
  nameVi: string | null;
  slug: string;
  image?: {
    url: string;
  } | null;
}

interface SubCatalogGridProps {
  subCatalogs: SubCatalog[];
  parentSlug: string;
}

export const SubCatalogGrid = ({ subCatalogs, parentSlug }: SubCatalogGridProps) => {
  const tl = useLocalizedText();
  const tc = useTranslations('Catalog');

  if (!subCatalogs || subCatalogs.length === 0) return null;

  return (
    <div className='bg-gradient-to-b from-white to-[#FDFCFB] py-12'>
      <div className='container mx-auto px-4 pb-12'>
        {/* Shadow line border between sections */}
        <div className='w-full h-px shadow-[0_2px_4px_rgba(34,34,34,0.12),0_6px_6px_rgba(34,34,34,0.10),0_14px_9px_rgba(34,34,34,0.06),0_26px_10px_rgba(34,34,34,0.02)] border-b border-black/[0.03] mb-16' />

        {/* Decorative section header */}
        <div className='relative mb-10'>
          <div className='flex items-center justify-center gap-6 mb-3'>
            <div className='h-px w-12 bg-gradient-to-r from-transparent to-black/20' />
            <h2 className='text-2xl md:text-[24px] font-serif text-center text-black/85 tracking-wide'>
              {tc('whatAreYouLookingFor')}
            </h2>
            <div className='h-px w-12 bg-gradient-to-l from-transparent to-black/20' />
          </div>
          <p className='text-center text-xs font-serif text-gray-400 tracking-widest uppercase'>
            {tc('exploreCategories')}
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
          {subCatalogs.map((sub) => (
            <Link
              key={sub.id}
              href={`/catalog/${parentSlug}/${sub.slug}`}
              className='group flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1'
            >
              <div className='relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-md shadow-black/5 group-hover:shadow-xl group-hover:shadow-black/10 transition-all duration-500'>
                <Image
                  src={
                    sub.image?.url ||
                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={tl(sub, 'name')}
                  fill
                  className='object-cover transition-all duration-700 group-hover:scale-110'
                  sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw'
                />

                {/* Subtle overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </div>

              <span className='text-[15px] font-serif font-bold text-left text-black/80 group-hover:text-black transition-colors duration-300 tracking-wide'>
                {tl(sub, 'name')}
              </span>
            </Link>
          ))}
        </div>
        {/* Red separator with UI/05 color */}
        <div className='mt-12 h-0.5 w-full bg-[#B80022]' />
      </div>
    </div>
  );
};
