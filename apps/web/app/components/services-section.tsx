import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { ArrowRight } from 'lucide-react';
import { getLocale, getLocalizedText, getLocalizedHtml } from '@/lib/i18n';

export const ServicesSection = async () => {
  const allServices = await db.query.services.findMany({
    where: (services, { eq }) => eq(services.isActive, true),
    orderBy: (services, { desc }) => [desc(services.updatedAt)],
    with: {
      image: true,
    },
  });
  const locale = await getLocale();

  if (allServices.length === 0) return null;

  return (
    <section className='py-24 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mb-16'>
          <h2 className='text-reveal text-3xl md:text-4xl font-serif font-bold mb-6 text-gray-900'>
            {locale === 'vi' ? 'Dịch Vụ Nổi Bật' : 'Our Exceptional Services'}
          </h2>
          <p className='text-lg text-gray-600 font-light leading-relaxed'>
            {locale === 'vi'
              ? 'Chúng tôi mang đến giải pháp thiết kế nội thất toàn diện, được may đo riêng cho không gian sống của bạn.'
              : 'We offer a comprehensive range of interior design and furniture solutions tailored to your unique needs and style.'}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {allServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className='group bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1'
            >
              <div className='relative aspect-[16/10] overflow-hidden'>
                {service.image ? (
                  <Image
                    src={service.image.url}
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
                <h3 className='text-xl font-serif font-bold mb-4 text-gray-900 group-hover:text-[#7B0C0C] transition-colors'>
                  {getLocalizedText(service, 'title', locale)}
                </h3>
                {(() => {
                  const descHtml = getLocalizedHtml(service, 'descriptionHtml', locale);
                  return descHtml ? (
                    <div
                      className='text-gray-600 line-clamp-3 mb-6 text-sm leading-relaxed font-light'
                      dangerouslySetInnerHTML={{ __html: descHtml }}
                    />
                  ) : null;
                })()}
                <span className='flex items-center text-sm font-semibold tracking-wider uppercase text-[#7B0C0C] group/btn'>
                  {locale === 'vi' ? 'Khám Phá Thêm' : 'Explore More'}
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
