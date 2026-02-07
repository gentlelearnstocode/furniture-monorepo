import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCustomPageBySlug } from '@/lib/queries';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { BrandDivider } from '@/app/components/brand-divider';

interface SimplePageContent {
  bannerUrl?: string;
  body: {
    paragraphHtml?: string;
  };
}

interface SimpleCustomPageProps {
  slug: string;
  parentLabel?: string;
  parentHref?: string;
}

export async function SimpleCustomPage({
  slug,
  parentLabel = 'Design & Project',
  parentHref = '/design-project',
}: SimpleCustomPageProps) {
  const page = await getCustomPageBySlug(slug);

  if (!page || !page.isActive) {
    notFound();
  }

  const content = page.content as unknown as SimplePageContent;

  return (
    <div className='min-h-screen'>
      <AppBreadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: parentLabel, href: parentHref },
          { label: page.title, href: `${parentHref}/${slug}` },
        ]}
      />
      <div className='relative'>
        <div className='container pt-16 pb-24 space-y-12'>
          {/* Header Section */}
          <section className='text-center space-y-8'>
            <h1 className='text-4xl md:text-6xl font-serif text-brand-neutral-900'>{page.title}</h1>
            <BrandDivider stretch />
          </section>

          {/* Content Section */}
          <section>
            {content.body.paragraphHtml && (
              <div
                className='prose prose-lg prose-brand font-serif leading-relaxed text-brand-neutral-700 max-w-none text-justify'
                dangerouslySetInnerHTML={{ __html: content.body.paragraphHtml }}
              />
            )}
          </section>

          {/* Banner Image */}
          {content.bannerUrl && (
            <div className='w-full relative aspect-[21/9] md:aspect-[3/1] min-h-[300px] overflow-hidden shadow-lg rounded-sm'>
              <Image
                src={content.bannerUrl}
                alt={page.title}
                fill
                className='object-cover'
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
