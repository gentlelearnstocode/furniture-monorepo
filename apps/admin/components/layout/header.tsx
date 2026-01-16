'use client';

import React from 'react';
import { LogOut, User, Settings as SettingsIcon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/ui/dropdown-menu';
import { CommandMenu } from './command-menu';
import { NotificationDropdown } from './notification-dropdown';

export function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '??';

  return (
    <header className='sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-100 shadow-sm gap-4'>
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

        <Separator orientation='vertical' className='mx-2 h-6' />

        <div className='flex items-center gap-3'>
          <div className='flex flex-col items-end hidden md:flex'>
            <span className='text-sm font-semibold text-gray-900'>{user?.name || 'User'}</span>
            <span className='text-xs text-gray-500 capitalize'>{user?.role || 'Role'}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className='h-9 w-9 transition-transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-brand-primary-100'>
                <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                <AvatarFallback className='bg-brand-primary-600 text-white text-xs font-bold'>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <DropdownMenuLabel className='font-normal font-inter'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>{user?.name}</p>
                  <p className='text-xs leading-none text-muted-foreground'>
                    @{user?.username || 'username'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon className='mr-2 h-4 w-4' />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-red-600 focus:text-red-700 cursor-pointer'
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
