import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { services } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { ServiceList } from './components/service-list';
import { eq } from 'drizzle-orm';
import { PageHeader } from '@/components/layout/page-header';
import { StatsCard } from '@/components/listing/stats-card';
import { ListingCard } from '@/components/listing/listing-card';
import { parseListingParams } from '@/lib/listing-params';
import { STATUS_FILTER_OPTIONS } from '@/constants';

export const dynamic = 'force-dynamic';

interface ServicesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { page, search, status } = await parseListingParams(searchParams, {
    filterKeys: ['status'],
  });

  const filters = [];
  if (status && status !== 'all') {
    filters.push(eq(services.isActive, status === 'active'));
  }

  const { data: allServices, meta } = await getListingData(services, {
    page,
    limit: 10,
    search,
    searchColumns: [services.title, services.slug],
    filters,
    orderBy: (t: any, { desc }: any) => [desc(t.createdAt)],
    with: {
      image: true,
      createdBy: true,
    },
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Services' }]}
        title='Services'
        description='Manage the services your business offers.'
        actions={
          <Link href='/services/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Service
            </Button>
          </Link>
        }
      />

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <StatsCard label='Total Services' value={meta.totalItems} />
      </div>

      <ListingCard
        title='Service List'
        description='View and manage your services.'
        searchPlaceholder='Search services...'
        filters={[
          { key: 'status', options: STATUS_FILTER_OPTIONS, placeholder: 'Filter by Status' },
        ]}
      >
        <ServiceList services={allServices} meta={meta} />
      </ListingCard>
    </div>
  );
}
