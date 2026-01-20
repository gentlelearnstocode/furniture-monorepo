import React from 'react';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, User, ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { createCachedQuery } from '@/lib/cache';
import styles from '@/app/components/article-content.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

// Revalidate every 30 minutes (blogs update more frequently)
export const revalidate = 1800;

// Generate static params for all posts at build time
export async function generateStaticParams() {
  const posts = await db.query.posts.findMany({
    where: (posts, { eq }) => eq(posts.isActive, true),
    columns: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const getPostBySlug = (slug: string) =>
  createCachedQuery(
    async () => {
      return await db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.slug, slug),
        with: {
          featuredImage: true,
          gallery: {
            with: {
              asset: true,
            },
            orderBy: (gallery, { asc }) => [asc(gallery.position)],
          },
        },
      });
    },
    ['post-detail', slug],
    { revalidate: 1800, tags: ['posts', `post-${slug}`] },
  );

import { getLocale, getLocalizedText, getLocalizedHtml } from '@/lib/i18n';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await db.query.posts.findFirst({
    where: (posts, { eq, and }) => and(eq(posts.isActive, true), eq(posts.slug, slug)),
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = getLocalizedText(post, 'title', locale);
  const seoTitle = getLocalizedText(post, 'seoTitle', locale);
  const seoDescription = getLocalizedText(post, 'seoDescription', locale);
  const excerpt = getLocalizedText(post, 'excerpt', locale);

  return {
    title: seoTitle || `${title} | Thien An Furniture Blog`,
    description: seoDescription || excerpt,
    keywords: getLocalizedText(post, 'seoKeywords', locale),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPostBySlug(slug)();
  const t = await getTranslations('Blogs');
  const tb = await getTranslations('Breadcrumbs');

  if (!post || !post.isActive) {
    notFound();
  }

  const galleryImages = post.gallery.map((g) => g.asset).filter(Boolean);
  const title = getLocalizedText(post, 'title', locale);
  const contentHtml = getLocalizedHtml(post, 'contentHtml', locale);

  return (
    <article className='min-h-screen bg-white pb-24'>
      {/* Back Link */}
      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          { label: tb('blogs'), href: '/blogs' },
          { label: title },
        ]}
      />
      <div className='container mx-auto px-4 pt-6 pb-6'>
        <Link
          href='/blogs'
          className='inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group'
        >
          <ChevronLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
          {t('backToList')}
        </Link>
      </div>

      {/* Header */}
      <div className='container mx-auto px-4 mb-12'>
        <div className='max-w-4xl'>
          <h1 className='text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight'>
            {title}
          </h1>
          <div className='flex items-center gap-6 text-sm font-medium text-gray-400 uppercase tracking-widest'>
            <span className='flex items-center gap-2 text-gray-600'>
              <Calendar className='h-4 w-4' />
              {format(new Date(post.updatedAt), locale === 'vi' ? 'dd/MM/yyyy' : 'MMMM d, yyyy')}
            </span>
            <span className='w-1 h-1 rounded-full bg-gray-300' />
            <span className='flex items-center gap-2'>
              <User className='h-4 w-4' />
              {t('admin')}
            </span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className='container mx-auto px-4 mb-16'>
          <div className='relative aspect-[21/9] w-full overflow-hidden rounded-sm shadow-lg bg-gray-100'>
            <Image
              src={post.featuredImage.url}
              alt={post.title}
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
                    alt={`${post.title} - Image ${index + 1}`}
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
