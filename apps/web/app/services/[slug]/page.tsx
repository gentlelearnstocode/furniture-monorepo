export const dynamic = 'force-dynamic';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await db.query.services.findFirst({
    where: (services, { eq }) => eq(services.slug, slug),
  });

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: service.seoTitle || `${service.title} | Thien An Furniture Services`,
    description: service.seoDescription || `Learn more about our ${service.title} service`,
    keywords: service.seoKeywords,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await db.query.services.findFirst({
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

  if (!service || !service.isActive) {
    notFound();
  }

  const primaryImage =
    service.gallery.find((g) => g.isPrimary)?.asset || service.gallery[0]?.asset || service.image;
  const galleryImages = service.gallery.map((g) => g.asset).filter(Boolean);

  return (
    <article className='min-h-screen bg-white pb-24'>
      {/* Back Link */}
      <div className='container mx-auto px-4 pt-12 pb-8'>
        <Link
          href='/services'
          className='inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group'
        >
          <ChevronLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
          Back to all services
        </Link>
      </div>

      <AppBreadcrumb
        items={[
          { label: 'Home Page', href: '/' },
          { label: 'Services', href: '/services' },
          { label: service.title },
        ]}
      />

      {/* Header */}
      <div className='container mx-auto px-4 mb-12'>
        <div className='max-w-4xl'>
          <span className='block text-[#7B0C0C] font-serif italic text-lg mb-4'>Our Service</span>
          <h1 className='text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight'>
            {service.title}
          </h1>
        </div>
      </div>

      {/* Featured Image */}
      {primaryImage && (
        <div className='container mx-auto px-4 mb-16'>
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
      <div className='container mx-auto px-4 mb-20'>
        <div className='max-w-3xl mx-auto'>
          <div
            className='prose prose-lg prose-gray max-w-none font-light leading-relaxed
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900
              prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-[#7B0C0C] hover:prose-a:underline'
            dangerouslySetInnerHTML={{ __html: service.descriptionHtml }}
          />
        </div>
      </div>

      {/* Image Gallery */}
      {galleryImages.length > 1 && (
        <div className='container mx-auto px-4'>
          <div className='mb-12'>
            <h2 className='text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4'>
              Service Gallery
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
