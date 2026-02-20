import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { collections } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { CollectionList } from './components/collection-list';
import { eq } from 'drizzle-orm';
import { PageHeader } from '@/components/layout/page-header';
import { StatsCard } from '@/components/listing/stats-card';
import { ListingCard } from '@/components/listing/listing-card';
import { parseListingParams } from '@/lib/listing-params';
import { STATUS_FILTER_OPTIONS } from '@/constants';
import { type CollectionWithRelations } from '@repo/shared';

export const dynamic = 'force-dynamic';

interface CollectionsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const { page, search, status } = await parseListingParams(searchParams, {
    filterKeys: ['status'],
  });

  const filters = [];
  if (status && status !== 'all') {
    filters.push(eq(collections.isActive, status === 'active'));
  }

  const { data: allCollections, meta } = await getListingData<CollectionWithRelations>(collections, {
    page,
    limit: 10,
    search,
    searchColumns: [collections.name, collections.slug],
    filters,
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    with: {
      banner: true,
      createdBy: true,
    },
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Collections' }]}
        title='Collections'
        description='Manage product groupings and marketing sets.'
        actions={
          <Link href='/collections/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Collection
            </Button>
          </Link>
        }
      />

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <StatsCard label='Total Collections' value={meta.totalItems} />
      </div>

      <ListingCard
        title='Collection List'
        description='View and manage your collections.'
        searchPlaceholder='Search collections...'
        filters={[
          { key: 'status', options: STATUS_FILTER_OPTIONS, placeholder: 'Filter by Status' },
        ]}
      >
        <CollectionList collections={allCollections} meta={meta} />
      </ListingCard>
    </div>
  );
}
