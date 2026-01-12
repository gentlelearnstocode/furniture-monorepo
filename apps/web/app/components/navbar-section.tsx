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

  // All catalog pages (level 1 and level 2) now use /catalog/ prefix
  const isCatalogPage = pathname.startsWith('/catalog/');
  const isWhiteNavbar = isMenuOpen || isCatalogPage;

  // Auto-close menu when navigating to a new page
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={cn(
          'top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out',
          isWhiteNavbar ? 'bg-white shadow-sm relative' : 'absolute text-white'
        )}
      >
        {!isWhiteNavbar && (
          /* Gradient Background Layer - only show when menu is closed AND not a white navbar */
          <div className='absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent -z-10 h-64' />
        )}

        <div className='container mx-auto px-4'>
          {/* Tier 1: Hamburger, Search, Logo, Language */}
          <div className='flex items-center justify-between py-8'>
            {/* Left: Hamburger & Search */}
            <div className='flex items-center gap-8 flex-1'>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  'transition-colors duration-300',
                  isWhiteNavbar
                    ? 'text-black hover:text-gray-600'
                    : 'text-white hover:text-gray-300'
                )}
              >
                {isMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
              </button>
              <button
                className={cn(
                  'transition-colors duration-300',
                  isWhiteNavbar
                    ? 'text-black hover:text-gray-600'
                    : 'text-white hover:text-gray-300'
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
                  className='h-24 w-auto brightness-0 invert-0'
                  style={!isWhiteNavbar ? { filter: 'brightness(0) invert(1)' } : {}}
                  priority
                />
              </Link>
            </div>

            {/* Right: Language Switcher Only */}
            <div className='flex items-center justify-end flex-1'>
              <div
                className={cn(
                  'flex items-center text-[20px] tracking-[0.1em] gap-3 font-serif italic',
                  isWhiteNavbar ? 'text-black' : 'text-white'
                )}
              >
                <button className='font-bold'>ENG</button>
                <span className={isWhiteNavbar ? 'text-black/20' : 'text-white/40'}>|</span>
                <button
                  className={cn(
                    'transition-colors uppercase',
                    isWhiteNavbar
                      ? 'text-black/40 hover:text-black'
                      : 'text-white/60 hover:text-white'
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
              'hidden lg:flex items-center justify-between w-full py-6 border-t transition-colors duration-300',
              isWhiteNavbar ? 'border-black/10' : 'border-white/10'
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
                    'text-[20px] font-serif italic tracking-[0.1em] transition-colors whitespace-nowrap block uppercase',
                    isWhiteNavbar
                      ? 'text-black hover:text-gray-600'
                      : 'text-white hover:text-gray-300'
                  )}
                >
                  {catalog.name}
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
                              className='text-[16px] text-white/60 hover:text-white tracking-[0.1em] transition-colors whitespace-nowrap uppercase italic font-serif'
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

        {/* Sliding Menu Down */}
        <div
          className={cn(
            'overflow-hidden bg-white border-t border-black/5',
            isMenuOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          )}
          style={{
            transition: 'max-height 2500ms ease-out, opacity 2500ms ease-out',
          }}
        >
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
                        <span className='text-gray-400 font-serif italic uppercase tracking-widest'>
                          {catalog.name}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Catalog Level 1 Title */}
                  <Link href={`/catalog/${catalog.slug}`} className='group'>
                    <h3 className='text-[24px] font-serif italic uppercase tracking-[0.1em] text-black group-hover:text-gray-600 transition-colors'>
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
                          className='text-[18px] text-black/60 hover:text-black transition-colors uppercase italic font-serif tracking-[0.1em]'
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
