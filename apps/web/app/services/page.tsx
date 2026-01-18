import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { createCachedQuery } from '@/lib/cache';

export const metadata: Metadata = {
  title: 'Services | Thien An Furniture',
  description:
    'Explore our comprehensive range of interior design and furniture services tailored to your needs.',
};

// Revalidate every hour
export const revalidate = 3600;

const getServices = createCachedQuery(
  async () => {
    return await db.query.services.findMany({
      where: (services, { eq }) => eq(services.isActive, true),
      orderBy: (services, { desc }) => [desc(services.updatedAt)],
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
  ['services-list'],
  { revalidate: 3600, tags: ['services'] },
);

export default async function ServicesListingPage() {
  const services = await getServices();

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Header */}
      <div className='bg-gray-50 py-24 border-b border-gray-100'>
        <div className='container mx-auto px-4'>
          <h1 className='text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6'>
            Our Services
          </h1>
          <p className='text-xl text-gray-600 font-light max-w-2xl leading-relaxed'>
            We offer a comprehensive range of interior design and furniture solutions tailored to
            your unique needs and style.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <AppBreadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Dịch vụ', href: '/services' },
        ]}
      />
      <div className='container mx-auto px-4 pt-6 pb-12'>
        {services.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-gray-500 text-lg'>No services available. Check back soon!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {services.map((service) => {
              const primaryImage = service.gallery.find((g) => g.isPrimary)?.asset || service.image;

              return (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className='group bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1'
                >
                  <div className='relative aspect-[16/10] overflow-hidden'>
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={service.title}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />
                    ) : (
                      <div className='absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400'>
                        No Image
                      </div>
                    )}
                    <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  </div>

                  <div className='p-8'>
                    <h3 className='text-2xl font-serif font-bold mb-4 text-gray-900 group-hover:text-[#7B0C0C] transition-colors'>
                      {service.title}
                    </h3>
                    <div
                      className='text-gray-600 line-clamp-3 mb-6 text-sm leading-relaxed font-light'
                      dangerouslySetInnerHTML={{ __html: service.descriptionHtml }}
                    />
                    <span className='flex items-center text-sm font-semibold tracking-wider uppercase text-[#7B0C0C] group/btn'>
                      Explore More
                      <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
