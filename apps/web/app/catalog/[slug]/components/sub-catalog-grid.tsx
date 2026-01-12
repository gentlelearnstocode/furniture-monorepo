'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SubCatalog {
  id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  } | null;
}

interface SubCatalogGridProps {
  subCatalogs: SubCatalog[];
}

export const SubCatalogGrid = ({ subCatalogs }: SubCatalogGridProps) => {
  if (!subCatalogs || subCatalogs.length === 0) return null;

  return (
    <div className='bg-gradient-to-b from-white to-[#FDFCFB] py-12'>
      <div className='container mx-auto px-4 pb-12'>
        {/* Decorative section header */}
        <div className='relative mb-10'>
          <div className='flex items-center justify-center gap-6 mb-3'>
            <div className='h-px w-12 bg-gradient-to-r from-transparent to-black/20' />
            <h2 className='text-4xl md:text-5xl font-serif italic text-center text-black/85 tracking-wide'>
              What are you looking for?
            </h2>
            <div className='h-px w-12 bg-gradient-to-l from-transparent to-black/20' />
          </div>
          <p className='text-center text-xs font-serif italic text-gray-400 tracking-widest uppercase'>
            Explore Categories
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
          {subCatalogs.map((sub) => (
            <Link
              key={sub.id}
              href={`/catalog/${sub.slug}`}
              className='group flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1'
            >
              <div className='relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-md shadow-black/5 group-hover:shadow-xl group-hover:shadow-black/10 transition-all duration-500'>
                <Image
                  src={
                    sub.image?.url ||
                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={sub.name}
                  fill
                  className='object-cover transition-all duration-700 group-hover:scale-110'
                  sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw'
                />

                {/* Subtle overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </div>

              <span className='text-[15px] font-serif text-center text-black/80 group-hover:text-black transition-colors duration-300 tracking-wide'>
                {sub.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
