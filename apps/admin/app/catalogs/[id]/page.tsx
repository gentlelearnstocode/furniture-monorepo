export const dynamic = 'force-dynamic';

import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { CatalogForm } from '../components/catalog-form';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';

import { PageProps } from '@/types';

export default async function EditCatalogPage({ params }: PageProps<{ id: string }>) {
  const { id: catalogId } = await params;

  const catalog = await db.query.catalogs.findFirst({
    where: (catalogs, { eq }) => eq(catalogs.id, catalogId),
    with: {
      children: true,
      image: true,
    },
  });

  if (!catalog) {
    notFound();
  }

  const hasChildren = catalog.children.length > 0;

  const rootCatalogs = await db.query.catalogs.findMany({
    where: (catalogs, { isNull, and, ne }) =>
      and(isNull(catalogs.parentId), ne(catalogs.id, catalogId)),
    columns: {
      id: true,
      name: true,
    },
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/catalogs'>
          <Button variant='outline' size='icon'>
            <MoveLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Edit Catalog</h1>
          <p className='text-sm text-gray-500'>Update catalog category details.</p>
        </div>
      </div>
      <div className='max-w-4xl'>
        <CatalogForm
          initialData={catalog}
          parentCatalogs={rootCatalogs}
          hasChildren={hasChildren}
        />
      </div>
    </div>
  );
}
