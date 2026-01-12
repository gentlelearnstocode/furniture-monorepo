import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { collections } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { ListingControls } from '@/components/ui/listing-controls';
import { CollectionList } from './components/collection-list';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

interface CollectionsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    home?: string;
  }>;
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const status = resolvedSearchParams.status;
  const home = resolvedSearchParams.home;

  const filters = [];
  if (status && status !== 'all') {
    filters.push(eq(collections.isActive, status === 'active'));
  }
  if (home && home !== 'all') {
    filters.push(eq(collections.showOnHome, home === 'show'));
  }

  const { data: allCollections, meta } = await getListingData(collections, {
    page,
    limit: 10,
    search,
    searchColumns: [collections.name, collections.slug],
    filters,
    orderBy: (t: any, { desc }: any) => [desc(t.createdAt)],
    with: {
      banner: true,
    },
  });

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const homeOptions = [
    { label: 'Shown on Home', value: 'show' },
    { label: 'Hidden from Home', value: 'hidden' },
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
            <span className='font-medium text-gray-900'>Collections</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Collections</h1>
          <p className='text-base text-gray-500 mt-1'>
            Manage product groupings and marketing sets.
          </p>
        </div>
        <div className='flex gap-3'>
          <Link href='/collections/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Collection
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <Card className='p-4 flex flex-col justify-between'>
          <span className='text-sm font-medium text-gray-500'>Total Collections</span>
          <span className='text-2xl font-bold'>{meta.totalItems}</span>
        </Card>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <CardTitle>Collection List</CardTitle>
              <CardDescription>View and manage your collections.</CardDescription>
            </div>
            <div className='flex flex-col sm:flex-row gap-2'>
              <ListingControls
                placeholder='Search collections...'
                filterKey='status'
                filterOptions={statusOptions}
                filterPlaceholder='Filter by Status'
              />
              <ListingControls
                filterKey='home'
                filterOptions={homeOptions}
                filterPlaceholder='Filter by Home'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CollectionList collections={allCollections} meta={meta} />
        </CardContent>
      </Card>
    </div>
  );
}
