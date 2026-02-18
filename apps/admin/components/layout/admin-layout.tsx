'use client';

import React from 'react';
import { SidebarProvider, SidebarInset } from '@repo/ui/ui/sidebar';
import { Sidebar } from './sidebar';
import { Header } from './header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full bg-brand-neutral-50/50'>
        <Sidebar />
        <SidebarInset>
          <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto'>
              <div className='max-w-7xl mx-auto'>{children}</div>
            </main>
            <footer className='px-6 py-4 border-t border-brand-neutral-100 bg-white/50 mt-auto'>
              <p className='text-xs text-center text-brand-neutral-500'>
                &copy; {new Date().getFullYear()} ThienAn Furniture Admin.
              </p>
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
