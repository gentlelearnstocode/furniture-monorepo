import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Playfair_Display } from 'next/font/google';
import '@repo/ui/globals.css';
import { NavbarV2 } from './components/navbar-v2';
import { Footer } from './components/footer-section';
import { FloatingContactWidget } from '@/components/ui/floating-contact-widget';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { AnalyticsListener } from './components/analytics-listener';
import { db } from '@repo/database';
import { createCachedQuery } from '@/lib/cache';
import { getSiteContacts } from '@/lib/queries';
import { Locale } from '@/lib/i18n';
import { type Catalog } from '@repo/shared';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/providers/language-provider';
import { Suspense } from 'react';
import { Toaster } from '@repo/ui/ui/sonner';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Thien An Furniture | Excellence Since 1997',
  description: 'Luxury furniture and decor for your home.',
};

// Revalidate every hour (catalogs don't change frequently)
export const revalidate = 3600;

const getRootCatalogs = createCachedQuery(
  async () => {
    return (await db.query.catalogs.findMany({
      where: (catalogs, { isNull }) => isNull(catalogs.parentId),
      with: {
        children: {
          with: { image: true },
          orderBy: (children, { asc }) => [asc(children.name)],
        },
        image: true,
      },
      orderBy: (catalogs, { asc }) => [asc(catalogs.name)],
    })) as Catalog[];
  },
  ['root-catalogs'],
  { revalidate: 3600, tags: ['catalogs'] },
);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const [rootCatalogs, siteContacts, messages] = await Promise.all([
    getRootCatalogs(),
    getSiteContacts(),
    getMessages(),
  ]);

  // Transform root catalogs to navbar format for the "Products" dropdown
  const navItems = rootCatalogs.map((catalog: Catalog) => ({
    id: catalog.id,
    name: catalog.name,
    nameVi: catalog.nameVi,
    slug: catalog.slug,
    type: 'catalog' as const,
    image: catalog.image,
    children: (catalog.children || []).map((child: Catalog) => ({
      id: child.id,
      name: child.name,
      nameVi: child.nameVi,
      slug: child.slug,
      image: child.image,
    })),
  }));

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}
      >
        <LanguageProvider initialLocale={locale as Locale} messages={messages}>
          <NavbarV2 items={navItems} />
          <Suspense fallback={null}>
            <AnalyticsListener />
          </Suspense>
          <main>{children}</main>
          <Footer />
          <div className='fixed bottom-6 right-6 z-50 flex items-end gap-4 pointer-events-none'>
            <ScrollToTop />
            <FloatingContactWidget contacts={siteContacts} />
          </div>
          <Toaster
            position='bottom-right'
            toastOptions={{
              classNames: {
                toast:
                  'group toast group-[.toaster]:bg-white group-[.toaster]:text-brand-neutral-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-2xl font-sans rounded-none border',
                description: 'group-[.toast]:text-gray-500 text-sm',
                actionButton:
                  'group-[.toast]:bg-brand-primary-600 group-[.toast]:text-white uppercase tracking-wider text-xs font-semibold rounded-none',
                cancelButton:
                  'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600 rounded-none',
                success:
                  'group-[.toaster]:border-green-200 group-[.toaster]:text-green-700 group-[.toaster]:bg-green-50',
                error:
                  'group-[.toaster]:border-red-200 group-[.toaster]:text-brand-primary-700 group-[.toaster]:bg-red-50',
                info: 'group-[.toaster]:border-blue-200 group-[.toaster]:text-blue-700 group-[.toaster]:bg-blue-50',
                warning:
                  'group-[.toaster]:border-amber-200 group-[.toaster]:text-amber-700 group-[.toaster]:bg-amber-50',
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}
