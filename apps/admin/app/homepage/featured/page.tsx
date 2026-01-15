import { getFeaturedLayout, getAvailableCatalogs } from '@/lib/actions/featured-layout';
import { LayoutBuilder } from './components/layout-builder';

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
    <div className='container max-w-5xl py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Featured Catalog Layout</h1>
        <p className='mt-2 text-gray-600'>
          Configure how catalogs are displayed on your homepage. Drag rows to reorder, and assign
          catalogs to each slot.
        </p>
      </div>

      <LayoutBuilder initialRows={transformedRows} availableCatalogs={availableCatalogs} />
    </div>
  );
}
