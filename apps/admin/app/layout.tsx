import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@repo/ui/globals.css';
import { AdminLayout } from '../components/layout/admin-layout';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Admin Portal | ThienAn Furniture',
  description: 'Administrative dashboard for the ThienAn Furniture.',
};

import { auth } from '@/auth';
import { Providers } from '../components/providers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // If no session and not on login, redirect happens in middleware.
  // We just need to decide if we show the AdminLayout (sidebar/header) or not.
  const showAdminLayout = !!session;

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {showAdminLayout ? <AdminLayout>{children}</AdminLayout> : <main>{children}</main>}
        </Providers>
      </body>
    </html>
  );
}
