export const dynamic = 'force-dynamic';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { format } from 'date-fns';
import { Calendar, User, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Thien An Furniture',
  description: 'Design inspirations, furniture care tips, and stories from Thien An Furniture.',
};

export default async function BlogListingPage() {
  const posts = await db.query.posts.findMany({
    where: (posts, { eq }) => eq(posts.isActive, true),
    orderBy: (posts, { desc }) => [desc(posts.updatedAt)],
    with: {
      featuredImage: true,
    },
  });

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Header */}
      <div className='bg-gray-50 py-20 border-b border-gray-100'>
        <div className='container mx-auto px-4'>
          <h1 className='text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6'>Our Blog</h1>
          <p className='text-xl text-gray-600 font-light max-w-2xl leading-relaxed'>
            Discover stories of craftsmanship, design trends, and tips for creating your perfect
            living space.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className='container mx-auto px-4 py-20'>
        {posts.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-gray-500 text-lg'>No blog posts found. Check back soon!</p>
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
                      No Image
                    </div>
                  )}
                  <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                </Link>

                <div className='flex items-center gap-4 text-xs font-medium text-gray-400 uppercase tracking-widest mb-4'>
                  <span className='flex items-center gap-1.5'>
                    <Calendar className='h-3.5 w-3.5' />
                    {format(new Date(post.updatedAt), 'MMMM d, yyyy')}
                  </span>
                  <span className='w-1 h-1 rounded-full bg-gray-300' />
                  <span className='flex items-center gap-1.5'>
                    <User className='h-3.5 w-3.5' />
                    Admin
                  </span>
                </div>

                <Link href={`/blogs/${post.slug}`}>
                  <h2 className='text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-[#7B0C0C] transition-colors line-clamp-2'>
                    {post.title}
                  </h2>
                </Link>

                <p className='text-gray-600 font-light text-sm leading-relaxed mb-6 line-clamp-3'>
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
        )}
      </div>
    </div>
  );
}
