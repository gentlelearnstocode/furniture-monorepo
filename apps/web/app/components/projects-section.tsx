import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { ArrowRight } from 'lucide-react';

import { createCachedQuery } from '@/lib/cache';

export const ProjectsSection = async () => {
  const getProjects = createCachedQuery(
    async () =>
      await db.query.projects.findMany({
        where: (projects, { eq }) => eq(projects.isActive, true),
        orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
        limit: 4,
        with: {
          image: true,
        },
      }),
    ['projects-section-home'],
    { revalidate: 3600, tags: ['projects'] }
  );

  const allProjects = await getProjects();

  if (allProjects.length === 0) return null;

  return (
    <section className='py-24 bg-gray-50'>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='flex flex-col items-center mb-12'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-serif text-[#49000D] tracking-wide uppercase'>
            Our Projects
          </h2>

          {/* Decorative divider with symbol */}
          <div className='flex items-center gap-3 mt-4'>
            <div className='w-16 h-[2px] bg-[#8B0000]' />
            <Image
              src='/symbol.svg'
              alt='decorative symbol'
              width={24}
              height={24}
              className='opacity-80'
            />
            <div className='w-16 h-[2px] bg-[#8B0000]' />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {allProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className='group bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1'
            >
              <div className='relative aspect-[4/5] overflow-hidden'>
                {project.image ? (
                  <Image
                    src={project.image.url}
                    alt={project.title}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                  />
                ) : (
                  <div className='absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400'>
                    No Image
                  </div>
                )}
                <div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </div>

              <div className='p-6'>
                <h3 className='text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-[#7B0C0C] transition-colors line-clamp-2'>
                  {project.title}
                </h3>
                <span className='inline-flex items-center text-sm font-semibold text-[#7B0C0C]'>
                  View Project
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Expand Your View Link */}
        <div className='flex justify-center mt-10'>
          <Link
            href='/projects'
            className='group flex items-center gap-2 text-[13px] font-medium tracking-wider text-gray-700 hover:text-[#49000D] transition-colors'
          >
            <span>Expand Your View</span>
            <div className='w-5 h-5 rounded-full border border-current flex items-center justify-center transition-transform group-hover:translate-x-1'>
              <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
