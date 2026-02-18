import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { CollectionForm } from '../components/collection-form';
import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

import { PageProps } from '@/types';

export default async function EditCollectionPage({ params }: PageProps<{ id: string }>) {
  const { id } = await params;

  const collection = await db.query.collections.findFirst({
    where: (collections, { eq }) => eq(collections.id, id),
    with: {
      banner: true,
      products: true,
      catalogs: true,
    },
  });

  if (!collection) {
    notFound();
  }

  const allProducts = await db.query.products.findMany({
    orderBy: (products, { asc }) => [asc(products.name)],
  });

  const allCatalogs = await db.query.catalogs.findMany({
    where: (catalogs, { eq }) => eq(catalogs.level, 1),
    orderBy: (catalogs, { asc }) => [asc(catalogs.name)],
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: 'Edit' },
        ]}
        title='Edit Collection'
        description='Update collection details and manage products.'
      />
      <CollectionForm
        initialData={collection as any}
        availableProducts={allProducts}
        availableCatalogs={allCatalogs}
      />
    </div>
  );
}
