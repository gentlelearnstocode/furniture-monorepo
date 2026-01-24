'use client';

import React from 'react';

import { SidebarTrigger } from '@repo/ui/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui/ui/breadcrumb';
import { Separator } from '@repo/ui/ui/separator';

import { CommandMenu } from './command-menu';
import { NotificationDropdown } from './notification-dropdown';

export function Header() {
  return (
    <header className='sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-100 shadow-sm gap-4 py-2'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink href='/'>Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className='flex-1' />

      <div className='flex items-center gap-2'>
        <CommandMenu />
        <NotificationDropdown />
      </div>
    </header>
  );
}
