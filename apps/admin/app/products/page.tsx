import { Button } from '@repo/ui/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { products, catalogs as catalogsTable } from '@repo/database/schema';
import { getListingData } from '@/lib/listing-utils';
import { ListingControls } from '@/components/ui/listing-controls';
import { ProductList } from './components/product-list';
import { eq } from 'drizzle-orm';
import { db } from '@repo/database';

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
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const catalogId = resolvedSearchParams.catalogId;
  const status = resolvedSearchParams.status;

  const filters = [];
  if (catalogId && catalogId !== 'all') {
    filters.push(eq(products.catalogId, catalogId));
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

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Draft', value: 'inactive' },
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
            <span className='font-medium text-gray-900'>Products</span>
          </nav>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Products</h1>
          <p className='text-base text-gray-500 mt-1'>
            Manage your inventory, pricing, and variants.
          </p>
        </div>
        <div className='flex gap-3'>
          <Link href='/products/new'>
            <Button size='sm' className='bg-brand-primary-600 hover:bg-brand-primary-700'>
              <Plus className='mr-2 h-4 w-4' />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-4'>
        <Card className='p-4 flex flex-col justify-between'>
          <span className='text-sm font-medium text-gray-500'>Total Products</span>
          <span className='text-2xl font-bold'>{meta.totalItems}</span>
        </Card>
      </div>

      <Card className='shadow-sm border-gray-200'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <CardTitle>Product List</CardTitle>
              <CardDescription>View and manage your products.</CardDescription>
            </div>
            <div className='flex flex-col sm:flex-row gap-2'>
              <ListingControls
                placeholder='Search products...'
                filterKey='catalogId'
                filterOptions={catalogOptions}
                filterPlaceholder='Filter by Catalog'
              />
              <ListingControls
                filterKey='status'
                filterOptions={statusOptions}
                filterPlaceholder='Filter by Status'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProductList products={allProducts} meta={meta} />
        </CardContent>
      </Card>
    </div>
  );
}
