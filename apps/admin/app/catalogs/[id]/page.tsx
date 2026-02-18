export const dynamic = 'force-dynamic';

import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { CatalogForm } from '../components/catalog-form';
import { PageHeader } from '@/components/layout/page-header';

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
      slug: true,
    },
  });

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Catalogs', href: '/catalogs' },
          { label: 'Edit' },
        ]}
        title='Edit Catalog'
        description='Update catalog category details.'
      />
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
