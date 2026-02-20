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
        </LanguageProvider>
      </body>
    </html>
  );
}
