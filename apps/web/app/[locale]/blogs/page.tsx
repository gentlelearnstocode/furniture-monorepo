import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { db } from '@repo/database';
import { format } from 'date-fns';
import { Calendar, User, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { createCachedQuery } from '@/lib/cache';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { getLocalizedText } from '@/lib/i18n';
import { setRequestLocale, getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Blogs' });
  return {
    title: `${t('pageTitle')} | Thien An Furniture`,
    description: t('pageDescription'),
  };
}

// Revalidate every 30 minutes (blogs update more frequently)
export const revalidate = 1800;

const getPosts = createCachedQuery(
  async () => {
    return await db.query.posts.findMany({
      where: (posts, { eq }) => eq(posts.isActive, true),
      orderBy: (posts, { desc }) => [desc(posts.updatedAt)],
      with: {
        featuredImage: true,
      },
    });
  },
  ['posts-list'],
  { revalidate: 1800, tags: ['posts'] },
);

export default async function BlogListingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getPosts();
  const t = await getTranslations('Blogs');
  const tb = await getTranslations('Breadcrumbs');
  const tc = await getTranslations('Common');
  const tt = await getTranslations('Toolbar');

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          { label: tb('blogs'), href: '/blogs' },
        ]}
      />
      <div className='container pt-10 pb-12'>
        {/* Title & Description */}
        <div className='mb-8'>
          <h1 className='text-2xl md:text-3xl font-serif text-black/90 tracking-wide mb-4'>
            {t('pageTitle')}
          </h1>
          <p className='text-[15px] leading-relaxed text-gray-600 max-w-4xl font-serif'>
            {t('pageDescription')}
          </p>
        </div>

        {/* Filter Bar */}
        <div className='flex items-center justify-between mb-8 pb-4 border-b border-black/5'>
          <div className='text-[13px] font-serif italic text-black/50 uppercase tracking-[0.1em]'>
            {tt('showingResults', { count: posts.length })}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className='container pb-16'>
        {posts.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-gray-500 text-lg'>{t('noResults')}</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
            {posts.map((post) => (
              <article key={post.id} className='group flex flex-col h-full'>
                <Link
                  href={`/blogs/${post.slug}`}
                  className='block relative aspect-[16/10] overflow-hidden rounded-sm mb-6'
                >
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage.url}
                      alt={post.title}
                      fill
                      className='object-cover transition-transform duration-700 group-hover:scale-105'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  ) : (
                    <div className='absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400'>
                      {tc('noImage')}
                    </div>
                  )}
                  <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                </Link>

                <div className='flex items-center gap-4 text-xs font-medium text-gray-400 uppercase tracking-widest mb-4'>
                  <span className='flex items-center gap-1.5'>
                    <Calendar className='h-3.5 w-3.5' />
                    {format(new Date(post.updatedAt), tc('dateFormat'))}
                  </span>
                  <span className='w-1 h-1 rounded-full bg-gray-300' />
                  <span className='flex items-center gap-1.5'>
                    <User className='h-3.5 w-3.5' />
                    {t('admin')}
                  </span>
                </div>

                <Link href={`/blogs/${post.slug}`}>
                  <h2 className='text-lg md:text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-[#7B0C0C] transition-colors line-clamp-2'>
                    {getLocalizedText(post, 'title', locale)}
                  </h2>
                </Link>

                <p className='text-gray-600 font-light text-sm leading-relaxed mb-6 line-clamp-3'>
                  {getLocalizedText(post, 'excerpt', locale) || t('fallbackExcerpt')}
                </p>

                <div className='mt-auto'>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className='inline-flex items-center text-sm font-semibold text-[#7B0C0C] group/link'
                  >
                    {t('readStory')}
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1' />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
