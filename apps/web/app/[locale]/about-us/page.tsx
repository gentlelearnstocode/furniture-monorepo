import { getCustomPageBySlug } from '@/lib/queries';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { BrandDivider } from '@/app/[locale]/components/brand-divider';
import { ArrowRight } from 'lucide-react';
import { RunningBanner } from '@/app/[locale]/components/running-banner';
import { ProcessSection } from '@/app/[locale]/components/process-section';
import { PdfReaderWrapper } from '@/app/[locale]/components/pdf-reader-wrapper';
import { getLocalized } from '@/lib/i18n';
import type { Metadata } from 'next';
import { type CustomPage, type AboutUsPageContent } from '@repo/shared';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('aboutUs.title'),
    description: t('aboutUs.description'),
  };
}

export default async function AboutUsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = (await getCustomPageBySlug('about-us')) as CustomPage | undefined;
  const tb = await getTranslations('Breadcrumbs');
  const tCommon = await getTranslations('Common');

  const title = getLocalized(page || { title: '' }, 'title', locale);
  const content = (page?.content || {}) as AboutUsPageContent;
  const bannerUrl = content.bannerUrl;
  const pdfUrl = content.pdfUrl;

  const paragraphHtml = getLocalized(
    (content?.body || { paragraphHtml: '' }) as Record<string, unknown>,
    'paragraphHtml',
    locale,
  );

  return (
    <main className='relative min-h-screen bg-white'>
      {/* Top section with background pattern */}
      <div className='relative'>
        <div
          className='absolute inset-0 -z-10'
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('/nav-bg.png')`,
            backgroundColor: 'white',
            backgroundPosition: '50%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        />

        <AppBreadcrumb
          items={[
            { label: tb('home'), href: '/' },
            { label: tb('aboutUs'), href: '/about-us' },
          ]}
        />

        <div className='container mx-auto px-2 md:px-4 py-8'>
          <div className='mt-8 max-w-7xl mx-auto space-y-12 pb-10'>
            {/* Main Hero Image */}
            {bannerUrl && (
              <div className='relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden shadow-xl'>
                <Image
                  src={bannerUrl}
                  alt={title || 'About Us'}
                  fill
                  className='object-cover'
                  priority
                />
              </div>
            )}
            {/* Brand Header */}
            <div className='flex flex-col items-center space-y-4'>
              <h1 className='text-3xl md:text-5xl font-serif font-bold text-[#B80022] text-center tracking-wide'>
                {tCommon('brandName')}
              </h1>
            </div>
            <BrandDivider stretch />
            <div className='max-w-5xl mx-auto'>
              <div
                className='prose prose-lg max-w-none text-brand-neutral-700 font-serif leading-relaxed text-left md:text-justify'
                dangerouslySetInnerHTML={{
                  __html: paragraphHtml || '',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Process Section - Clean white background */}
      <ProcessSection />

      {/* Running Banner */}
      <RunningBanner />

      {/* PDF Reader Section - Clean white background */}
      {pdfUrl && (
        <div className='bg-white pt-10 pb-16'>
          <div className='container mx-auto px-2 md:px-4'>
            <div className='max-w-7xl mx-auto'>
              <PdfReaderWrapper pdfUrl={pdfUrl} />

              {/* Expand Your View Link */}
              <div className='flex justify-center mt-12'>
                <a
                  href={pdfUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group flex items-center gap-2 text-[13px] font-medium tracking-wider text-gray-700 hover:text-brand-primary-800 transition-colors uppercase'
                >
                  <span className='font-serif font-bold tracking-widest'>
                    {(await getTranslations('Common'))('expandYourView')}
                  </span>
                  <div className='w-6 h-6 rounded-full border border-current flex items-center justify-center transition-transform group-hover:translate-x-1'>
                    <ArrowRight size={14} />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
