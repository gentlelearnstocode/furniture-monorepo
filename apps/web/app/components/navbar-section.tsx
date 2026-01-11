'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search } from 'lucide-react';

import Image from 'next/image';

interface Catalog {
  id: string;
  name: string;
  slug: string;
  children?: Catalog[];
}

interface NavbarProps {
  catalogs: Catalog[];
}

export const Navbar = ({ catalogs }: NavbarProps) => {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  return (
    <nav className='absolute top-0 left-0 w-full z-50 text-white'>
      {/* Gradient Background Layer */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent -z-10 h-64' />

      <div className='container mx-auto px-4'>
        {/* Tier 1: Hamburger, Search, Logo, Language */}
        <div className='flex items-center justify-between py-8'>
          {/* Left: Hamburger & Search */}
          <div className='flex items-center gap-8 flex-1'>
            <button className='hover:text-gray-300 transition-colors'>
              <Menu size={20} strokeWidth={1} />
            </button>
            <button className='hover:text-gray-300 transition-colors'>
              <Search size={20} strokeWidth={1} />
            </button>
          </div>

          {/* Center: Logo */}
          <div className='flex flex-col items-center flex-shrink-0'>
            <Link href='/' className='group flex flex-col items-center'>
              <Image
                src='/logo.svg'
                alt='Thien An Furniture'
                width={120}
                height={120}
                className='h-24 w-auto'
                priority
              />
            </Link>
          </div>

          {/* Right: Language Switcher Only */}
          <div className='flex items-center justify-end flex-1'>
            <div className='flex items-center text-[24px] tracking-[0.1em] gap-3'>
              <button className='font-bold'>ENG</button>
              <span className='text-white/40'>|</span>
              <button className='text-white/60 hover:text-white transition-colors uppercase'>
                Vie
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Navigation Links (Evenly Spread) */}
        <div className='hidden lg:flex items-center justify-between w-full py-6 border-t border-white/10'>
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className='relative'
              onMouseEnter={() => setActiveMenu(catalog.id)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href={`/${catalog.slug}`}
                className='text-[24px] font-medium tracking-[0.15em] hover:text-gray-300 transition-colors whitespace-nowrap block uppercase'
              >
                {catalog.name}
              </Link>

              {/* Mega Menu Dropdown */}
              {catalog.children && catalog.children.length > 0 && activeMenu === catalog.id && (
                <div className='absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50'>
                  <div className='bg-black/95 backdrop-blur-sm border border-white/5 rounded-none py-4 px-6 min-w-[200px] shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200'>
                    <div className='flex flex-col gap-3'>
                      {catalog.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/${catalog.slug}/${child.slug}`}
                          className='text-[18px] text-white/60 hover:text-white tracking-[0.15em] transition-colors whitespace-nowrap uppercase'
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
    </nav>
  );
};
