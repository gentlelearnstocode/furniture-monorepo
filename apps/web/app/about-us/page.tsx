import { getCustomPageBySlug } from '@/lib/queries';
import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { BrandDivider } from '@/app/components/brand-divider';
import { ArrowRight } from 'lucide-react';
import { RunningBanner } from '@/app/components/running-banner';
import { ProcessSection } from '@/app/components/process-section';
import { PdfReaderWrapper } from '@/app/components/pdf-reader-wrapper';

export default async function AboutUsPage() {
  const page = await getCustomPageBySlug('about-us');
  const t = await getTranslations('AboutUs');
  const tCommon = await getTranslations('Common');
  const locale = await getLocale();

  const title = locale === 'vi' ? page?.titleVi || page?.title : page?.title;
  const content = (page?.content || {}) as {
    bannerUrl?: string;
    pdfUrl?: string;
    body?: {
      paragraphHtml?: string;
      paragraphHtmlVi?: string;
    };
  };
  const bannerUrl = content.bannerUrl;
  const pdfUrl = content.pdfUrl;

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

        <div className='container mx-auto px-2 md:px-4 py-8'>
          <AppBreadcrumb
            items={[
              { label: t('home'), href: '/' },
              { label: title || t('title'), href: '/about-us' },
            ]}
          />

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
              <h1 className='text-3xl md:text-5xl font-serif font-bold text-[#B80022] text-center uppercase tracking-wide'>
                {tCommon('brandName')}
              </h1>
            </div>
            <BrandDivider stretch />
            <div className='max-w-5xl mx-auto'>
              <div
                className='prose prose-lg max-w-none text-brand-neutral-700 font-serif leading-relaxed text-left md:text-justify'
                dangerouslySetInnerHTML={{
                  __html:
                    (locale === 'vi'
                      ? content?.body?.paragraphHtmlVi
                      : content?.body?.paragraphHtml) ||
                    content?.body?.paragraphHtml ||
                    '',
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
