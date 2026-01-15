import { notFound } from 'next/navigation';
import { db } from '@repo/database';
import { ProductGallery } from './components/product-gallery';
import { ProductInfo } from './components/product-info';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { createCachedQuery } from '@/lib/cache';
import { getSiteContacts } from '@/lib/queries';

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

const getProductBySlug = (slug: string) =>
  createCachedQuery(
    async () => {
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
    ['product-detail', slug],
    { revalidate: 3600, tags: ['products', `product-${slug}`] }
  );

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug)();
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
          { label: 'Home Page', href: '/' },
          ...(parentCatalog
            ? [{ label: parentCatalog.name, href: `/catalog/${parentCatalog.slug}` }]
            : []),
          ...(currentCatalog
            ? [
                {
                  label: currentCatalog.name,
                  href: parentCatalog
                    ? `/catalog/${parentCatalog.slug}/${currentCatalog.slug}`
                    : `/catalog/${currentCatalog.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      {/* Main Content */}
      <div className='container mx-auto px-4 pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20'>
          {/* Left: Gallery */}
          <ProductGallery
            images={product.gallery.map((g) => g.asset?.url).filter((url): url is string => !!url)}
            name={product.name}
          />

          {/* Right: Info */}
          <ProductInfo product={product} contacts={contacts} />
        </div>
      </div>
    </div>
  );
}
