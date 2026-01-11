'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, User, ShoppingBag } from 'lucide-react';

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
    <nav className='fixed top-0 left-0 w-full z-50 text-white'>
      {/* Gradient Background Layer */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent -z-10 h-64' />

      <div className='container mx-auto px-4'>
        {/* Tier 1: Logo & Main Icons */}
        <div className='flex items-center justify-between py-6'>
          {/* Left: Mobile Menu & Search */}
          <div className='flex items-center gap-6 flex-1'>
            <button className='hover:text-gray-300 transition-colors'>
              <Menu size={24} strokeWidth={1.5} />
            </button>
            <button className='hover:text-gray-300 transition-colors'>
              <Search size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Center: Logo */}
          <div className='flex flex-col items-center'>
            <Link href='/' className='group flex flex-col items-center'>
              <span className='text-[10px] italic tracking-[0.2em] font-serif mb-[-4px]'>The</span>
              <span className='text-2xl font-bold tracking-[0.1em] border-t border-b border-white py-0.5 px-2'>
                FURNITURE of
              </span>
              <div className='text-5xl font-bold mt-[-5px] leading-tight flex flex-col items-center'>
                <span>TA</span>
                <span className='text-[8px] tracking-[0.3em] font-normal uppercase mt-[-5px]'>
                  Since 1997
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Lang, Account, Cart */}
          <div className='flex items-center justify-end gap-6 flex-1'>
            <div className='hidden md:flex items-center text-sm tracking-widest gap-2'>
              <button className='font-bold'>ENG</button>
              <span className='text-white/40'>|</span>
              <button className='text-white/60 hover:text-white transition-colors'>VIE</button>
            </div>
            <button className='hover:text-gray-300 transition-colors'>
              <User size={24} strokeWidth={1.5} />
            </button>
            <button className='hover:text-gray-300 transition-colors'>
              <ShoppingBag size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Tier 2: Navigation Links */}
        <div className='hidden lg:flex items-center justify-center gap-8 py-4 border-t border-white/10'>
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className='relative'
              onMouseEnter={() => setActiveMenu(catalog.id)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href={`/${catalog.slug}`}
                className='text-[11px] font-medium tracking-[0.2em] hover:text-gray-300 transition-colors whitespace-nowrap py-4 block uppercase'
              >
                {catalog.name}
              </Link>

              {/* Mega Menu Dropdown */}
              {catalog.children && catalog.children.length > 0 && activeMenu === catalog.id && (
                <div className='absolute top-full left-1/2 -translate-x-1/2 pt-2'>
                  <div className='bg-black/90 backdrop-blur-md border border-white/10 rounded-sm py-4 px-6 min-w-[200px] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200'>
                    <div className='flex flex-col gap-3'>
                      {catalog.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/${catalog.slug}/${child.slug}`}
                          className='text-[10px] text-white/70 hover:text-white tracking-[0.15em] transition-colors whitespace-nowrap uppercase'
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
          <Link
            href='/design-manufacturing'
            className='text-[11px] font-medium tracking-[0.2em] hover:text-gray-300 transition-colors whitespace-nowrap py-4 block uppercase'
          >
            DESIGN & MANUFACTURING
          </Link>
        </div>
      </div>
    </nav>
  );
};
