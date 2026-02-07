import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { db } from '@repo/database';
import { createCachedQuery } from '@/lib/cache';

import { SectionSeparator } from '../components/section-separator';
import { ProjectSlider } from '../components/project-slider';
import { AppBreadcrumb } from '../../components/ui/app-breadcrumb';
import { BrandDivider } from '../components/brand-divider';

async function getPageData(slug: string) {
  const page = await db.query.customPages.findFirst({
    where: (pages, { eq, and }) => and(eq(pages.slug, slug), eq(pages.isActive, true)),
  });
  return page;
}

const getProjects = createCachedQuery(
  async () =>
    await db.query.projects.findMany({
      where: (projects, { eq }) => eq(projects.isActive, true),
      orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
      limit: 6,
      with: {
        image: true,
      },
    }),
  ['projects-design-manufacturing'],
  { revalidate: 3600, tags: ['projects'] },
);

interface ImageFocusPoint {
  x: number;
  y: number;
}

interface PageImage {
  assetId: string;
  url: string;
  isPrimary?: boolean;
  focusPoint?: ImageFocusPoint;
}

interface PageContent {
  header: {
    introHtml: string;
    buttonLink?: string;
    buttonText?: string;
    button2Link?: string;
    button2Text?: string;
  };
  body: {
    introHtml?: string;
    paragraphHtml?: string;
    images?: PageImage[];
  };
  footer: {
    imageUrl?: string;
    textHtml: string;
  };
}

export default async function DesignProjectPage() {
  const slug = 'design-project';
  const [page, projects, t] = await Promise.all([
    getPageData(slug),
    getProjects(),
    getTranslations('Projects'),
  ]);

  if (!page) {
    notFound();
  }

  const content = page.content as unknown as PageContent;
  const showcaseImages = content.body.images || [];
  const footerImageUrl = content.footer.imageUrl;

  return (
    <div className='min-h-screen'>
      <AppBreadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: page.title, href: '/design-project' },
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
        <div className='container pt-16 pb-0 space-y-24'>
          {/* Header Section: Hero */}
          <section className='max-w-7xl mx-auto text-center space-y-8'>
            <h1 className='text-4xl md:text-6xl font-serif text-brand-neutral-900'>{page.title}</h1>
            <BrandDivider stretch />
            <div
              className='prose prose-lg max-w-none text-brand-neutral-600 font-serif leading-relaxed'
              dangerouslySetInnerHTML={{ __html: content.header.introHtml }}
            />
            <div className='w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-stretch'>
              {content.header.buttonLink && (
                <Link
                  href={content.header.buttonLink}
                  className='flex-1 inline-flex justify-center items-center bg-[#F9F9F9]/80 backdrop-blur-sm border border-[#E5E5E5] text-brand-neutral-900 px-12 py-5 rounded-none hover:bg-[#B80022] hover:border-[#B80022] hover:text-white transition-all duration-300 font-serif text-[16px] uppercase tracking-wider min-w-[300px]'
                >
                  {content.header.buttonText || 'Request a design consultation'}
                </Link>
              )}
              {content.header.button2Link && (
                <Link
                  href={content.header.button2Link}
                  className='flex-1 inline-flex justify-center items-center bg-[#F9F9F9]/80 backdrop-blur-sm border border-[#E5E5E5] text-brand-neutral-900 px-12 py-5 rounded-none hover:bg-[#B80022] hover:border-[#B80022] hover:text-white transition-all duration-300 font-serif text-[16px] uppercase tracking-wider min-w-[300px]'
                >
                  {content.header.button2Text || 'View Projects'}
                </Link>
              )}
            </div>
          </section>

          <SectionSeparator />

          {/* Body Section: Showcase */}
          <section className='space-y-12'>
            {content.body.introHtml && (
              <div
                className='max-w-7xl mx-auto prose prose-brand font-serif leading-relaxed text-brand-neutral-700'
                dangerouslySetInnerHTML={{ __html: content.body.introHtml }}
              />
            )}

            <div className='flex flex-col gap-12'>
              {showcaseImages
                .filter((image) => !image.isPrimary)
                .map((image) => (
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

            {content.body.paragraphHtml && (
              <div
                className='max-w-7xl mx-auto prose prose-brand font-serif leading-relaxed text-brand-neutral-700'
                dangerouslySetInnerHTML={{ __html: content.body.paragraphHtml }}
              />
            )}

            {/* Primary Image displayed after the paragraph */}
            {showcaseImages.find((image) => image.isPrimary) && (
              <div className='w-full relative'>
                <Image
                  src={showcaseImages.find((image) => image.isPrimary)!.url}
                  alt='Primary showcase image'
                  width={1600}
                  height={900}
                  className='w-full h-auto object-contain'
                  style={{
                    objectPosition: showcaseImages.find((image) => image.isPrimary)!.focusPoint
                      ? `${showcaseImages.find((image) => image.isPrimary)!.focusPoint!.x}% ${
                          showcaseImages.find((image) => image.isPrimary)!.focusPoint!.y
                        }%`
                      : '50% 50%',
                  }}
                />
              </div>
            )}
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
              dangerouslySetInnerHTML={{ __html: content.footer.textHtml }}
            />
          </div>
        </section>
      </div>

      {projects.length > 0 && (
        <section className='w-full py-24'>
          <div className='container'>
            {/* Section Header */}
            <div className='flex flex-col items-center mb-12'>
              <h2 className='text-[40px] md:text-[64px] font-serif font-bold text-brand-neutral-900 leading-[100%] text-center uppercase tracking-normal'>
                {t('title')}
              </h2>

              {/* Decorative divider with symbol */}
              <div className='flex items-center gap-3 mt-4'>
                <div className='w-12 h-[1px] bg-brand-neutral-900' />
                <Image
                  src='/symbol.svg'
                  alt='decorative symbol'
                  width={20}
                  height={20}
                  className='opacity-100'
                />
                <div className='w-12 h-[1px] bg-brand-neutral-900' />
              </div>
            </div>

            <ProjectSlider projects={projects} />
          </div>
        </section>
      )}
    </div>
  );
}
