import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { ContactButton } from '@/components/ui/contact-button';
import type { Metadata } from 'next';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { createCachedQuery } from '@/lib/cache';

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

// Revalidate every hour
export const revalidate = 3600;

// Generate static params for all services at build time
export async function generateStaticParams() {
  const services = await db.query.services.findMany({
    where: (services, { eq }) => eq(services.isActive, true),
    columns: { slug: true },
  });

  return routing.locales.flatMap((locale) =>
    services.map((service) => ({
      locale,
      slug: service.slug,
    })),
  );
}

const getServiceBySlug = (slug: string) =>
  createCachedQuery(
    async () => {
      return await db.query.services.findFirst({
        where: (services, { eq }) => eq(services.slug, slug),
        with: {
          image: true,
          gallery: {
            with: {
              asset: true,
            },
            orderBy: (gallery, { asc }) => [asc(gallery.position)],
          },
        },
      });
    },
    ['service-detail', slug],
    { revalidate: 3600, tags: ['services', `service-${slug}`] },
  );

import { getLocale, getLocalizedText, getLocalizedHtml } from '@/lib/i18n';
import { getSiteContacts } from '@/lib/queries';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const service = await db.query.services.findFirst({
    where: (services, { eq }) => eq(services.slug, slug),
  });

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  const title = getLocalizedText(service, 'title', locale);
  const seoTitle = getLocalizedText(service, 'seoTitle', locale);
  const seoDescription = getLocalizedText(service, 'seoDescription', locale);

  const t = await getTranslations({ locale, namespace: 'Services' });

  return {
    title: seoTitle || `${title} | Thiên Ấn Furniture Services`,
    description: seoDescription || t('seoDescription', { title }),
    keywords: getLocalizedText(service, 'seoKeywords', locale),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const service = await getServiceBySlug(slug)();
  const contacts = await getSiteContacts();
  const t = await getTranslations('Services');
  const tb = await getTranslations('Breadcrumbs');

  if (!service || !service.isActive) {
    notFound();
  }

  const primaryImage =
    service.gallery.find((g) => g.isPrimary)?.asset || service.gallery[0]?.asset || service.image;
  const galleryImages = service.gallery.map((g) => g.asset).filter(Boolean);

  const title = getLocalizedText(service, 'title', locale);
  const contentHtml = getLocalizedHtml(service, 'descriptionHtml', locale);

  return (
    <article className='min-h-screen bg-white pb-24'>
      {/* Back Link */}
      <AppBreadcrumb
        items={[
          { label: tb('home'), href: '/' },
          { label: tb('services'), href: '/services' },
          { label: title },
        ]}
      />
      <div className='container pt-6 pb-6'>
        <Link
          href='/services'
          className='inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group'
        >
          <ChevronLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
          {t('backToList')}
        </Link>
      </div>

      {/* Header */}
      <div className='container mb-12'>
        <div className='max-w-4xl'>
          <span className='block text-[#7B0C0C] font-serif italic text-lg mb-4'>
            {t('ourService')}
          </span>
          <h1 className='text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight'>
            {title}
          </h1>
        </div>
      </div>

      {/* Featured Image */}
      {primaryImage && (
        <div className='container mb-16'>
          <div className='relative aspect-[21/9] w-full overflow-hidden rounded-sm shadow-lg bg-gray-100'>
            <Image
              src={primaryImage.url}
              alt={service.title}
              fill
              className='object-cover'
              priority
              sizes='100vw'
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className='container mb-20'>
        <div className='max-w-3xl mx-auto'>
          {contentHtml && (
            <div className='prose-brand' dangerouslySetInnerHTML={{ __html: contentHtml }} />
          )}

          <div className='mt-12 flex justify-center'>
            <ContactButton
              contacts={contacts}
              label={t('consultLabel')}
              className='w-full max-w-sm'
            />
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {galleryImages.length > 1 && (
        <div className='container'>
          <div className='mb-12'>
            <h2 className='text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4'>
              {t('gallery')}
            </h2>
            <div className='h-px bg-gradient-to-r from-[#7B0C0C]/30 to-transparent w-32' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {galleryImages.map((image, index) => (
              <div
                key={image?.id || index}
                className='relative aspect-[4/3] overflow-hidden rounded-sm group'
              >
                {image && (
                  <Image
                    src={image.url}
                    alt={`${service.title} - Image ${index + 1}`}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                )}
                <div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
