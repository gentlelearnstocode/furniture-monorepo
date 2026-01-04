'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, User, ShoppingBag } from 'lucide-react';

const NavLinks = [
  { label: 'LIVING ROOM', href: '/living-room' },
  { label: 'BEDROOM', href: '/bedroom' },
  { label: 'DINING', href: '/dining' },
  { label: 'BATH', href: '/bath' },
  { label: 'DECOR', href: '/decor' },
  { label: 'DOORS & WINDOWS', href: '/doors-windows' },
  { label: 'WORSHIP ALTERS', href: '/worship-alters' },
  { label: 'DESIGN & MANUFACTURING', href: '/design-manufacturing' },
];

export const Navbar = () => {
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
          {NavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className='text-[11px] font-medium tracking-[0.2em] hover:text-gray-300 transition-colors whitespace-nowrap'
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
