import {
  getNavMenuItems,
  getCatalogsAndServicesForMenu,
  saveNavMenuItems,
} from '@/lib/actions/menu';
import { MenuBuilder } from './components/menu-builder';

export const dynamic = 'force-dynamic';

export default async function MenuManagementPage() {
  const [menuItems, availableItems] = await Promise.all([
    getNavMenuItems(),
    getCatalogsAndServicesForMenu(),
  ]);

  // Transform menu items for the builder component
  const initialSelectedItems = menuItems.map((item) => ({
    id: item.id,
    itemType: item.itemType,
    catalogId: item.catalogId,
    serviceId: item.serviceId,
    position: item.position,
    isActive: item.isActive,
    name: item.catalog?.name || item.service?.title || 'Unknown',
    slug: item.catalog?.slug || item.service?.slug || '',
  }));

  async function handleSave(items: typeof initialSelectedItems) {
    'use server';
    return saveNavMenuItems({
      items: items.map((item) => ({
        itemType: item.itemType,
        catalogId: item.catalogId,
        serviceId: item.serviceId,
        position: item.position,
        isActive: item.isActive,
      })),
    });
  }

  return (
    <div className='container max-w-4xl py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Menu Management</h1>
        <p className='mt-2 text-gray-600'>
          Configure which catalogs, subcatalogs, and services appear in the storefront navigation
          menu. Drag items to reorder them.
        </p>
      </div>

      <div className='bg-white rounded-lg border p-6'>
        <MenuBuilder
          availableItems={availableItems}
          initialSelectedItems={initialSelectedItems}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
