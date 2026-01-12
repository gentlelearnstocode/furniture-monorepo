export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Playfair_Display } from 'next/font/google';
import '@repo/ui/globals.css';
import { Navbar } from './components/navbar-section';
import { db } from '@repo/database';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootCatalogs = await db.query.catalogs.findMany({
    where: (catalogs, { isNull }) => isNull(catalogs.parentId),
    with: {
      children: {
        orderBy: (children, { asc }) => [asc(children.name)],
      },
      image: true,
    },
    orderBy: (catalogs, { asc }) => [asc(catalogs.name)],
  });

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-playfair antialiased`}
      >
        <Navbar catalogs={rootCatalogs} />
        <main>{children}</main>
      </body>
    </html>
  );
}
