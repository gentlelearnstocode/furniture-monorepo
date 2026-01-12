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
    <div className='container mx-auto px-4 pb-32'>
      <h2 className='text-3xl font-serif text-center mb-12 text-black'>
        What are you looking for?
      </h2>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        {subCatalogs.map((sub) => (
          <Link key={sub.id} href={`/catalog/${sub.slug}`} className='group flex flex-col gap-3'>
            <div className='relative aspect-[3/4] overflow-hidden bg-gray-100'>
              <Image
                src={
                  sub.image?.url ||
                  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'
                }
                alt={sub.name}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-105'
                sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw'
              />
            </div>
            <span className='text-[15px] font-medium text-black/90'>{sub.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
