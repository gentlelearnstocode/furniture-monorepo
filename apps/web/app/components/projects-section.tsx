import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { ArrowRight } from 'lucide-react';
import { ProjectSlider } from './project-slider';
import { getLocale } from '@/lib/i18n';
import { createCachedQuery } from '@/lib/cache';

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
  const locale = await getLocale();

  if (allProjects.length === 0) return null;

  return (
    <section
      className='py-24 overflow-hidden relative'
      style={{
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(/nav-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='flex flex-col items-center mb-12'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-serif text-[#49000D] tracking-wide uppercase'>
            {locale === 'vi' ? 'Dự Án Của Chúng Tôi' : 'Our Projects'}
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

        <ProjectSlider projects={allProjects} />

        {/* Expand Your View Link */}
        <div className='flex justify-center mt-12 md:mt-20'>
          <Link
            href='/projects'
            className='group flex items-center gap-2 text-[13px] font-medium tracking-wider text-gray-700 hover:text-[#49000D] transition-colors'
          >
            <span>{locale === 'vi' ? 'Xem Thêm Dự Án' : 'Expand Your View'}</span>
            <div className='w-5 h-5 rounded-full border border-current flex items-center justify-center transition-transform group-hover:translate-x-1'>
              <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
