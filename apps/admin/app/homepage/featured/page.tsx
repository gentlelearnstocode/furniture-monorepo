import { getFeaturedLayout, getAvailableCatalogs } from '@/lib/actions/featured-layout';
import { LayoutBuilder } from './components/layout-builder';
import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

export default async function FeaturedCatalogLayoutPage() {
  const [layoutRows, availableCatalogs] = await Promise.all([
    getFeaturedLayout(),
    getAvailableCatalogs(),
  ]);

  // Transform rows to include catalog data in items
  const transformedRows = layoutRows.map((row) => ({
    id: row.id,
    position: row.position,
    columns: row.columns,
    items: row.items.map((item) => ({
      id: item.id,
      catalogId: item.catalogId,
      position: item.position,
      catalog: item.catalog
        ? {
            id: item.catalog.id,
            name: item.catalog.name,
            slug: item.catalog.slug,
            image: item.catalog.image,
          }
        : undefined,
    })),
  }));

  return (
    <div className='space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Homepage', href: '/homepage' },
          { label: 'Featured Layout' },
        ]}
        title='Featured Catalog Layout'
        description='Configure how catalogs are displayed on your homepage. Drag rows to reorder, and assign catalogs to each slot.'
      />

      <LayoutBuilder initialRows={transformedRows} availableCatalogs={availableCatalogs} />
    </div>
  );
}
