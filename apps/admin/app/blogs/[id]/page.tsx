import { getPost } from '@/lib/actions/blog';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types';
import { BlogForm } from '../components/blog-form';
import { PageHeader } from '@/components/layout/page-header';

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
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Blogs', href: '/blogs' },
          { label: 'Edit' },
        ]}
        title='Edit Blog Post'
        description='Update article details.'
      />
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
