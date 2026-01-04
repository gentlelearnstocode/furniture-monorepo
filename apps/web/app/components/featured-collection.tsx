import { db } from '@repo/database';
import { CollectionSection } from './collection-section';

export const FeaturedCollections = async () => {
  // Fetch collections marked to be shown on home
  const featuredCollections = await db.query.collections.findMany({
    where: (collections, { eq }) => eq(collections.showOnHome, true),
    with: {
      banner: true,
    },
    // Ensure active status too
    orderBy: (collections, { desc }) => [desc(collections.updatedAt)],
  });

  const activeCollections = featuredCollections.filter((c) => c.isActive);

  if (activeCollections.length === 0) return null;

  return (
    <div className='flex flex-col'>
      {activeCollections.map((collection, index) => (
        <CollectionSection
          key={collection.id}
          name={collection.name}
          imageUrl={
            collection.banner?.url ||
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200'
          }
          isFirst={index === 0}
        />
      ))}
    </div>
  );
};
