import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ShowroomItem } from './showroom-item';
import { getCustomPageBySlug, getShowrooms } from '@/lib/queries';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getLocalized } from '@/lib/i18n';
import type { Metadata } from 'next';
import { type ShowroomPageContent, type ShowcaseImage } from '@repo/shared';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Breadcrumbs' });
  return {
    title: `${t('showroomFactory')} | Thien An Furniture`,
    description: 'Explore our exquisite showroom and state-of-the-art manufacturing factory.',
  };
}

export default async function ShowroomFactoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await getCustomPageBySlug('showroom-factory');
  const showrooms = await getShowrooms();
  const tb = await getTranslations('Breadcrumbs');

  // If page is not active or doesn't exist, return 404
  if (!page || !page.isActive) return notFound();

  // Cast content to expected shape
  const content = page.content as ShowroomPageContent;
  const header = content?.header || { introHtml: '', images: [] };
  const introHtml = getLocalized(header, 'introHtml', locale);
  const headerImages = header.images || [];

  return (
    <div className='min-h-screen bg-white'>
      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          { label: tb('showroomFactory'), href: '/showroom-factory' },
        ]}
      />

      {/* Header Images Grid */}
      {headerImages.length > 0 && (
        <div className='w-full relative py-12 md:py-20 bg-[#141414] overflow-hidden'>
          {/* Pattern with reduced opacity */}
          <div
            className='absolute inset-0 opacity-20'
            style={{
              background: "url('/nav-bg.png') 100% / cover no-repeat",
            }}
          />
          {/* Dark overlay to ensure text readability and match design vibe */}
          <div className='absolute inset-0 bg-black/40' />

          <div className='relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1440px] mx-auto p-4 md:p-8 items-start'>
            {headerImages.slice(0, 4).map((img: ShowcaseImage, idx: number) => (
              <div
                key={idx}
                className={`relative aspect-[9/16] md:aspect-[3/5] w-full overflow-hidden rounded-sm shadow-2xl transition-all duration-500 
                  ${idx % 2 === 1 ? 'mt-12 md:mt-16' : ''}
                `}
              >
                <Image
                  src={img.url}
                  alt={`Showroom header ${idx + 1}`}
                  fill
                  className='object-cover hover:scale-110 transition-transform duration-700'
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content with Pattern Background */}
      <div className='relative'>
        {/* Subtle background pattern */}
        <div
          className='absolute inset-0 opacity-[0.2] pointer-events-none'
          style={{
            backgroundImage: "url('/nav-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className='container relative z-10 pb-20 space-y-16 pt-10'>
          {/* Intro Section */}
          <section className='mx-auto'>
            <div className='grid md:grid-cols-12 gap-10 md:gap-20 items-start'>
              {/* Left Column: Title & Brand Block */}
              <div className='md:col-span-12 lg:col-span-5 space-y-6'>
                <div className='space-y-2'>
                  <h2 className='text-2xl md:text-xl text-neutral-400 uppercase tracking-wide'>
                    KHÁM PHÁ
                  </h2>
                </div>

                <div className='text-2xl md:text-3xl lg:text-4xl leading-none'>
                  <span className='text-[#b80022] block font-bold tracking-tight'>THIÊN ẤN</span>
                  <span className='text-[#222] block font-bold tracking-tight'>SHOWROOM</span>
                </div>
              </div>

              {/* Right Column: Description */}
              <div className='md:col-span-12 lg:col-span-7 pt-2'>
                {introHtml && (
                  <div
                    className='prose prose-lg prose-neutral text-neutral-600 leading-relaxed max-w-none text-justify'
                    dangerouslySetInnerHTML={{ __html: introHtml }}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Showrooms List */}
          <section className='space-y-20'>
            {showrooms.length > 0
              ? showrooms.map((showroom, index) => (
                  <ShowroomItem key={showroom.id} showroom={showroom} index={index} />
                ))
              : null}
          </section>
        </div>
      </div>
    </div>
  );
}
