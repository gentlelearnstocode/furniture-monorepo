import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { catalogs } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { CatalogList } from './components/catalog-list';
import { eq } from 'drizzle-orm';
import { PageHeader } from '@/components/layout/page-header';
import { StatsCard } from '@/components/listing/stats-card';
import { ListingCard } from '@/components/listing/listing-card';
import { parseListingParams } from '@/lib/listing-params';

export const dynamic = 'force-dynamic';

interface CatalogsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    level?: string;
  }>;
}

export default async function CatalogsPage({ searchParams }: CatalogsPageProps) {
  const { page, search, level } = await parseListingParams(searchParams, {
    filterKeys: ['level'],
  });

  const filters = [];
  if (level && level !== 'all') {
    filters.push(eq(catalogs.level, Number(level)));
  }

  const { data: allCatalogs, meta } = await getListingData(catalogs, {
    page,
    limit: 10,
    search,
    searchColumns: [catalogs.name, catalogs.slug],
    filters,
    orderBy: (t: any, { desc }: any) => [desc(t.createdAt)],
    with: {
      parent: true,
      image: true,
      createdBy: true,
    },
  });

  const levelOptions = [
    { label: 'Level 1 (Parent)', value: '1' },
    { label: 'Level 2 (Subcatalog)', value: '2' },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Catalogs' }]}
        title='Catalogs'
        description='Manage product categories and organizational hierarchy.'
        actions={
          <Link href='/catalogs/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Catalog
            </Button>
          </Link>
        }
      />

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <StatsCard label='Total Catalogs' value={meta.totalItems} />
      </div>

      <ListingCard
        title='Catalog List'
        description='View and manage your catalogs.'
        searchPlaceholder='Search catalogs...'
        filters={[{ key: 'level', options: levelOptions, placeholder: 'Filter by Level' }]}
      >
        <CatalogList catalogs={allCatalogs} meta={meta} />
      </ListingCard>
    </div>
  );
}
