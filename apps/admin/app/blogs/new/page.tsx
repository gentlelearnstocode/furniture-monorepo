'use client';

import { BlogForm } from '../components/blog-form';
import { PageHeader } from '@/components/layout/page-header';

export default function NewBlogPage() {
  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Blogs', href: '/blogs' },
          { label: 'Create' },
        ]}
        title='New Blog Post'
        description='Write a new article for your blog.'
      />
      <div className='max-w-6xl'>
        <BlogForm />
      </div>
    </div>
  );
}
