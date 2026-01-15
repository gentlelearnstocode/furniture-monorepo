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

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
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
  { revalidate: 3600, tags: ['catalogs'] }
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootCatalogs = await getRootCatalogs();
  const siteContacts = await getSiteContacts();

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Navbar catalogs={rootCatalogs} />
        <main>{children}</main>
        <Footer />
        <div className='fixed bottom-6 right-6 z-50 flex items-end gap-4'>
          <ScrollToTop />
          <FloatingContactWidget contacts={siteContacts} />
        </div>
      </body>
    </html>
  );
}
