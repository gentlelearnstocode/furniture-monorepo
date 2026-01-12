import { getPost } from '@/lib/actions/blog';
import { notFound } from 'next/navigation';
import { BlogForm } from '../components/blog-form';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';
import { PageProps } from '@/types';

export const dynamic = 'force-dynamic';

export default async function EditBlogPage({ params }: PageProps<{ id: string }>) {
  const { id } = await params;

  if (id === 'new') {
    return notFound();
  }

  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/blogs'>
          <Button variant='outline' size='icon'>
            <MoveLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Edit Blog Post</h1>
          <p className='text-sm text-gray-500'>Update article details.</p>
        </div>
      </div>
      <div className='max-w-6xl'>
        <BlogForm
          initialData={{
            ...post,
            featuredImageUrl: post.featuredImage?.url,
          }}
        />
      </div>
    </div>
  );
}
