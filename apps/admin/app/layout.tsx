import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@repo/ui/globals.css';

import { AdminLayout } from '../components/layout/admin-layout';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Admin Portal | ThienAn Furniture',
  description: 'Administrative dashboard for the ThienAn Furniture.',
};

import { auth } from '@/auth';
import { Providers } from '../providers';

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
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <style dangerouslySetInnerHTML={{ __html: `:root { --font-sans: var(--font-inter); }` }} />
        <Providers>
          {showAdminLayout ? <AdminLayout>{children}</AdminLayout> : <main>{children}</main>}
        </Providers>
      </body>
    </html>
  );
}
