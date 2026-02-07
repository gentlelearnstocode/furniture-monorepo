import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { format } from 'date-fns';
import { ArrowRight, Calendar } from 'lucide-react';
import { BrandDivider } from './brand-divider';

import { createCachedQuery } from '@/lib/cache';
import { getLocale, getLocalizedText } from '@/lib/i18n';
import { getTranslations } from 'next-intl/server';

export const BlogsSection = async () => {
  const getLatestPosts = createCachedQuery(
    async () =>
      await db.query.posts.findMany({
        where: (posts, { eq }) => eq(posts.isActive, true),
        orderBy: (posts, { desc }) => [desc(posts.updatedAt)],
        limit: 3,
        with: {
          featuredImage: true,
        },
      }),
    ['blogs-section-home'],
    { revalidate: 1800, tags: ['posts'] },
  );

  const posts = await getLatestPosts();
  const locale = await getLocale();
  const t = await getTranslations('Blogs');
  const tc = await getTranslations('Common');

  if (posts.length === 0) return null;

  return (
    <section className='py-10 bg-white'>
      <div className='container'>
        {/* Section Header */}
        <div className='flex flex-col items-center mb-8'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-serif text-[#49000D] tracking-wide uppercase'>
            {t('title')}
          </h2>
          <BrandDivider />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {posts.map((post) => (
            <article key={post.id} className='group flex flex-col h-full'>
              <Link
                href={`/blogs/${post.slug}`}
                className='block relative aspect-[16/10] overflow-hidden rounded-sm mb-6'
              >
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage.url}
                    alt={getLocalizedText(post, 'title', locale)}
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

              <div className='flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-widest mb-4'>
                <Calendar className='h-3.5 w-3.5' />
                {format(new Date(post.updatedAt), tc('dateFormat'))}
              </div>

              <Link href={`/blogs/${post.slug}`}>
                <h3 className='text-xl font-serif font-bold text-gray-900 mb-4 group-hover:text-[#7B0C0C] transition-colors line-clamp-2'>
                  {getLocalizedText(post, 'title', locale)}
                </h3>
              </Link>

              <p className='text-gray-600 font-light text-sm leading-relaxed mb-6 line-clamp-3 flex-grow'>
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

        {/* Expand Your View Link */}
        <div className='flex justify-center mt-6'>
          <Link
            href='/blogs'
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
