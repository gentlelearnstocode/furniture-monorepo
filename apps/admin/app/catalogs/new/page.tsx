export const dynamic = 'force-dynamic';

import { CatalogForm } from '../components/catalog-form';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';
import { db } from '@repo/database';

export default async function NewCatalogPage() {
  const rootCatalogs = await db.query.catalogs.findMany({
    where: (catalogs, { isNull }) => isNull(catalogs.parentId),
    columns: {
      id: true,
      name: true,
      slug: true,
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
          <h1 className='text-2xl font-bold tracking-tight'>Create Catalog</h1>
          <p className='text-sm text-gray-500'>Add a new catalog category to the store.</p>
        </div>
      </div>
      <CatalogForm parentCatalogs={rootCatalogs} />
    </div>
  );
}
