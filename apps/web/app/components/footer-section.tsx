import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@repo/database';
import { MapPin, Phone, Mail, Facebook, Youtube, Linkedin, Twitter } from 'lucide-react';

import { createCachedQuery } from '@/lib/cache';
import { getTranslations } from 'next-intl/server';
import { getLocale, getLocalizedText } from '@/lib/i18n';

export const Footer = async () => {
  const t = await getTranslations('Footer');
  // Cached footer settings
  const getFooterData = createCachedQuery(
    async () =>
      await db.query.siteFooter.findFirst({
        orderBy: (footer, { desc }) => [desc(footer.updatedAt)],
      }),
    ['footer-settings'],
    { revalidate: 3600, tags: ['footer'] },
  );

  const getFooterAddresses = createCachedQuery(
    async () =>
      await db.query.footerAddresses.findMany({
        orderBy: (addr, { asc }) => [asc(addr.position)],
      }),
    ['footer-addresses'],
    { revalidate: 3600, tags: ['footer'] },
  );

  const getFooterContacts = createCachedQuery(
    async () =>
      await db.query.footerContacts.findMany({
        orderBy: (contact, { asc }) => [asc(contact.position)],
      }),
    ['footer-contacts'],
    { revalidate: 3600, tags: ['footer'] },
  );

  const getFooterSocialLinks = createCachedQuery(
    async () =>
      await db.query.footerSocialLinks.findMany({
        where: (links, { eq }) => eq(links.isActive, true),
        orderBy: (links, { asc }) => [asc(links.position)],
      }),
    ['footer-social-links'],
    { revalidate: 3600, tags: ['footer'] },
  );

  // Fetch footer settings using cached queries
  const footerData = await getFooterData();
  const addresses = await getFooterAddresses();
  const contacts = await getFooterContacts();

  // Helper function to fetch level 1 catalogs (already cached in layout, but let's be safe here if needed or use same tags)
  const getFooterCatalogs = createCachedQuery(
    async () =>
      await db.query.catalogs.findMany({
        where: (catalogs, { isNull }) => isNull(catalogs.parentId),
        orderBy: (catalogs, { asc }) => [asc(catalogs.name)],
      }),
    ['footer-catalogs'],
    { revalidate: 3600, tags: ['catalogs'] },
  );

  const catalogs = await getFooterCatalogs();

  // Fetch active projects
  const getFooterProjects = createCachedQuery(
    async () =>
      await db.query.projects.findMany({
        where: (projects, { eq }) => eq(projects.isActive, true),
        orderBy: (projects, { asc }) => [asc(projects.title)],
      }),
    ['footer-projects'],
    { revalidate: 3600, tags: ['projects'] },
  );

  const projects = await getFooterProjects();

  const phoneContacts = contacts.filter((c) => c.type === 'phone');
  const emailContacts = contacts.filter((c) => c.type === 'email');

  // Fetch active social links
  const socialLinks = await getFooterSocialLinks();
  const locale = await getLocale();

  // Helper function to render social media icon
  const getSocialIcon = (platform: string) => {
    const iconClass = 'h-5 w-5';
    switch (platform) {
      case 'facebook':
        return <Facebook className={iconClass} />;
      case 'youtube':
        return <Youtube className={iconClass} />;
      case 'instagram':
        return (
          <svg className={iconClass} fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
          </svg>
        );
      case 'zalo':
        return <span className='text-xs font-bold'>Z</span>;
      case 'tiktok':
        return (
          <svg className={iconClass} fill='currentColor' viewBox='0 0 24 24'>
            <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z' />
          </svg>
        );
      case 'linkedin':
        return <Linkedin className={iconClass} />;
      case 'twitter':
        return <Twitter className={iconClass} />;
      default:
        return null;
    }
  };

  // Helper function to ensure URL has protocol
  const ensureProtocol = (url: string) => {
    if (!url.match(/^https?:\/\//i)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <footer className='relative border-t border-gray-200 overflow-hidden'>
      {/* Background with nav-bg pattern */}
      <div
        className='absolute inset-0 -z-10'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(/nav-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'white',
        }}
      />
      {/* Main Footer Content */}
      <div className='container pt-16 pb-4'>
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
                className='h-16 md:h-28 w-auto'
              />
            </Link>

            {/* Intro Title */}
            {footerData?.intro && (
              <h3 className='text-2xl font-serif font-bold text-[#7B0C0C] uppercase tracking-wide'>
                {getLocalizedText(footerData, 'intro', locale)}
              </h3>
            )}

            {/* Description */}
            {footerData?.description && (
              <p className='text-sm text-gray-700 leading-relaxed italic font-serif'>
                &ldquo;{getLocalizedText(footerData, 'description', locale)}&rdquo;
              </p>
            )}

            {/* Addresses */}
            {addresses.length > 0 && (
              <div className='space-y-4'>
                {addresses.map((addr) => (
                  <div key={addr.id} className='flex items-start gap-3'>
                    <MapPin className='h-4 w-4 text-[#7B0C0C] mt-1 flex-shrink-0' />
                    <div className='text-sm text-gray-700'>
                      <span className='font-semibold'>
                        {getLocalizedText(addr, 'label', locale)}:
                      </span>{' '}
                      {getLocalizedText(addr, 'address', locale)}
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
                      {phone.label && (
                        <span className='font-semibold'>
                          {getLocalizedText(phone, 'label', locale)}:{' '}
                        </span>
                      )}
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
                  placeholder={t('emailPlaceholder')}
                  className='flex-1 px-4 py-3 text-sm border border-gray-300 bg-white focus:outline-none focus:border-[#7B0C0C] placeholder:text-gray-400'
                />
                <button
                  type='submit'
                  className='px-6 py-3 bg-[#7B0C0C] text-white text-sm font-semibold uppercase tracking-wider hover:bg-[#5a0909] transition-colors whitespace-nowrap'
                >
                  {t('registerButton')}
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
                  title={t('mapTitle')}
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400'>
                  <div className='text-center'>
                    <MapPin className='h-12 w-12 mx-auto mb-2' />
                    <p className='text-sm'>{t('mapFallback')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Catalog & Services Grid - Below Map */}
            <div className='grid grid-cols-2 gap-8'>
              {/* Catalog Links */}
              <div>
                <h4 className='text-lg font-serif font-bold text-gray-900 mb-6'>{t('catalog')}</h4>
                <ul className='space-y-3'>
                  {catalogs.map((catalog) => (
                    <li key={catalog.id}>
                      <Link
                        href={`/catalog/${catalog.slug}`}
                        className='text-sm text-gray-600 hover:text-[#7B0C0C] transition-colors'
                      >
                        {getLocalizedText(catalog, 'name', locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Projects Links */}
              <div>
                <h4 className='text-lg font-serif font-bold text-gray-900 mb-6'>{t('projects')}</h4>
                <ul className='space-y-3'>
                  {projects.map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className='text-sm text-gray-600 hover:text-[#7B0C0C] transition-colors'
                      >
                        {getLocalizedText(project, 'title', locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Ribbon Banner */}
      <div className='container pb-12'>
        <div className='relative w-full aspect-[1760/139] max-w-5xl mx-auto'>
          <Image
            src='/ribbons-banner.svg'
            alt='We produce & deliver worldwide'
            fill
            className='object-contain'
            priority
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-300'>
        <div className='container py-6'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            {/* Policy Links */}
            <div className='flex items-center gap-6 text-sm text-gray-500'>
              <Link href='/privacy' className='hover:text-gray-900 transition-colors'>
                {t('privacyPolicy')}
              </Link>
              <span className='text-gray-300'>|</span>
              <Link href='/terms' className='hover:text-gray-900 transition-colors'>
                {t('termsOfUse')}
              </Link>
              <span className='text-gray-300'>|</span>
              <Link href='/legal' className='hover:text-gray-900 transition-colors'>
                {t('legalInfo')}
              </Link>
            </div>

            {/* Copyright */}
            <div className='text-sm text-gray-500'>
              ©1997 <span className='font-semibold text-gray-900'>THIÊN ẤN Furniture.</span>{' '}
              {t('allRightsReserved')}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className='flex items-center gap-4'>
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={ensureProtocol(link.url)}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-[#7B0C0C] transition-colors'
                    aria-label={link.platform}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
