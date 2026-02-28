import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getLocalized } from '@/lib/i18n';
import type { Metadata } from 'next';
import { getCustomPageBySlug } from '@/lib/queries';
import { type ExportsPageContent, type CustomPage, type ShowcaseImage } from '@repo/shared';

import { SectionSeparator } from '../components/section-separator';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Breadcrumbs' });
  return {
    title: `${t('exports')} | Thien An Furniture`,
    description: 'Furniture export services and international quality standards.',
  };
}

export default async function ExportsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const slug = 'exports';
  const [page, tb] = await Promise.all([
    getCustomPageBySlug(slug) as Promise<CustomPage | undefined>,
    getTranslations('Breadcrumbs'),
  ]);

  if (!page) {
    notFound();
  }

  const content = page.content as ExportsPageContent;
  const showcaseImages = content.body.images || [];
  const footerImageUrl = content.footer.imageUrl;

  const title = getLocalized(page, 'title', locale);
  const headerIntroHtml = getLocalized(content.header, 'introHtml', locale);
  const bodyIntroHtml = getLocalized(content.body, 'introHtml', locale);
  const bodyParagraphHtml = getLocalized(content.body, 'paragraphHtml', locale);
  const footerTextHtml = getLocalized(content.footer, 'textHtml', locale);

  return (
    <div className='min-h-screen'>
      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          { label: tb('exports'), href: '/exports' },
        ]}
      />
      <div className='relative'>
        <div
          className='absolute inset-0 -z-10'
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('/nav-bg.png')`,
            backgroundColor: 'white',
            backgroundPosition: '50%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        />

        <div className='container pt-10 pb-0 space-y-16'>
          {/* Header Section: Hero */}
          <section className='max-w-4xl mx-auto text-center space-y-8'>
            <h1 className='text-3xl md:text-5xl font-serif text-brand-neutral-900'>{title}</h1>
            <div
              className='prose prose-lg max-w-none text-brand-neutral-600 font-serif leading-relaxed'
              dangerouslySetInnerHTML={{ __html: headerIntroHtml }}
            />
          </section>

          <SectionSeparator />

          {/* Body Section: Showcase */}
          <section className='space-y-12'>
            {bodyIntroHtml && (
              <div
                className='max-w-4xl mx-auto prose prose-brand font-serif leading-relaxed text-brand-neutral-700'
                dangerouslySetInnerHTML={{ __html: bodyIntroHtml }}
              />
            )}

            <div className='flex flex-col gap-12'>
              {showcaseImages
                .filter((image: ShowcaseImage) => !image.isPrimary)
                .map((image: ShowcaseImage) => (
                  <div key={image.assetId} className='w-full relative'>
                    <Image
                      src={image.url}
                      alt='Showcase image'
                      width={1600}
                      height={900}
                      className='w-full h-auto object-contain'
                      style={{
                        objectPosition: image.focusPoint
                          ? `${image.focusPoint.x}% ${image.focusPoint.y}%`
                          : '50% 50%',
                      }}
                    />
                  </div>
                ))}
            </div>

            {bodyParagraphHtml && (
              <div
                className='max-w-4xl mx-auto prose prose-brand font-serif leading-relaxed text-brand-neutral-700'
                dangerouslySetInnerHTML={{ __html: bodyParagraphHtml }}
              />
            )}

            {/* Primary Image displayed after the paragraph */}
            {(() => {
              const primaryImage = showcaseImages.find((image: ShowcaseImage) => image.isPrimary);
              if (!primaryImage) return null;

              return (
                <div className='w-full relative'>
                  <Image
                    src={primaryImage.url}
                    alt='Primary showcase image'
                    width={1600}
                    height={900}
                    className='w-full h-auto object-contain'
                    style={{
                      objectPosition: primaryImage.focusPoint
                        ? `${primaryImage.focusPoint.x}% ${primaryImage.focusPoint.y}%`
                        : '50% 50%',
                    }}
                  />
                </div>
              );
            })()}
          </section>

          {/* Footer Image moved inside the patterned container */}
          {footerImageUrl && (
            <div className='w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] aspect-[21/9] md:aspect-[3/1] min-h-[400px] overflow-hidden shadow-lg mt-24'>
              <Image src={footerImageUrl} alt='Closing image' fill className='object-cover' />
            </div>
          )}
        </div>
      </div>

      <div className='container py-0 space-y-24'>
        {/* Footer Section: Closing Text */}
        <section className='flex flex-col gap-12'>
          <div className='w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white/40 backdrop-blur-sm p-8 md:p-12 border-y border-white/50'>
            <div
              className='prose prose-lg font-serif leading-relaxed text-brand-neutral-800 max-w-none'
              dangerouslySetInnerHTML={{ __html: footerTextHtml }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
