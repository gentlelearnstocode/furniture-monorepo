import Link from 'next/link';
import Image from 'next/image';
import { db } from '@repo/database';
import { featuredCatalogRows } from '@repo/database/schema';
import { cn } from '@repo/ui/lib/utils';
import { asc } from 'drizzle-orm';
import { getLocale, getLocalizedText, type Locale } from '@/lib/i18n';
import { getTranslations } from 'next-intl/server';

// Catalog Section component - same design as old CollectionSection
const CatalogSection = ({
  name,
  nameVi,
  slug,
  imageUrl,
  isFirst,
  layout,
  locale,
  t,
}: {
  name: string;
  nameVi?: string | null;
  slug: string;
  imageUrl: string;
  isFirst?: boolean;
  layout?: 'full' | 'half' | 'third' | 'quarter';
  locale: Locale;
  t: any;
}) => {
  const isSmall = layout === 'half' || layout === 'third' || layout === 'quarter';

  const localizedName = getLocalizedText({ name, nameVi }, 'name', locale);

  return (
    <Link href={`/catalog/${slug}`}>
      <section
        className={cn(
          'relative w-full overflow-hidden group cursor-pointer transition-all duration-500',
          layout === 'full' && 'h-[65vh] md:h-[75vh]',
          layout === 'half' && 'h-[45vh] md:h-[55vh]',
          layout === 'third' && 'h-[35vh] md:h-[45vh]',
          layout === 'quarter' && 'h-[30vh] md:h-[40vh]',
        )}
      >
        {/* Background Image with Hover Zoom */}
        <div className='absolute inset-0 z-0 transition-transform duration-1000 ease-out group-hover:scale-110'>
          <Image
            src={imageUrl}
            alt={localizedName}
            fill
            className='object-cover'
            priority={isFirst}
            sizes={
              layout === 'full'
                ? '100vw'
                : layout === 'half'
                  ? '50vw'
                  : layout === 'third'
                    ? '33vw'
                    : '25vw'
            }
          />
          {/* Dark Overlay - 40% on mobile for readability, 30% default on desktop, 50% on hover */}
          <div className='absolute inset-0 bg-black/40 md:bg-black/30 md:group-hover:bg-black/50 transition-colors duration-500 z-10' />
        </div>

        {/* Centered Content - Static on Mobile, Visible on Hover on Desktop */}
        <div className='absolute inset-0 z-20 flex flex-col items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 px-6 text-center'>
          <h3
            className={cn(
              'text-white font-serif uppercase tracking-[0.15em] mb-4 drop-shadow-2xl translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500',
              isSmall ? 'text-lg sm:text-xl md:text-2xl' : 'text-xl sm:text-3xl md:text-5xl lg:text-6xl',
            )}
          >
            {localizedName}
          </h3>
          <div className='flex flex-col items-center gap-2'>
            <span className='text-white text-xs sm:text-sm md:text-base font-medium tracking-[0.25em] uppercase border-b border-white pb-1.5'>
              {t('seeAll')}
            </span>
          </div>
        </div>
      </section>
    </Link>
  );
};

// Map column count to layout type
function getLayoutFromColumns(columns: number): 'full' | 'half' | 'third' | 'quarter' {
  switch (columns) {
    case 1:
      return 'full';
    case 2:
      return 'half';
    case 3:
      return 'third';
    case 4:
      return 'quarter';
    default:
      return 'third';
  }
}

// Map column count to grid class
function getGridClass(columns: number): string {
  switch (columns) {
    case 1:
      return 'col-span-12';
    case 2:
      return 'col-span-12 md:col-span-6';
    case 3:
      return 'col-span-12 md:col-span-4';
    case 4:
      return 'col-span-12 sm:col-span-6 md:col-span-3';
    default:
      return 'col-span-12 md:col-span-4';
  }
}

import { createCachedQuery } from '@/lib/cache';

export const FeaturedCatalogs = async () => {
  // Cached custom layout configuration
  const getFeaturedLayout = createCachedQuery(
    async () =>
      await db.query.featuredCatalogRows.findMany({
        orderBy: [asc(featuredCatalogRows.position)],
        with: {
          items: {
            with: {
              catalog: {
                with: {
                  image: true,
                },
              },
            },
            orderBy: (items, { asc }) => [asc(items.position)],
          },
        },
      }),
    ['featured-catalogs-layout'],
    { revalidate: 3600, tags: ['catalogs', 'featured-layout'] },
  );

  // Cached fallback level 1 catalogs
  const getFallbackFeaturedCatalogs = createCachedQuery(
    async () =>
      await db.query.catalogs.findMany({
        where: (catalogs, { eq, and }) => and(eq(catalogs.showOnHome, true), eq(catalogs.level, 1)),
        with: {
          image: true,
        },
        orderBy: (catalogs, { asc }) => [asc(catalogs.displayOrder)],
      }),
    ['featured-catalogs-fallback'],
    { revalidate: 3600, tags: ['catalogs'] },
  );

  // Try to fetch custom layout configuration
  const layoutRows = await getFeaturedLayout();
  const locale = await getLocale();
  const t = await getTranslations('FeaturedCatalogs');

  // If custom layout exists and has items, use it
  if (layoutRows.length > 0 && layoutRows.some((row) => row.items.length > 0)) {
    let isFirstCatalog = true;

    return (
      <div>
        {layoutRows.map((row: any) => {
          // Skip empty rows
          if (row.items.length === 0) return null;

          const layout = getLayoutFromColumns(row.columns);
          const gridClass = getGridClass(row.columns);

          return (
            <div key={row.id} className='grid grid-cols-12'>
              {row.items.map((item: any) => {
                if (!item.catalog) return null;

                const isFirst = isFirstCatalog;
                isFirstCatalog = false;

                return (
                  <div key={item.id} className={gridClass}>
                    <CatalogSection
                      name={item.catalog.name}
                      nameVi={item.catalog.nameVi}
                      slug={item.catalog.slug}
                      imageUrl={
                        item.catalog.image?.url ||
                        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200'
                      }
                      isFirst={isFirst}
                      layout={layout}
                      locale={locale}
                      t={t}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback: Fetch Level 1 catalogs marked to be shown on home
  const featuredCatalogs = await getFallbackFeaturedCatalogs();

  if (featuredCatalogs.length === 0) return null;

  // Fallback layout calculation based on position
  const getLayout = (index: number, total: number): 'full' | 'half' | 'third' => {
    if (total === 1) return 'full';
    if (total === 2) return 'half';
    if (total === 3) return 'third';
    // For 4+, use third for all
    return 'third';
  };

  return (
    <div className='grid grid-cols-12'>
      {featuredCatalogs.map((catalog, index) => {
        const layout = getLayout(index, featuredCatalogs.length);
        return (
          <div
            key={catalog.id}
            className={cn(
              layout === 'full' && 'col-span-12',
              layout === 'half' && 'col-span-12 md:col-span-6',
              layout === 'third' && 'col-span-12 md:col-span-4',
            )}
          >
            <CatalogSection
              name={catalog.name}
              nameVi={catalog.nameVi}
              slug={catalog.slug}
              imageUrl={
                catalog.image?.url ||
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200'
              }
              isFirst={index === 0}
              layout={layout}
              locale={locale}
              t={t}
            />
          </div>
        );
      })}
    </div>
  );
};
