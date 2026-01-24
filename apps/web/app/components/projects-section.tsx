import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { ArrowRight } from 'lucide-react';
import { ProjectSlider } from './project-slider';
import { createCachedQuery } from '@/lib/cache';
import { getTranslations } from 'next-intl/server';

export const ProjectsSection = async () => {
  const getProjects = createCachedQuery(
    async () =>
      await db.query.projects.findMany({
        where: (projects, { eq }) => eq(projects.isActive, true),
        orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
        limit: 3,
        with: {
          image: true,
        },
      }),
    ['projects-section-home'],
    { revalidate: 3600, tags: ['projects'] },
  );

  const allProjects = await getProjects();
  const t = await getTranslations('Projects');

  if (allProjects.length === 0) return null;

  return (
    <section
      id='projects'
      className='relative bg-white py-16 md:py-24 border-t border-gray-100 overflow-hidden'
    >
      <div className='container'>
        {/* Section Header */}
        <div className='flex flex-col items-center mb-12'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-serif text-[#49000D] tracking-wide uppercase'>
            {t('title')}
          </h2>

          {/* Decorative divider with symbol */}
          <div className='flex items-center gap-3 mt-4'>
            <div className='w-12 h-[1px] bg-[#8B0000]/30' />
            <Image
              src='/symbol.svg'
              alt='decorative symbol'
              width={20}
              height={20}
              className='opacity-60'
            />
            <div className='w-12 h-[1px] bg-[#8B0000]/30' />
          </div>
        </div>

        {/* Project Content */}
        <ProjectSlider projects={allProjects} />

        {/* Expand Your View Link */}
        <div className='flex justify-center mt-10'>
          <Link
            href='/projects'
            className='group flex items-center gap-2 text-[13px] font-medium tracking-wider text-gray-700 hover:text-[#49000D] transition-colors'
          >
            <span>{t('expandYourView')}</span>
            <div className='w-5 h-5 rounded-full border border-current flex items-center justify-center transition-transform group-hover:translate-x-1'>
              <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
