import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { posts } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { BlogList } from './components/blog-list';
import { eq } from 'drizzle-orm';
import { PageHeader } from '@/components/layout/page-header';
import { StatsCard } from '@/components/listing/stats-card';
import { ListingCard } from '@/components/listing/listing-card';
import { parseListingParams } from '@/lib/listing-params';
import { STATUS_FILTER_OPTIONS } from '@/constants';
import { type BlogPost } from '@repo/shared';

export const dynamic = 'force-dynamic';

interface BlogsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { page, search, status } = await parseListingParams(searchParams, {
    filterKeys: ['status'],
  });

  const filters = [];
  if (status && status !== 'all') {
    filters.push(eq(posts.isActive, status === 'active'));
  }

  const { data: allPosts, meta } = await getListingData<BlogPost>(posts, {
    page,
    limit: 10,
    search,
    searchColumns: [posts.title, posts.slug],
    filters,
    orderBy: (t, { desc }) => [desc(t.updatedAt)],
    with: {
      featuredImage: true,
      createdBy: true,
    },
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Blogs' }]}
        title='Blogs'
        description='Manage your blog posts and articles.'
        actions={
          <Link href='/blogs/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Blog Post
            </Button>
          </Link>
        }
      />

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <StatsCard label='Total Posts' value={meta.totalItems} />
      </div>

      <ListingCard
        title='Blog List'
        description='View and manage your blog posts.'
        searchPlaceholder='Search blogs...'
        filters={[
          { key: 'status', options: STATUS_FILTER_OPTIONS, placeholder: 'Filter by Status' },
        ]}
      >
        <BlogList posts={allPosts} meta={meta} />
      </ListingCard>
    </div>
  );
}
