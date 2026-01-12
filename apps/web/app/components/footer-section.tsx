import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { MapPin, Phone, Mail, Facebook, Youtube } from 'lucide-react';

export const Footer = async () => {
  // Fetch footer settings
  const footerData = await db.query.siteFooter.findFirst({
    orderBy: (footer, { desc }) => [desc(footer.updatedAt)],
  });

  const addresses = await db.query.footerAddresses.findMany({
    orderBy: (addr, { asc }) => [asc(addr.position)],
  });

  const contacts = await db.query.footerContacts.findMany({
    orderBy: (contact, { asc }) => [asc(contact.position)],
  });

  // Fetch level 1 catalogs
  const catalogs = await db.query.catalogs.findMany({
    where: (catalogs, { isNull }) => isNull(catalogs.parentId),
    orderBy: (catalogs, { asc }) => [asc(catalogs.name)],
  });

  // Fetch active services
  const services = await db.query.services.findMany({
    where: (services, { eq }) => eq(services.isActive, true),
    orderBy: (services, { asc }) => [asc(services.title)],
  });

  const phoneContacts = contacts.filter((c) => c.type === 'phone');
  const emailContacts = contacts.filter((c) => c.type === 'email');

  return (
    <footer className='bg-[#f5f1eb] border-t border-gray-200'>
      {/* Main Footer Content */}
      <div className='container mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Left Column - Logo, Intro, Addresses, Contacts, Contact Form */}
          <div className='space-y-8'>
            {/* Logo */}
            <Link href='/' className='inline-block'>
              <Image
                src='/logo.svg'
                alt='Thien An Furniture'
                width={120}
                height={80}
                className='h-20 w-auto'
              />
            </Link>

            {/* Intro Title */}
            {footerData?.intro && (
              <h3 className='text-2xl font-serif font-bold text-[#7B0C0C] uppercase tracking-wide'>
                {footerData.intro}
              </h3>
            )}

            {/* Description */}
            {footerData?.description && (
              <p className='text-sm text-gray-700 leading-relaxed italic font-serif'>
                &ldquo;{footerData.description}&rdquo;
              </p>
            )}

            {/* Addresses */}
            {addresses.length > 0 && (
              <div className='space-y-4'>
                {addresses.map((addr) => (
                  <div key={addr.id} className='flex items-start gap-3'>
                    <MapPin className='h-4 w-4 text-[#7B0C0C] mt-1 flex-shrink-0' />
                    <div className='text-sm text-gray-700'>
                      <span className='font-semibold'>{addr.label}:</span> {addr.address}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Phone Numbers */}
            {phoneContacts.length > 0 && (
              <div className='space-y-2'>
                {phoneContacts.map((phone) => (
                  <div key={phone.id} className='flex items-center gap-3'>
                    <Phone className='h-4 w-4 text-[#7B0C0C] flex-shrink-0' />
                    <div className='text-sm text-gray-700'>
                      {phone.label && <span className='font-semibold'>{phone.label}: </span>}
                      <a
                        href={`tel:${phone.value.replace(/\s/g, '')}`}
                        className='hover:text-[#7B0C0C]'
                      >
                        {phone.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Emails */}
            {emailContacts.length > 0 && (
              <div className='space-y-2'>
                {emailContacts.map((email) => (
                  <div key={email.id} className='flex items-center gap-3'>
                    <Mail className='h-4 w-4 text-[#7B0C0C] flex-shrink-0' />
                    <a
                      href={`mailto:${email.value}`}
                      className='text-sm text-gray-700 hover:text-[#7B0C0C]'
                    >
                      {email.value}
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Newsletter Signup / Contact Form */}
            <div className='pt-6'>
              <form className='flex flex-col sm:flex-row gap-2'>
                <input
                  type='email'
                  placeholder='Địa chỉ Email/SĐT'
                  className='flex-1 px-4 py-3 text-sm border border-gray-300 bg-white focus:outline-none focus:border-[#7B0C0C] placeholder:text-gray-400'
                />
                <button
                  type='submit'
                  className='px-6 py-3 bg-[#7B0C0C] text-white text-sm font-semibold uppercase tracking-wider hover:bg-[#5a0909] transition-colors whitespace-nowrap'
                >
                  Đăng ký tư vấn
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Map + Catalog & Services */}
          <div className='space-y-8'>
            {/* Map - Full Width of Column */}
            <div className='w-full aspect-video md:aspect-[4/3] bg-gray-200 overflow-hidden rounded-sm'>
              {footerData?.mapEmbedUrl ? (
                <iframe
                  src={footerData.mapEmbedUrl}
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title='Location Map'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400'>
                  <div className='text-center'>
                    <MapPin className='h-12 w-12 mx-auto mb-2' />
                    <p className='text-sm'>Map will be displayed here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Catalog & Services Grid - Below Map */}
            <div className='grid grid-cols-2 gap-8'>
              {/* Catalog Links */}
              <div>
                <h4 className='text-lg font-serif font-bold text-gray-900 mb-6'>Catalog</h4>
                <ul className='space-y-3'>
                  {catalogs.map((catalog) => (
                    <li key={catalog.id}>
                      <Link
                        href={`/catalog/${catalog.slug}`}
                        className='text-sm text-gray-600 hover:text-[#7B0C0C] transition-colors'
                      >
                        {catalog.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services Links */}
              <div>
                <h4 className='text-lg font-serif font-bold text-gray-900 mb-6'>Services</h4>
                <ul className='space-y-3'>
                  {services.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/services/${service.slug}`}
                        className='text-sm text-gray-600 hover:text-[#7B0C0C] transition-colors'
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-300'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            {/* Policy Links */}
            <div className='flex items-center gap-6 text-sm text-gray-500'>
              <Link href='/privacy' className='hover:text-gray-900 transition-colors'>
                Chính sách bảo mật
              </Link>
              <span className='text-gray-300'>|</span>
              <Link href='/terms' className='hover:text-gray-900 transition-colors'>
                Điều khoản sử dụng
              </Link>
              <span className='text-gray-300'>|</span>
              <Link href='/legal' className='hover:text-gray-900 transition-colors'>
                Thông tin pháp lý
              </Link>
            </div>

            {/* Copyright */}
            <div className='text-sm text-gray-500'>
              ©1997 <span className='font-semibold text-gray-900'>THIÊN ẤN Furniture.</span> All
              rights reserved.
            </div>

            {/* Social Links */}
            <div className='flex items-center gap-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#7B0C0C] transition-colors'
              >
                <Facebook className='h-5 w-5' />
              </a>
              <a
                href='https://zalo.me'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#7B0C0C] transition-colors'
              >
                <span className='text-xs font-bold'>Z</span>
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#7B0C0C] transition-colors'
              >
                <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
              </a>
              <a
                href='https://youtube.com'
                target='_blank'
                rel='noopener noreferrer'
                className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#7B0C0C] transition-colors'
              >
                <Youtube className='h-5 w-5' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
