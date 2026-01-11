import { db } from '@repo/database';
import { CollectionSection } from '../components/collection-section';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  // Fetch all active collections
  const collections = await db.query.collections.findMany({
    where: (collections, { eq }) => eq(collections.isActive, true),
    with: {
      banner: true,
    },
    orderBy: (collections, { desc }) => [desc(collections.updatedAt)],
  });

  if (collections.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <h1 className='text-2xl text-gray-500'>No collections found.</h1>
      </div>
    );
  }

  return (
    <div className='pt-32 pb-20'>
      <div className='container mx-auto px-4 mb-12'>
        <h1 className='text-4xl md:text-6xl font-serif uppercase tracking-wider text-center'>
          Our Collections
        </h1>
      </div>

      <div className='grid grid-cols-12 max-w-[1920px] mx-auto'>
        {collections.map((collection, index) => (
          <div key={collection.id} className='col-span-12 md:col-span-6 lg:col-span-4'>
            <CollectionSection
              name={collection.name}
              imageUrl={
                collection.banner?.url ||
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200'
              }
              isFirst={index < 3}
              layout='third' // Default to third for the listing page grid
            />
          </div>
        ))}
      </div>
    </div>
  );
}
