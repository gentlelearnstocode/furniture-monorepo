import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { catalogs } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { ListingControls } from '@/components/ui/listing-controls';
import { CatalogList } from './components/catalog-list';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

interface CatalogsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    level?: string;
  }>;
}

export default async function CatalogsPage({ searchParams }: CatalogsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const level = resolvedSearchParams.level;

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
    },
  });

  const levelOptions = [
    { label: 'Level 1 (Parent)', value: '1' },
    { label: 'Level 2 (Subcatalog)', value: '2' },
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
            <span className='font-medium text-gray-900'>Catalogs</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Catalogs</h1>
          <p className='text-base text-gray-500 mt-1'>
            Manage product categories and organizational hierarchy.
          </p>
        </div>
        <div className='flex gap-3'>
          <Link href='/catalogs/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Catalog
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <Card className='p-4 flex flex-col justify-between'>
          <span className='text-sm font-medium text-gray-500'>Total Catalogs</span>
          <span className='text-2xl font-bold'>{meta.totalItems}</span>
        </Card>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <CardTitle>Catalog List</CardTitle>
              <CardDescription>View and manage your catalogs.</CardDescription>
            </div>
            <div className='flex flex-col sm:flex-row gap-2'>
              <ListingControls
                placeholder='Search catalogs...'
                filterKey='level'
                filterOptions={levelOptions}
                filterPlaceholder='Filter by Level'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CatalogList catalogs={allCatalogs} meta={meta} />
        </CardContent>
      </Card>
    </div>
  );
}
