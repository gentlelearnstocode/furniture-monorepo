import { notFound } from 'next/navigation';
import { db } from '@repo/database';
import { ProductGallery } from './components/product-gallery';
import { ProductInfo } from './components/product-info';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.query.products.findFirst({
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
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}
