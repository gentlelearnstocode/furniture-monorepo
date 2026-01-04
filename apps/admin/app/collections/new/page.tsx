import { db } from '@repo/database';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/ui/button';

import { CollectionForm } from '../components/collection-form';

export const dynamic = 'force-dynamic';

export default async function NewCollectionPage() {
  const allProducts = await db.query.products.findMany({
    orderBy: (products, { asc }) => [asc(products.name)],
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/collections'>
          <Button variant='outline' size='icon'>
            <MoveLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Create Collection</h1>
          <p className='text-sm text-gray-500'>Add a new product collection to the store.</p>
        </div>
      </div>
      <CollectionForm availableProducts={allProducts} />
    </div>
  );
}
