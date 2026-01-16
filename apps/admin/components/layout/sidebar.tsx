'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Settings,
  FolderTree,
  Layers,
  UserCog,
  LogOut,
  ChevronsUpDown,
  Home,
  ChevronRight,
  Briefcase,
  DraftingCompass,
  Newspaper,
} from 'lucide-react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarFooter,
} from '@repo/ui/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@repo/ui/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/ui/avatar';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === 'admin';

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    {
      name: 'Homepage',
      href: '/homepage',
      icon: Home,
      items: [
        { name: 'Hero Section', href: '/homepage/hero' },
        { name: 'Featured Catalogs Section', href: '/homepage/featured' },
        { name: 'Sale Section', href: '/homepage/sale' },
        { name: 'Intro Section', href: '/homepage/intro' },
        { name: 'Contact Management', href: '/homepage/contacts' },
        { name: 'Footer Section', href: '/homepage/footer' },
      ],
    },
    { name: 'Catalogs', href: '/catalogs', icon: FolderTree },
    { name: 'Collections', href: '/collections', icon: Layers },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Projects', href: '/projects', icon: DraftingCompass },
    { name: 'Blogs', href: '/blogs', icon: Newspaper },
    // { name: "Orders", href: "/orders", icon: ShoppingCart },
    // { name: "Customers", href: "/customers", icon: Users },
    ...(isAdmin ? [{ name: 'Admin Users', href: '/users', icon: UserCog }] : []),
    // { name: "Settings", href: "/settings", icon: Settings },
  ];

  const systemNavigation = [{ name: 'Settings', href: '/settings', icon: Settings }];

  return (
    <SidebarUI collapsible='icon'>
      <SidebarHeader className='h-16 border-b border-sidebar-border/50 flex items-center justify-center'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' className='hover:bg-transparent cursor-default'>
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-white border border-sidebar-border/50 text-sidebar-primary-foreground overflow-hidden'>
                <Image
                  src='/icon.png'
                  alt='ThienAn Furniture'
                  width={32}
                  height={32}
                  className='size-full object-contain p-1'
                />
              </div>
              <div className='flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden ml-2'>
                <span className='font-semibold text-brand-neutral-900 tracking-tight'>
                  Admin Portal
                </span>
                <span className='text-[10px] text-brand-neutral-500 font-medium'>v0.1.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  item.items?.some((subItem) => pathname === subItem.href);

                if (item.items) {
                  return (
                    <Collapsible
                      key={item.name}
                      asChild
                      defaultOpen={isActive}
                      className='group/collapsible'
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.name}>
                            {item.icon && <item.icon />}
                            <span>{item.name}</span>
                            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.name}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                  <Link href={subItem.href}>
                                    <span>{subItem.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.name}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className='mt-auto'>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild size='sm'>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='border-t border-sidebar-border/50 p-2'>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg overflow-hidden border border-sidebar-border/50'>
                    <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                    <AvatarFallback className='rounded-lg bg-brand-primary-600 text-white text-[10px]'>
                      {session?.user?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'CN'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2'>
                    <span className='truncate font-semibold text-brand-neutral-900'>
                      {session?.user?.name || 'User'}
                    </span>
                    <span className='truncate text-xs text-brand-neutral-500'>
                      {session?.user?.email || 'admin@thienan.com'}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto size-4 text-brand-neutral-400 group-data-[collapsible=icon]:hidden' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <Avatar className='h-8 w-8 rounded-lg'>
                      <AvatarImage
                        src={session?.user?.image || ''}
                        alt={session?.user?.name || ''}
                      />
                      <AvatarFallback className='rounded-lg bg-brand-primary-600 text-white'>
                        {session?.user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase() || 'CN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>{session?.user?.name}</span>
                      <span className='truncate text-xs text-muted-foreground'>
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='text-red-600 focus:text-red-700 cursor-pointer'
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </SidebarUI>
  );
}
