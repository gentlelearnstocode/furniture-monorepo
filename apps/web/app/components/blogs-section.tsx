import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { format } from 'date-fns';
import { ArrowRight, Calendar } from 'lucide-react';

export const BlogsSection = async () => {
  const posts = await db.query.posts.findMany({
    where: (posts, { eq }) => eq(posts.isActive, true),
    orderBy: (posts, { desc }) => [desc(posts.updatedAt)],
    limit: 3,
    with: {
      featuredImage: true,
    },
  });

  if (posts.length === 0) return null;

  return (
    <section className='py-24 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8'>
          <div className='max-w-2xl'>
            <span className='block text-[#7B0C0C] font-serif italic text-xl mb-4'>Our Journal</span>
            <h2 className='text-4xl md:text-6xl font-serif font-bold leading-tight text-gray-900'>
              Stories & Insights <br /> from Our Studio
            </h2>
          </div>
          <Link
            href='/blogs'
            className='flex items-center text-sm font-semibold tracking-wider uppercase border-b border-gray-900/20 pb-2 hover:border-gray-900 transition-colors text-gray-900'
          >
            View All Articles
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </div>

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
                    No Image
                  </div>
                )}
                <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </Link>

              <div className='flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-widest mb-4'>
                <Calendar className='h-3.5 w-3.5' />
                {format(new Date(post.updatedAt), 'MMMM d, yyyy')}
              </div>

              <Link href={`/blogs/${post.slug}`}>
                <h3 className='text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-[#7B0C0C] transition-colors line-clamp-2'>
                  {post.title}
                </h3>
              </Link>

              <p className='text-gray-600 font-light text-sm leading-relaxed mb-6 line-clamp-3 flex-grow'>
                {post.excerpt || 'Read our latest insights on furniture design and home decor.'}
              </p>

              <div className='mt-auto'>
                <Link
                  href={`/blogs/${post.slug}`}
                  className='inline-flex items-center text-sm font-semibold text-[#7B0C0C] group/link'
                >
                  Read Story
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1' />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
