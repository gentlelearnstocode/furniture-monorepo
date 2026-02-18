import { db } from '@repo/database';
import { CollectionForm } from '../components/collection-form';
import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

export default async function NewCollectionPage() {
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
          { label: 'Create' },
        ]}
        title='Create Collection'
        description='Add a new product collection to the store.'
      />
      <CollectionForm availableProducts={allProducts} availableCatalogs={allCatalogs} />
    </div>
  );
}
