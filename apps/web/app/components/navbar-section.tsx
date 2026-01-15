'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Image from 'next/image';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Catalog {
  id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  } | null;
  children?: Catalog[];
}

interface NavbarProps {
  catalogs: Catalog[];
}

export const Navbar = ({ catalogs }: NavbarProps) => {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Catalog, product, project, service, and blog detail pages should use the white navbar
  const isWhiteNavbarPath =
    pathname.startsWith('/catalog/') ||
    pathname.startsWith('/product/') ||
    pathname.startsWith('/projects/') ||
    pathname.startsWith('/services/') ||
    pathname.startsWith('/blogs/');

  const forceShow = isMenuOpen || isWhiteNavbarPath;

  // Auto-close menu when navigating to a new page
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          'top-0 left-0 w-full z-[100] transition-all duration-1000 ease-in-out group/nav',
          isWhiteNavbarPath ? 'relative' : 'absolute'
        )}
      >
        {/* Top Header Layer (Tier 1 & 2) */}
        <div
          className={cn(
            'relative z-30 transition-all duration-700 ease-in-out',
            forceShow ? 'text-[#49000D]' : 'text-white hover:text-[#49000D]',
            // Apply shadow on menu open OR on non-homepage pages by default
            isMenuOpen || isWhiteNavbarPath
              ? 'shadow-[0_2px_4px_rgba(34,34,34,0.12),0_6px_6px_rgba(34,34,34,0.10),0_14px_9px_rgba(34,34,34,0.06),0_26px_10px_rgba(34,34,34,0.02)] border-b border-black/[0.03]'
              : 'border-b border-transparent'
          )}
        >
          {/* Background for Top Header */}
          <div
            className={cn(
              'absolute inset-0 -z-10 transition-opacity duration-1000 ease-in-out pointer-events-none',
              forceShow ? 'opacity-100' : 'opacity-0 group-hover/nav:opacity-100'
            )}
            style={{
              backgroundImage:
                'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url(/nav-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'white',
            }}
          />

          {!forceShow && (
            /* Gradient Background Layer - only show when menu is closed AND not a white navbar AND on homepage */
            <div className='absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent -z-10 h-64 transition-opacity duration-1000 pointer-events-none group-hover/nav:opacity-0' />
          )}

          <div className='container mx-auto px-4'>
            {/* Tier 1: Hamburger, Search, Logo, Language */}
            <div className='flex items-center justify-between pt-8 pb-4'>
              {/* Left: Hamburger & Search */}
              <div className='flex items-center gap-8 flex-1'>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={cn(
                    'transition-colors duration-1000',
                    forceShow
                      ? 'text-[#49000D] hover:text-[#49000D]/60'
                      : 'text-white group-hover/nav:text-[#49000D] hover:text-[#49000D]/60'
                  )}
                >
                  {isMenuOpen ? (
                    <X size={24} strokeWidth={1} />
                  ) : (
                    <Menu size={24} strokeWidth={1} />
                  )}
                </button>
                <button
                  className={cn(
                    'transition-colors duration-1000',
                    forceShow
                      ? 'text-[#49000D] hover:text-[#49000D]/60'
                      : 'text-white group-hover/nav:text-[#49000D] hover:text-[#49000D]/60'
                  )}
                >
                  <Search size={24} strokeWidth={1} />
                </button>
              </div>

              {/* Center: Logo */}
              <div className='flex flex-col items-center flex-shrink-0'>
                <Link href='/' className='group flex flex-col items-center'>
                  <Image
                    src='/logo.svg'
                    alt='Thien An Furniture'
                    width={140}
                    height={140}
                    className={cn(
                      'h-24 w-auto transition-all duration-1000',
                      forceShow
                        ? ''
                        : 'brightness-0 invert group-hover/nav:brightness-100 group-hover/nav:invert-0'
                    )}
                    priority
                  />
                </Link>
              </div>

              {/* Right: Language Switcher Only */}
              <div className='flex items-center justify-end flex-1'>
                <div
                  className={cn(
                    'flex items-center text-[24px] font-[444] tracking-normal leading-none gap-3 font-serif transition-colors duration-1000',
                    forceShow ? 'text-[#49000D]' : 'text-white group-hover/nav:text-[#49000D]'
                  )}
                >
                  <button className='font-bold'>ENG</button>
                  <span
                    className={cn(
                      'transition-colors duration-1000',
                      forceShow
                        ? 'text-[#49000D]/20'
                        : 'text-white/40 group-hover/nav:text-[#49000D]/20'
                    )}
                  >
                    |
                  </span>
                  <button
                    className={cn(
                      'transition-colors uppercase',
                      forceShow
                        ? 'text-[#49000D]/40 hover:text-[#49000D]'
                        : 'text-white/60 group-hover/nav:text-[#49000D]/40 hover:text-[#49000D]'
                    )}
                  >
                    Vie
                  </button>
                </div>
              </div>
            </div>

            {/* Tier 2: Navigation Links (Evenly Spread) */}
            <div
              className={cn(
                'hidden lg:flex items-center justify-between w-full pb-6 pt-0 transition-colors duration-1000',
                forceShow ? '' : 'group-hover/nav:border-[#49000D]/10'
              )}
            >
              {catalogs.map((catalog) => (
                <div
                  key={catalog.id}
                  className='relative'
                  onMouseEnter={() => setActiveMenu(catalog.id)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={`/catalog/${catalog.slug}`}
                    className={cn(
                      'text-[24px] font-serif font-[444] tracking-normal leading-none transition-colors duration-1000 whitespace-nowrap block uppercase relative group/link pb-1',
                      forceShow
                        ? 'text-[#49000D] hover:text-[#49000D]/60'
                        : 'text-white group-hover/nav:text-[#49000D] hover:text-[#49000D]/60'
                    )}
                  >
                    {catalog.name}
                    <span
                      className={cn(
                        'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                        forceShow ? 'bg-[#49000D]' : 'bg-white group-hover/nav:bg-[#49000D]'
                      )}
                    />
                  </Link>

                  {/* Mega Menu Dropdown (Standard Nav) */}
                  {catalog.children &&
                    catalog.children.length > 0 &&
                    activeMenu === catalog.id &&
                    !isMenuOpen && (
                      <div className='absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50'>
                        <div className='bg-black/95 backdrop-blur-sm border border-white/5 rounded-none py-4 px-6 min-w-[200px] shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200'>
                          <div className='flex flex-col gap-3'>
                            {catalog.children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/catalog/${catalog.slug}/${child.slug}`}
                                className='text-[16px] text-white/60 hover:text-white tracking-[0.1em] transition-colors whitespace-nowrap uppercase font-serif'
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sliding Menu Down (Tier 3) */}
        <div
          className={cn(
            'overflow-hidden relative z-20 transition-all duration-1000 ease-out',
            isMenuOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          {/* Background for Sliding Menu - slightly more muted to look "behind" */}
          <div
            className='absolute inset-0 -z-10'
            style={{
              backgroundImage:
                'linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url(/nav-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'white',
            }}
          />

          <div className='container mx-auto px-4 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
              {catalogs.map((catalog) => (
                <div
                  key={catalog.id}
                  className='flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-1000'
                >
                  {/* Catalog Level 1 Banner */}
                  <Link
                    href={`/catalog/${catalog.slug}`}
                    className='group overflow-hidden relative aspect-[4/3]'
                  >
                    {catalog.image ? (
                      <Image
                        src={catalog.image.url}
                        alt={catalog.name}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-105'
                      />
                    ) : (
                      <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
                        <span className='text-gray-400 font-serif uppercase tracking-widest'>
                          {catalog.name}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Catalog Level 1 Title */}
                  <Link href={`/catalog/${catalog.slug}`} className='group'>
                    <h3 className='text-[24px] font-serif font-[444] tracking-normal leading-none uppercase text-[#49000D] group-hover:text-[#49000D]/60 transition-colors'>
                      {catalog.name}
                    </h3>
                  </Link>

                  {/* Catalog Level 2 List */}
                  {catalog.children && catalog.children.length > 0 && (
                    <div className='flex flex-col gap-3'>
                      {catalog.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/catalog/${catalog.slug}/${child.slug}`}
                          className='text-[18px] text-[#49000D]/60 hover:text-[#49000D] transition-colors uppercase font-serif tracking-[0.1em]'
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {/* Overlay for blurring content when menu open - optional but helps focus */}
      {isMenuOpen && (
        <div
          className='fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[90] animate-in fade-in duration-500'
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};
