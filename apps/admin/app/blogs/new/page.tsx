'use client';

import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';
import { BlogForm } from '../components/blog-form';

export default function NewBlogPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/blogs'>
          <Button variant='outline' size='icon'>
            <MoveLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>New Blog Post</h1>
          <p className='text-sm text-gray-500'>Write a new article for your blog.</p>
        </div>
      </div>
      <div className='max-w-6xl'>
        <BlogForm />
      </div>
    </div>
  );
}
