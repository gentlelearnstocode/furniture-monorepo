import type { Metadata } from "next";
import localFont from "next/font/local";
import "@repo/ui/globals.css";
import { AdminLayout } from "../components/layout/admin-layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Admin Portal | Furniture Monorepo",
  description: "Administrative dashboard for the furniture monorepo project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
