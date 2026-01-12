import { ProductForm } from '@/app/products/components/create-product-form';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { db } from '@repo/database';
import { Button } from '@repo/ui/ui/button';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const catalogs = await db.query.catalogs.findMany({
    where: (catalogs, { eq }) => eq(catalogs.level, 2),
    orderBy: (catalogs, { asc }) => [asc(catalogs.name)],
    with: {
      parent: true,
    },
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/products'>
          <Button variant='outline' size='icon'>
            <MoveLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Create Product</h1>
          <p className='text-sm text-gray-500'>
            Create a new product, assign it to a catalog, and set its price.
          </p>
        </div>
      </div>

      <ProductForm
        catalogs={catalogs.map((c) => ({
          id: c.id,
          name: c.parent ? `${c.parent.name} > ${c.name}` : c.name,
        }))}
      />
    </div>
  );
}
