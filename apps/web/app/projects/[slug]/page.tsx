import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { ContactButton } from '@/components/ui/contact-button';
import type { Metadata } from 'next';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { createCachedQuery } from '@/lib/cache';
import styles from '@/app/components/article-content.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

// Revalidate every hour
export const revalidate = 3600;

// Generate static params for all projects at build time
export async function generateStaticParams() {
  const projects = await db.query.projects.findMany({
    where: (projects, { eq }) => eq(projects.isActive, true),
    columns: { slug: true },
  });

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

const getProjectBySlug = (slug: string) =>
  createCachedQuery(
    async () => {
      return await db.query.projects.findFirst({
        where: (projects, { eq }) => eq(projects.slug, slug),
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
    ['project-detail', slug],
    { revalidate: 3600, tags: ['projects', `project-${slug}`] },
  );

import { getLocale, getLocalizedText, getLocalizedHtml } from '@/lib/i18n';
import { getSiteContacts } from '@/lib/queries';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const project = await db.query.projects.findFirst({
    where: (projects, { eq }) => eq(projects.slug, slug),
  });

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = getLocalizedText(project, 'title', locale);
  const seoTitle = getLocalizedText(project, 'seoTitle', locale);
  const seoDescription = getLocalizedText(project, 'seoDescription', locale);

  const t = await getTranslations('Projects');

  return {
    title: seoTitle || `${title} | Thien An Furniture Projects`,
    description: seoDescription || t('exploreProject', { title }),
    keywords: getLocalizedText(project, 'seoKeywords', locale),
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const project = await getProjectBySlug(slug)();
  const contacts = await getSiteContacts();
  const t = await getTranslations('Projects');
  const tb = await getTranslations('Breadcrumbs');

  if (!project || !project.isActive) {
    notFound();
  }

  const primaryImage =
    project.gallery.find((g) => g.isPrimary)?.asset || project.gallery[0]?.asset || project.image;
  const galleryImages = project.gallery.map((g) => g.asset).filter(Boolean);

  const title = getLocalizedText(project, 'title', locale);
  const contentHtml = getLocalizedHtml(project, 'contentHtml', locale);

  return (
    <article className='min-h-screen bg-white pb-24'>
      {/* Back Link */}
      <div className='container mx-auto px-4 pt-6 pb-6'>
        <Link
          href='/projects'
          className='inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group'
        >
          <ChevronLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
          {t('backToList')}
        </Link>
      </div>

      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          { label: tb('projects'), href: '/projects' },
          { label: title },
        ]}
      />

      {/* Header */}
      <div className='container mx-auto px-4 mb-12'>
        <div className='max-w-4xl'>
          <span className='block text-[#7B0C0C] font-serif italic text-lg mb-4'>
            {t('showcase')}
          </span>
          <h1 className='text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight'>
            {title}
          </h1>
        </div>
      </div>

      {/* Featured Image */}
      {primaryImage && (
        <div className='container mx-auto px-4 mb-16'>
          <div className='relative aspect-[21/9] w-full overflow-hidden rounded-sm shadow-lg bg-gray-100'>
            <Image
              src={primaryImage.url}
              alt={project.title}
              fill
              className='object-cover'
              priority
              sizes='100vw'
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className='container mx-auto px-4 mb-20'>
        <div className='max-w-3xl mx-auto'>
          {contentHtml && (
            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}

          <div className='mt-12 flex justify-center'>
            <ContactButton
              contacts={contacts}
              label={t('contactLabel')}
              className='w-full max-w-sm'
            />
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {galleryImages.length > 1 && (
        <div className='container mx-auto px-4'>
          <div className='mb-12'>
            <h2 className='text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4'>
              {t('gallery')}
            </h2>
            <div className='h-px bg-gradient-to-r from-[#7B0C0C]/30 to-transparent w-32' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {galleryImages.map((image, index) => (
              <div
                key={image?.id || index}
                className='relative aspect-[4/3] overflow-hidden rounded-sm group'
              >
                {image && (
                  <Image
                    src={image.url}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                )}
                <div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
