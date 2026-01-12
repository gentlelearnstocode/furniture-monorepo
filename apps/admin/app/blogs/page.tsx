import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { posts } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { ListingControls } from '@/components/ui/listing-controls';
import { BlogList } from './components/blog-list';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

interface BlogsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const status = resolvedSearchParams.status;

  const filters = [];
  if (status && status !== 'all') {
    filters.push(eq(posts.isActive, status === 'active'));
  }

  const { data: allPosts, meta } = await getListingData(posts, {
    page,
    limit: 10,
    search,
    searchColumns: [posts.title, posts.slug],
    filters,
    orderBy: (t: any, { desc }: any) => [desc(t.updatedAt)],
    with: {
      featuredImage: true,
    },
  });

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <nav className='flex items-center text-sm text-gray-500 mb-1'>
            <Link href='/' className='hover:text-gray-900 transition-colors'>
              Dashboard
            </Link>
            <span className='mx-2'>/</span>
            <span className='font-medium text-gray-900'>Blogs</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Blogs</h1>
          <p className='text-base text-gray-500 mt-1'>Manage your blog posts and articles.</p>
        </div>
        <div className='flex gap-3'>
          <Link href='/blogs/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Blog Post
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <Card className='p-4 flex flex-col justify-between'>
          <span className='text-sm font-medium text-gray-500'>Total Posts</span>
          <span className='text-2xl font-bold'>{meta.totalItems}</span>
        </Card>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <CardTitle>Blog List</CardTitle>
              <CardDescription>View and manage your blog posts.</CardDescription>
            </div>
            <div className='flex flex-col sm:flex-row gap-2'>
              <ListingControls
                placeholder='Search blogs...'
                filterKey='status'
                filterOptions={statusOptions}
                filterPlaceholder='Filter by Status'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BlogList posts={allPosts} meta={meta} />
        </CardContent>
      </Card>
    </div>
  );
}
