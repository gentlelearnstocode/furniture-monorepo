import { Button } from '@repo/ui/ui/button';
import { Plus, FileUp } from 'lucide-react';
import Link from 'next/link';
import { products, catalogs as catalogsTable } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { ProductList } from './components/product-list';
import { eq } from 'drizzle-orm';
import { db } from '@repo/database';
import { PageHeader } from '@/components/layout/page-header';
import { StatsCard } from '@/components/listing/stats-card';
import { ListingCard } from '@/components/listing/listing-card';
import { parseListingParams } from '@/lib/listing-params';
import { STATUS_FILTER_OPTIONS } from '@/constants';

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    catalogId?: string;
    status?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { page, search, catalogId, status } = await parseListingParams(searchParams, {
    filterKeys: ['catalogId', 'status'],
  });

  const filters = [];
  if (catalogId && catalogId !== 'all') {
    filters.push(eq(products.catalogId, catalogId as string));
  }
  if (status && status !== 'all') {
    filters.push(eq(products.isActive, status === 'active'));
  }

  const { data: allProducts, meta } = await getListingData(products, {
    page,
    limit: 10,
    search,
    searchColumns: [products.name, products.slug],
    filters,
    orderBy: (t: any, { desc }: any) => [desc(t.createdAt)],
    with: {
      catalog: true,
      gallery: {
        where: (productAssets: any, { eq }: any) => eq(productAssets.isPrimary, true),
        with: {
          asset: true,
        },
        limit: 1,
      },
    },
  });

  // Fetch catalogs for filter
  const catalogs = await db.query.catalogs.findMany({
    where: eq(catalogsTable.level, 2),
    orderBy: (c, { asc }) => [asc(c.name)],
  });

  const catalogOptions = catalogs.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Products' }]}
        title='Products'
        description='Manage your inventory, pricing, and variants.'
        actions={
          <>
            <Link href='/products/import'>
              <Button size='sm' variant='outline'>
                <FileUp className='mr-2 h-4 w-4' />
                Import from Excel
              </Button>
            </Link>
            <Link href='/products/new'>
              <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
                <Plus className='mr-2 h-4 w-4' />
                Add Product
              </Button>
            </Link>
          </>
        }
      />

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <StatsCard label='Total Products' value={meta.totalItems} />
      </div>

      <ListingCard
        title='Product List'
        description='View and manage your products.'
        searchPlaceholder='Search products...'
        filters={[
          { key: 'catalogId', options: catalogOptions, placeholder: 'Filter by Catalog' },
          { key: 'status', options: STATUS_FILTER_OPTIONS, placeholder: 'Filter by Status' },
        ]}
      >
        <ProductList products={allProducts} meta={meta} />
      </ListingCard>
    </div>
  );
}
