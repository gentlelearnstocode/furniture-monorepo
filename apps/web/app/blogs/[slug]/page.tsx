import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, User, ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.slug, slug),
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.seoTitle || `${post.title} | Thien An Furniture Blog`,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.slug, slug),
    with: {
      featuredImage: true,
    },
  });

  if (!post || !post.isActive) {
    notFound();
  }

  return (
    <article className='min-h-screen bg-white pb-24'>
      {/* Back Link */}
      <div className='container mx-auto px-4 pt-12 pb-8'>
        <Link
          href='/blogs'
          className='inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group'
        >
          <ChevronLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
          Back to all stories
        </Link>
      </div>

      {/* Header */}
      <div className='container mx-auto px-4 mb-12'>
        <div className='max-w-4xl'>
          <h1 className='text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight'>
            {post.title}
          </h1>
          <div className='flex items-center gap-6 text-sm font-medium text-gray-400 uppercase tracking-widest'>
            <span className='flex items-center gap-2 text-gray-600'>
              <Calendar className='h-4 w-4' />
              {format(new Date(post.updatedAt), 'MMMM d, yyyy')}
            </span>
            <span className='w-1 h-1 rounded-full bg-gray-300' />
            <span className='flex items-center gap-2'>
              <User className='h-4 w-4' />
              Admin
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
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto'>
          <div
            className='prose prose-lg prose-gray max-w-none font-light leading-relaxed
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900
              prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-[#7B0C0C] hover:prose-a:underline'
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
      </div>
    </article>
  );
}
