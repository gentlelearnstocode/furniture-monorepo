import { notFound } from 'next/navigation';
import { db } from '@repo/database';
import { ProductGallery } from './components/product-gallery';
import { ProductInfo } from './components/product-info';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { createCachedQuery } from '@/lib/cache';
import { getSiteContacts } from '@/lib/queries';
import { getLocale, getLocalizedText } from '@/lib/i18n';

// Revalidate every hour
export const revalidate = 3600;

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
  { revalidate: 3600, tags: ['products'] },
);

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();

  const product = await getProductBySlug(slug);
  const contacts = await getSiteContacts();

  if (!product) {
    notFound();
  }

  const parentCatalog = product.catalog?.parent;
  const currentCatalog = product.catalog;

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#FDFCFB] via-white to-[#FDFCFB]'>
      <AppBreadcrumb
        items={[
          { label: locale === 'vi' ? 'Trang chủ' : 'Home Page', href: '/' },
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
      <div className='container mx-auto px-4 pb-20'>
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
            name={product.name}
          />

          {/* Right: Info */}
          <ProductInfo product={product as any} contacts={contacts as any} />
        </div>
      </div>
    </div>
  );
}
