import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ContactForm } from './contact-form';
import { AppBreadcrumb } from '@/components/ui/app-breadcrumb';
import { db } from '@repo/database';
import { Mail, MapPin, Clock } from 'lucide-react';
import { getSiteContacts } from '@/lib/queries';
import { getLocalizedText, getLocale } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ContactPage');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

async function getContactInfo() {
  const [address, contacts] = await Promise.all([
    db.query.footerAddresses.findFirst({
      orderBy: (fields, { asc }) => [asc(fields.position)],
    }),
    getSiteContacts(),
  ]);

  return { address, contacts };
}

const TelephoneIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 40 40'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M24 17.3337C24.0997 17.3338 24.1981 17.356 24.2881 17.3992C24.3782 17.4424 24.458 17.5057 24.5205 17.5837L29.8535 24.2488C29.9481 24.367 29.9991 24.5144 29.999 24.6658V27.3318C29.999 28.0389 29.7187 28.7175 29.2188 29.2175C28.7187 29.7175 28.0402 29.9987 27.333 29.9988H12.667C11.9598 29.9988 11.2813 29.7175 10.7813 29.2175C10.2812 28.7175 10 28.0389 10 27.3318V24.6658C9.99994 24.5144 10.0509 24.367 10.1455 24.2488L15.4795 17.5837C15.542 17.5057 15.6208 17.4424 15.7109 17.3992C15.8011 17.3559 15.9 17.3337 16 17.3337H24ZM21.0205 20.8689C20.5333 20.6671 19.9968 20.6147 19.4795 20.7175C18.9623 20.8204 18.4872 21.0742 18.1143 21.447C17.7414 21.8198 17.4877 22.2952 17.3848 22.8123C17.2819 23.3295 17.3343 23.8661 17.5361 24.3533C17.738 24.8404 18.0801 25.2566 18.5186 25.5496C18.957 25.8425 19.4727 25.9988 20 25.9988C20.7071 25.9987 21.3857 25.7185 21.8857 25.2185C22.3858 24.7185 22.666 24.0399 22.666 23.3328C22.666 22.8054 22.5098 22.2898 22.2168 21.8513C21.9238 21.4129 21.5077 21.0707 21.0205 20.8689ZM27.0195 10.0007C27.5101 10.0007 27.9916 10.1357 28.4102 10.3914C28.8525 10.6805 29.2048 11.0896 29.4248 11.5701C29.6447 12.0504 29.7244 12.5836 29.6543 13.1072L29.3984 15.406C29.3804 15.5691 29.3029 15.7204 29.1807 15.8298C29.0585 15.9392 28.9003 15.9997 28.7363 15.9998H25.8535C25.7049 15.9998 25.5605 15.9496 25.4434 15.8582C25.3263 15.7667 25.2431 15.639 25.207 15.4949L24.666 13.3337H15.333L14.792 15.4949C14.7559 15.639 14.6727 15.7667 14.5557 15.8582C14.4385 15.9496 14.2941 15.9998 14.1455 15.9998H11.2666C11.1018 16.0008 10.9424 15.9404 10.8193 15.8308C10.6962 15.7213 10.6177 15.5698 10.5996 15.406L10.3291 12.9617C10.2744 12.4732 10.356 11.979 10.5645 11.5339C10.8033 11.0627 11.1707 10.6685 11.624 10.3972C12.0773 10.126 12.5979 9.98863 13.126 10.0007H27.0195Z'
      fill='currentColor'
    />
  </svg>
);

export default async function ContactResultPage() {
  const t = await getTranslations('ContactPage');
  const tCommon = await getTranslations('Common');
  const locale = await getLocale();
  const { address, contacts } = await getContactInfo();

  const breadcrumbItems = [{ label: tCommon('home'), href: '/' }, { label: t('title') }];

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
              {t('title')}
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>{t('description')}</p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20'>
            {/* Left Column: Contact Information */}
            <div className='space-y-10'>
              <div>
                <h2 className='text-2xl font-serif font-bold text-gray-900 mb-6'>
                  {t('contactInfo')}
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
                          {getLocalizedText(address, 'label', locale) || t('address')}
                        </h3>
                        <p className='text-gray-600 leading-relaxed'>
                          {getLocalizedText(address, 'address', locale)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {phones.length > 0 && (
                    <div className='flex items-start gap-4'>
                      <div className='w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 text-[#7B0C0C]'>
                        <TelephoneIcon size={24} />
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900 mb-1'>{t('phone')}</h3>
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
                        <h3 className='font-semibold text-gray-900 mb-1'>{t('email')}</h3>
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

                  {/* Working Hours */}
                  <div className='flex items-start gap-4'>
                    <div className='w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 text-[#7B0C0C]'>
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-1'>{t('workingHours')}</h3>
                      <p className='text-gray-600'>{t('workingTime')}</p>
                      <p className='text-gray-600'>{t('sunday')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
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
                  {t('sendMessage')}
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
