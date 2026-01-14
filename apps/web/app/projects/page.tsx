import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Thien An Furniture',
  description: 'Explore our portfolio of completed interior design and furniture projects.',
};

export default async function ProjectsListingPage() {
  const projects = await db.query.projects.findMany({
    where: (projects, { eq }) => eq(projects.isActive, true),
    orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
    with: {
      image: true,
      gallery: {
        with: {
          asset: true,
        },
        orderBy: (gallery, { asc }) => [asc(gallery.position)],
      },
    },
  });

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Header */}
      <div className='bg-black text-white py-24'>
        <div className='container mx-auto px-4'>
          <span className='block text-[#7B0C0C] font-serif italic text-xl mb-4'>Our Portfolio</span>
          <h1 className='text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight'>
            Capturing Timeless
            <br />
            Elegance in Every Project
          </h1>
          <p className='text-xl text-gray-400 font-light max-w-2xl leading-relaxed'>
            Discover our collection of meticulously crafted interior design projects that blend
            artistry with functionality.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className='container mx-auto px-4 py-20'>
        {projects.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-gray-500 text-lg'>No projects found. Check back soon!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            {projects.map((project, index) => {
              const primaryImage = project.gallery.find((g) => g.isPrimary)?.asset || project.image;

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className={`group relative block ${index % 2 === 1 ? 'md:mt-24' : ''}`}
                >
                  <div className='relative aspect-[4/5] overflow-hidden rounded-sm mb-6'>
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={project.title}
                        fill
                        className='object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105'
                        sizes='(max-width: 768px) 100vw, 50vw'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400'>
                        No Image
                      </div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                    <div className='absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700'>
                      <p className='text-sm font-serif italic text-white/80 mb-2'>
                        Project Showcase
                      </p>
                      <h3 className='text-3xl font-serif font-bold text-white'>{project.title}</h3>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-xl md:text-2xl font-serif font-medium text-gray-900 group-hover:text-[#7B0C0C] transition-colors'>
                      {project.title}
                    </h3>
                    <div className='h-px flex-grow mx-6 bg-gray-200 group-hover:bg-gray-400 transition-colors' />
                    <span className='flex items-center text-sm font-light text-gray-500 group-hover:text-[#7B0C0C] transition-colors'>
                      Explore
                      <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
