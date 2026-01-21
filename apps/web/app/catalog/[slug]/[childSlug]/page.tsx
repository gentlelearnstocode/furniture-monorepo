import { notFound } from 'next/navigation';
import { db } from '@repo/database';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { createCachedQuery } from '@/lib/cache';
import { ProductListing } from '@/app/components/product-listing';
import { getLocale, getLocalizedText } from '@/lib/i18n';

// Revalidate every hour
export const revalidate = 3600;

// Generate static params for all catalog combinations at build time
export async function generateStaticParams() {
  const catalogs = await db.query.catalogs.findMany({
    where: (catalogs, { isNull }) => isNull(catalogs.parentId),
    with: {
      children: {
        columns: { slug: true },
      },
    },
    columns: { slug: true },
  });

  const params: { slug: string; childSlug: string }[] = [];
  for (const catalog of catalogs) {
    for (const child of catalog.children) {
      params.push({
        slug: catalog.slug,
        childSlug: child.slug,
      });
    }
  }

  return params;
}

interface Props {
  params: Promise<{
    slug: string;
    childSlug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const getChildCatalog = (
  slug: string,
  childSlug: string,
  parentId: string,
  sort?: string,
  sale?: boolean,
) =>
  createCachedQuery(
    async () => {
      return await db.query.catalogs.findFirst({
        where: (catalogs, { eq, and }) =>
          and(eq(catalogs.slug, childSlug), eq(catalogs.parentId, parentId)),
        columns: {
          id: true,
          name: true,
          nameVi: true,
          slug: true,
          description: true,
          descriptionVi: true,
          parentId: true,
          productImageRatio: true,
        },
        with: {
          image: true,
          products: {
            with: {
              gallery: {
                with: {
                  asset: true,
                },
                orderBy: (gallery, { asc }) => [asc(gallery.position)],
              },
            },
            where: (products, { eq, and, isNotNull }) =>
              and(
                eq(products.isActive, true),
                sale ? isNotNull(products.discountPrice) : undefined,
              ),
            orderBy: (products, { asc, desc }) => {
              switch (sort) {
                case 'name_desc':
                  return [desc(products.name)];
                case 'price_asc':
                  return [asc(products.basePrice)];
                case 'price_desc':
                  return [desc(products.basePrice)];
                case 'name_asc':
                default:
                  return [asc(products.name)];
              }
            },
          },
        },
      });
    },
    ['catalog-child', slug, childSlug, sort || 'default', sale ? 'sale' : 'no-sale'],
    { revalidate: 3600, tags: ['catalogs', `catalog-${slug}-${childSlug}`] },
  );

export default async function CatalogLevel2Page({ params, searchParams }: Props) {
  const { slug, childSlug } = await params;
  const search = await searchParams;

  const sort = typeof search.sort === 'string' ? search.sort : undefined;
  const sale = search.sale === 'true';

  // Fetch the parent catalog (level 1) and child catalog (level 2) with products
  const parentCatalog = await db.query.catalogs.findFirst({
    where: (catalogs, { eq }) => eq(catalogs.slug, slug),
    with: {
      children: {
        columns: { name: true, nameVi: true, slug: true },
      },
    },
  });

  if (!parentCatalog) {
    notFound();
  }

  // Fetch the child catalog (level 2) with its products
  const catalog = await getChildCatalog(slug, childSlug, parentCatalog.id, sort, sale)();

  if (!catalog) {
    notFound();
  }

  const locale = await getLocale();

  // Map products to ensure they match the Product type expected by ProductListing
  // The query already returns the structure we need, but we map to be safe and clear
  const products = catalog.products.map((product) => ({
    id: product.id,
    name: product.name,
    nameVi: product.nameVi,
    slug: product.slug,
    basePrice: product.basePrice,
    discountPrice: product.discountPrice,
    showPrice: product.showPrice,
    shortDescription: product.shortDescription,
    shortDescriptionVi: product.shortDescriptionVi,
    gallery: product.gallery
      .filter((g) => g.asset !== null)
      .map((g) => ({
        isPrimary: g.isPrimary,
        asset: g.asset as { url: string },
        focusPoint: g.focusPoint as { x: number; y: number } | null,
        aspectRatio: g.aspectRatio,
        objectFit: g.objectFit,
        position: g.position,
      })),
  }));

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      <AppBreadcrumb
        items={[
          { label: locale === 'vi' ? 'Trang chủ' : 'Home Page', href: '/' },
          { label: getLocalizedText(parentCatalog, 'name', locale), href: `/catalog/${slug}` },
          { label: getLocalizedText(catalog, 'name', locale) },
        ]}
      />

      <div className='container mx-auto px-4 pt-2 sm:pt-4 pb-4 sm:pb-6'>
        {/* Title & Description */}
        <div className='mb-4 sm:mb-6 md:mb-8'>
          <h1 className='text-lg sm:text-xl md:text-3xl font-serif text-black/90 tracking-wide mb-2 sm:mb-4'>
            {getLocalizedText(catalog, 'name', locale)}
          </h1>
          {getLocalizedText(catalog, 'description', locale) && (
            <p className='text-[13px] sm:text-[15px] leading-relaxed text-gray-600 max-w-4xl font-serif'>
              {getLocalizedText(catalog, 'description', locale)}
            </p>
          )}
        </div>

        {/* Product Listing (Toolbar + Grid) */}
        <ProductListing
          products={products}
          catalogOptions={parentCatalog.children.map((child) => ({
            label: getLocalizedText(child, 'name', locale),
            value: `/catalog/${slug}/${child.slug}`,
          }))}
          currentCatalog={`/catalog/${slug}/${childSlug}`}
          imageRatio={catalog.productImageRatio}
        />
      </div>
    </div>
  );
}
