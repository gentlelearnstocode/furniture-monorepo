import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Playfair_Display } from 'next/font/google';
import '@repo/ui/globals.css';
import { Navbar } from './components/navbar-section';
import { Footer } from './components/footer-section';
import { FloatingContactWidget } from '@/components/ui/floating-contact-widget';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { db } from '@repo/database';
import { createCachedQuery } from '@/lib/cache';
import { getSiteContacts } from '@/lib/queries';
import { getNavMenuItems, type NavMenuItem } from '@/lib/menu';
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

// Transform menu items to navbar format
function transformMenuItemsToNavbarFormat(menuItems: NavMenuItem[]) {
  type NavItemResult = {
    id: string;
    name: string;
    slug: string;
    type: 'catalog' | 'subcatalog' | 'service';
    image: { url: string } | null;
    children: { id: string; name: string; slug: string; image: { url: string } | null }[];
  };

  const results: NavItemResult[] = [];

  for (const item of menuItems) {
    if (item.itemType === 'service' && item.service) {
      results.push({
        id: item.service.id,
        name: item.service.title,
        slug: item.service.slug,
        type: 'service',
        image: item.service.image,
        children: [],
      });
    } else if (item.catalog) {
      results.push({
        id: item.catalog.id,
        name: item.catalog.name,
        slug: item.catalog.slug,
        type: item.itemType as 'catalog' | 'subcatalog',
        image: item.catalog.image,
        children: item.catalog.children || [],
      });
    }
  }

  return results;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuItems, rootCatalogs, siteContacts] = await Promise.all([
    getNavMenuItems(),
    getRootCatalogs(),
    getSiteContacts(),
  ]);

  // Use menu items if configured, otherwise fall back to root catalogs
  const navItems =
    menuItems.length > 0
      ? transformMenuItemsToNavbarFormat(menuItems)
      : rootCatalogs.map((catalog) => ({
          id: catalog.id,
          name: catalog.name,
          slug: catalog.slug,
          type: 'catalog' as const,
          image: catalog.image,
          children: catalog.children || [],
        }));

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          <Navbar items={navItems} />
          <main>{children}</main>
          <Footer />
          <div className='fixed bottom-6 right-6 z-50 flex items-end gap-4'>
            <ScrollToTop />
            <FloatingContactWidget contacts={siteContacts} />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
