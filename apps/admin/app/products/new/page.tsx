import { ProductForm } from '@/app/products/components/create-product-form';
import { db } from '@repo/database';
import { PageHeader } from '@/components/layout/page-header';

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
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Create' },
        ]}
        title='Create Product'
        description='Create a new product, assign it to a catalog, and set its price.'
      />

      <ProductForm
        catalogs={catalogs.map((c) => ({
          id: c.id,
          name: c.parent ? `${c.parent.name} > ${c.name}` : c.name,
        }))}
      />
    </div>
  );
}
