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
import { getLocale } from '@/lib/i18n';
import { getMessages } from 'next-intl/server';
import { LanguageProvider } from '@/providers/language-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
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
    return await db.query.catalogs.findMany({
      where: (catalogs, { isNull }) => isNull(catalogs.parentId),
      with: {
        children: {
          with: { image: true },
          orderBy: (children, { asc }) => [asc(children.name)],
        },
        image: true,
      },
      orderBy: (catalogs, { asc }) => [asc(catalogs.name)],
    });
  },
  ['root-catalogs'],
  { revalidate: 3600, tags: ['catalogs'] },
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [rootCatalogs, siteContacts, locale, messages] = await Promise.all([
    getRootCatalogs(),
    getSiteContacts(),
    getLocale(),
    getMessages(),
  ]);

  // Transform root catalogs to navbar format for the "Products" dropdown
  const navItems = rootCatalogs.map((catalog: any) => ({
    id: catalog.id,
    name: catalog.name,
    nameVi: catalog.nameVi,
    slug: catalog.slug,
    type: 'catalog' as const,
    image: catalog.image,
    children: (catalog.children || []).map((child: any) => ({
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
        <LanguageProvider initialLocale={locale} messages={messages}>
          <NavbarV2 items={navItems} />
          <AnalyticsListener />
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
