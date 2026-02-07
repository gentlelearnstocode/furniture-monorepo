import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { createCachedQuery } from '@/lib/cache';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';

import { getLocale, getLocalizedText } from '@/lib/i18n';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Projects');
  return {
    title: `${t('pageTitle')} | Thien An Furniture`,
    description: t('pageDescription'),
  };
}

// Revalidate every hour
export const revalidate = 3600;

const getProjects = createCachedQuery(
  async () => {
    return await db.query.projects.findMany({
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
  },
  ['projects-list'],
  { revalidate: 3600, tags: ['projects'] },
);

export default async function ProjectsListingPage() {
  const projects = await getProjects();
  const locale = await getLocale();
  const t = await getTranslations('Projects');
  const tb = await getTranslations('Breadcrumbs');
  const tc = await getTranslations('Common');
  const tt = await getTranslations('Toolbar');

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          { label: tb('projects'), href: '/projects' },
        ]}
      />
      <div className='container pt-10 pb-12'>
        {/* Title & Description */}
        <div className='mb-8'>
          <h1 className='text-3xl md:text-5xl font-serif text-black/90 tracking-wide mb-4'>
            {t('pageTitle')}
          </h1>
          <p className='text-[15px] leading-relaxed text-gray-600 max-w-4xl font-serif'>
            {t('pageDescription')}
          </p>
        </div>

        {/* Filter Bar */}
        <div className='flex items-center justify-between mb-8 pb-4 border-b border-black/5'>
          <div className='text-[13px] font-serif italic text-black/50 uppercase tracking-[0.1em]'>
            {tt('showingResults', { count: projects.length })}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className='container pb-16'>
        {projects.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-xl font-serif italic text-gray-400'>{t('noResults')}</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projects.map((project) => {
              const primaryImage = project.gallery.find((g) => g.isPrimary)?.asset || project.image;

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className='group bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1'
                >
                  <div className='relative aspect-[4/3] overflow-hidden'>
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={project.title}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-105'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400'>
                        {tc('noImage')}
                      </div>
                    )}
                    <div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  </div>

                  <div className='p-6'>
                    <h3 className='text-xl md:text-2xl font-serif font-semibold text-[#222222] mb-3 group-hover:text-[#7B0C0C] transition-colors line-clamp-2'>
                      {getLocalizedText(project, 'title', locale)}
                    </h3>
                    <span className='inline-flex items-center text-sm font-semibold text-[#7B0C0C]'>
                      {t('viewProject')}
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
