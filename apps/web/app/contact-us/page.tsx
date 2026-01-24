import type { Metadata } from 'next';
import { ContactForm } from './contact-form';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { db } from '@repo/database';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { getSiteContacts } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Liên hệ | Furniture Store',
  description: 'Liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất.',
};

async function getContactInfo() {
  const [address, contacts] = await Promise.all([
    db.query.footerAddresses.findFirst({
      orderBy: (fields, { asc }) => [asc(fields.position)],
    }),
    getSiteContacts(),
  ]);

  return { address, contacts };
}

export default async function ContactResultPage() {
  const { address, contacts } = await getContactInfo();

  const breadcrumbItems = [{ label: 'Trang chủ', href: '/' }, { label: 'Liên hệ' }];

  const phones = contacts.filter(
    (c) => c.type === 'phone' || c.type === 'mobile' || c.type === 'telephone',
  );
  const emails = contacts.filter((c) => c.type === 'email');

  return (
    <>
      <AppBreadcrumb items={breadcrumbItems} />

      <div className='container mx-auto py-5 px-4 md:py-5 md:px-0'>
        <div className='max-w-6xl mx-auto'>
          <div className='mb-16 text-center'>
            <h1 className='text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6'>
              Liên Hệ
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Hãy để lại thông tin, đội ngũ tư vấn của chúng tôi sẽ liên hệ với bạn trong thời gian
              sớm nhất.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20'>
            {/* Left Column: Contact Information */}
            <div className='space-y-10'>
              <div>
                <h2 className='text-2xl font-serif font-bold text-gray-900 mb-6'>
                  Thông tin liên hệ
                </h2>
                <div className='space-y-6'>
                  {/* Address */}
                  {address && (
                    <div className='flex items-start gap-4'>
                      <div className='w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 text-[#7B0C0C]'>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-1'>
                          {address.label || 'Địa chỉ'}
                        </h3>
                        <p className='text-gray-600 leading-relaxed'>{address.address}</p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {phones.length > 0 && (
                    <div className='flex items-start gap-4'>
                      <div className='w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 text-[#7B0C0C]'>
                        <Phone size={20} />
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-1'>Điện thoại</h3>
                        <div className='flex flex-col gap-1'>
                          {phones.map((phone, idx) => (
                            <a
                              key={idx}
                              href={`tel:${phone.value.replace(/\s/g, '')}`}
                              className='text-gray-600 hover:text-[#7B0C0C] transition-colors'
                            >
                              {phone.value} {phone.label && `(${phone.label})`}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {emails.length > 0 && (
                    <div className='flex items-start gap-4'>
                      <div className='w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 text-[#7B0C0C]'>
                        <Mail size={20} />
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-1'>Email</h3>
                        <div className='flex flex-col gap-1'>
                          {emails.map((email, idx) => (
                            <a
                              key={idx}
                              href={`mailto:${email.value}`}
                              className='text-gray-600 hover:text-[#7B0C0C] transition-colors'
                            >
                              {email.value}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Working Hours (Hardcoded for now as usually static) */}
                  <div className='flex items-start gap-4'>
                    <div className='w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 text-[#7B0C0C]'>
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-1'>Giờ làm việc</h3>
                      <p className='text-gray-600'>Thứ 2 - Thứ 7: 8:00 - 17:30</p>
                      <p className='text-gray-600'>Chủ nhật: Nghỉ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed - could be fetched from siteFooter settings */}
              <div className='w-full h-[300px] bg-gray-100 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6644283833246!2d106.66613337583688!3d10.760312989387498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9023a3a85d%3A0x9259cd8741369527!2zMjgzIMWQxrDhuq1uZyAzIFRow6FuZyAyLCBQaMaw4budbmcgMTAsIFF14bqtbiAxMCwgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1710321852026!5m2!1svi!2s'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                ></iframe>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div>
              <div className='bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24'>
                <h2 className='text-2xl font-serif font-bold text-gray-900 mb-6 text-center'>
                  Gửi tin nhắn
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
