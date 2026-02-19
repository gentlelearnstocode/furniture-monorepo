import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCustomPageBySlug } from '@/lib/queries';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { BrandDivider } from '@/app/[locale]/components/brand-divider';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getLocalized } from '@/lib/i18n';

interface SimplePageContent {
  bannerUrl?: string;
  body: {
    paragraphHtml?: string;
    paragraphHtmlVi?: string;
  };
}

interface SimpleCustomPageProps {
  slug: string;
  locale: string;
  parentLabelKey?: string;
  parentHref?: string;
}

export async function SimpleCustomPage({
  slug,
  locale,
  parentLabelKey = 'designProject',
  parentHref = '/design-project',
}: SimpleCustomPageProps) {
  setRequestLocale(locale);

  const [page, tb] = await Promise.all([
    getCustomPageBySlug(slug),
    getTranslations({ locale, namespace: 'Breadcrumbs' }),
  ]);

  if (!page || !page.isActive) {
    notFound();
  }

  const title = getLocalized(page as any, 'title', locale);
  const content = page.content as unknown as SimplePageContent;
  const paragraphHtml = getLocalized(content.body as any, 'paragraphHtml', locale);

  return (
    <div className='min-h-screen'>
      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          { label: tb(parentLabelKey as any), href: parentHref },
          { label: title, href: `${parentHref}/${slug}` },
        ]}
      />
      <div className='relative'>
        <div className='container pt-16 pb-24 space-y-12'>
          {/* Header Section */}
          <section className='text-center space-y-8'>
            <h1 className='text-4xl md:text-6xl font-serif text-brand-neutral-900'>{title}</h1>
            <BrandDivider stretch />
          </section>

          {/* Content Section */}
          <section>
            {paragraphHtml && (
              <div
                className='prose prose-lg prose-brand font-serif leading-relaxed text-brand-neutral-700 max-w-none text-justify'
                dangerouslySetInnerHTML={{ __html: paragraphHtml }}
              />
            )}
          </section>

          {/* Banner Image */}
          {content.bannerUrl && (
            <div className='w-full relative aspect-[21/9] md:aspect-[3/1] min-h-[300px] overflow-hidden shadow-lg rounded-sm'>
              <Image
                src={content.bannerUrl}
                alt={title}
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
