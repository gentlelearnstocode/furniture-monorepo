import { notFound } from 'next/navigation';
import { db, recommendedProducts } from '@repo/database';
import { ProductGallery } from './components/product-gallery';
import { ProductInfo } from './components/product-info';
import { RecommendedProducts } from './components/recommended-products';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { createCachedQuery } from '@/lib/cache';
import { getSiteContacts } from '@/lib/queries';
import { getLocale, getLocalizedText } from '@/lib/i18n';
import { getTranslations } from 'next-intl/server';
import { eq, asc } from 'drizzle-orm';

import type { Metadata } from 'next';

// Revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const name = getLocalizedText(product, 'name', locale);
  const description = getLocalizedText(product, 'shortDescription', locale);

  return {
    title: `${name} | Thien An Furniture`,
    description: description || `Explore ${name} - high-quality handcrafted furniture by Thien An.`,
  };
}

// Generate static params for all products at build time
export async function generateStaticParams() {
  const products = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.isActive, true),
    columns: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const getProductBySlug = createCachedQuery(
  async (slug: string) => {
    return await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.slug, slug),
      with: {
        catalog: {
          with: {
            parent: true,
          },
        },
        gallery: {
          with: {
            asset: true,
          },
          orderBy: (gallery, { asc }) => [asc(gallery.position)],
        },
      },
    });
  },
  ['product-detail'],
  { revalidate: 3600, tags: ['products', 'catalogs'] },
);

const getRecommendedProducts = createCachedQuery(
  async (productId: string) => {
    const recommendations = await db.query.recommendedProducts.findMany({
      where: eq(recommendedProducts.sourceProductId, productId),
      orderBy: [asc(recommendedProducts.position)],
      with: {
        recommendedProduct: {
          with: {
            gallery: {
              with: {
                asset: true,
              },
              orderBy: (gallery, { asc }) => [asc(gallery.position)],
            },
          },
        },
      },
    });

    return recommendations.map((r) => r.recommendedProduct);
  },
  ['recommended-products'],
  { revalidate: 3600, tags: ['products', 'catalogs'] },
);

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();

  const product = await getProductBySlug(slug);
  const contacts = await getSiteContacts();
  const tb = await getTranslations('Breadcrumbs');

  if (!product) {
    notFound();
  }

  // Fetch recommended products
  const recommended = await getRecommendedProducts(product.id);

  const parentCatalog = product.catalog?.parent;
  const currentCatalog = product.catalog;

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          ...(parentCatalog
            ? [
                {
                  label: getLocalizedText(parentCatalog, 'name', locale),
                  href: `/catalog/${parentCatalog.slug}`,
                },
              ]
            : []),
          ...(currentCatalog
            ? [
                {
                  label: getLocalizedText(currentCatalog, 'name', locale),
                  href: parentCatalog
                    ? `/catalog/${parentCatalog.slug}/${currentCatalog.slug}`
                    : `/catalog/${currentCatalog.slug}`,
                },
              ]
            : []),
          { label: getLocalizedText(product, 'name', locale) },
        ]}
      />

      {/* Main Content */}
      <div className='container pb-8 md:pb-12 mt-5'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20'>
          {/* Left: Gallery */}
          <ProductGallery
            images={product.gallery
              .filter((g: any) => g.asset?.url)
              .map((g: any) => ({
                url: g.asset.url,
                displaySettings: {
                  focusPoint: g.focusPoint || undefined,
                  aspectRatio: g.aspectRatio || undefined,
                  objectFit: g.objectFit || undefined,
                },
              }))}
            name={getLocalizedText(product, 'name', locale)}
            imageRatio={product.catalog?.productImageRatio}
          />

          {/* Right: Info */}
          <ProductInfo product={product as any} contacts={contacts as any} />
        </div>
      </div>

      {/* Recommended Products */}
      <RecommendedProducts products={recommended} imageRatio={product.catalog?.productImageRatio} />
    </div>
  );
}
