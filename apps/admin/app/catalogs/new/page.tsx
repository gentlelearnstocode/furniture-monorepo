export const dynamic = 'force-dynamic';

import { CatalogForm } from '../components/catalog-form';
import { db } from '@repo/database';
import { PageHeader } from '@/components/layout/page-header';

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
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Catalogs', href: '/catalogs' },
          { label: 'Create' },
        ]}
        title='Create Catalog'
        description='Add a new catalog category to the store.'
      />
      <CatalogForm parentCatalogs={rootCatalogs} />
    </div>
  );
}
