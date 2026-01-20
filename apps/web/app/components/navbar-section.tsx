'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SearchDialog } from './search-dialog';
import { useTranslations } from 'next-intl';
import { useLanguage, useLocalizedText } from '@/providers/language-provider';

import Image from 'next/image';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Language Switcher Component
function LanguageSwitcher({ forceShow }: { forceShow: boolean }) {
  const { setLocale, isEnglish, isVietnamese } = useLanguage();

  return (
    <div
      className={cn(
        'flex items-center text-[18px] md:text-[24px] font-[444] tracking-normal leading-none gap-2 md:gap-3 font-serif transition-colors duration-1000',
        forceShow ? 'text-[#49000D]' : 'text-white group-hover/nav:text-[#49000D]',
      )}
    >
      <button
        onClick={() => setLocale('en')}
        className={cn(
          'transition-colors uppercase',
          isEnglish
            ? 'font-bold'
            : forceShow
              ? 'text-[#49000D]/40 hover:text-[#49000D]'
              : 'text-white/60 group-hover/nav:text-[#49000D]/40 hover:text-[#49000D]',
        )}
      >
        ENG
      </button>
      <span
        className={cn(
          'transition-colors duration-1000',
          forceShow ? 'text-[#49000D]/20' : 'text-white/40 group-hover/nav:text-[#49000D]/20',
        )}
      >
        |
      </span>
      <button
        onClick={() => setLocale('vi')}
        className={cn(
          'transition-colors uppercase',
          isVietnamese
            ? 'font-bold'
            : forceShow
              ? 'text-[#49000D]/40 hover:text-[#49000D]'
              : 'text-white/60 group-hover/nav:text-[#49000D]/40 hover:text-[#49000D]',
        )}
      >
        VIE
      </button>
    </div>
  );
}

interface NavItem {
  id: string;
  name: string;
  nameVi: string | null;
  slug: string;
  type: 'catalog' | 'subcatalog' | 'service';
  image?: {
    url: string;
  } | null;
  children?: {
    id: string;
    name: string;
    nameVi: string | null;
    slug: string;
    image?: { url: string } | null;
  }[];
}

interface NavbarProps {
  items: NavItem[];
}

export const Navbar = ({ items }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navbar');
  const tl = useLocalizedText();

  // Catalog, product, project, service, and blog pages should use the white navbar
  const isWhiteNavbarPath =
    pathname.startsWith('/catalog/') ||
    pathname.startsWith('/product/') ||
    pathname === '/projects' ||
    pathname.startsWith('/projects/') ||
    pathname === '/services' ||
    pathname.startsWith('/services/') ||
    pathname === '/blogs' ||
    pathname.startsWith('/blogs/') ||
    pathname === '/sale';

  const forceShow = isMenuOpen || isWhiteNavbarPath;

  // Auto-close menu when navigating to a new page
  React.useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Global keyboard shortcut for search (Cmd/Ctrl + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <nav
        className={cn(
          'top-0 left-0 w-full z-[100] transition-all duration-1000 ease-in-out group/nav',
          isWhiteNavbarPath ? 'relative' : 'absolute',
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
              : 'border-b border-transparent',
          )}
        >
          {/* Background for Top Header */}
          <div
            className={cn(
              'absolute inset-0 -z-10 transition-opacity duration-1000 ease-in-out pointer-events-none',
              forceShow ? 'opacity-100' : 'opacity-0 group-hover/nav:opacity-100',
            )}
            style={{
              backgroundImage:
                'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(/nav-bg.png)',
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
                      : 'text-white group-hover/nav:text-[#49000D] hover:text-[#49000D]/60',
                  )}
                >
                  {isMenuOpen ? (
                    <X size={24} strokeWidth={1} />
                  ) : (
                    <Menu size={24} strokeWidth={1} />
                  )}
                </button>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={cn(
                    'transition-colors duration-1000',
                    forceShow
                      ? 'text-[#49000D] hover:text-[#49000D]/60'
                      : 'text-white group-hover/nav:text-[#49000D] hover:text-[#49000D]/60',
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
                      'h-14 md:h-24 w-auto transition-all duration-1000',
                      forceShow
                        ? ''
                        : 'brightness-0 invert group-hover/nav:brightness-100 group-hover/nav:invert-0',
                    )}
                    priority
                  />
                </Link>
              </div>

              {/* Right: Language Switcher Only */}
              <div className='flex items-center justify-end flex-1'>
                <LanguageSwitcher forceShow={forceShow} />
              </div>
            </div>

            {/* Tier 2: Navigation Links (Evenly Spread) */}
            <div
              className={cn(
                'hidden lg:flex items-center justify-between w-full pb-6 pt-0 transition-colors duration-1000',
                forceShow ? '' : 'group-hover/nav:border-[#49000D]/10',
              )}
            >
              {items.map((item) => {
                const href =
                  item.type === 'service' ? `/services/${item.slug}` : `/catalog/${item.slug}`;
                const hasChildren =
                  item.type === 'catalog' && item.children && item.children.length > 0;

                return (
                  <div key={item.id} className='relative group/dropdown'>
                    <Link
                      href={href}
                      className={cn(
                        'text-[18px] font-serif font-[444] tracking-normal leading-none transition-colors duration-1000 whitespace-nowrap block uppercase relative group/link pb-1',
                        forceShow
                          ? 'text-[#49000D] hover:text-[#49000D]/60'
                          : 'text-white group-hover/nav:text-[#49000D] hover:text-[#49000D]/60',
                      )}
                    >
                      {tl(item, 'name')}
                      <span
                        className={cn(
                          'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                          forceShow ? 'bg-[#49000D]' : 'bg-white group-hover/nav:bg-[#49000D]',
                        )}
                      />
                    </Link>

                    {/* Hover Dropdown Menu - only for catalogs with children */}
                    {hasChildren && (
                      <div className='absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 z-50'>
                        <div
                          className='min-w-[200px] py-4 px-6 shadow-lg border border-black/5'
                          style={{
                            backgroundImage:
                              'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(/nav-bg.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: 'white',
                          }}
                        >
                          <div className='flex flex-col gap-3'>
                            {item.children?.map((child) => (
                              <Link
                                key={child.id}
                                href={`/catalog/${item.slug}/${child.slug}`}
                                className='text-[16px] text-[#49000D]/70 hover:text-[#49000D] transition-colors uppercase font-serif tracking-[0.05em] whitespace-nowrap'
                              >
                                {tl(child, 'name')}
                              </Link>
                            ))}
                            <div className='border-t border-[#49000D]/10 my-1' />
                            <Link
                              href={`/catalog/${item.slug}/sale`}
                              className='text-[16px] text-red-600/80 hover:text-red-600 transition-colors uppercase font-serif tracking-[0.05em] font-medium'
                            >
                              {t('sale')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sliding Menu Down (Tier 3) */}
        <div
          className={cn(
            'overflow-hidden relative z-20 transition-all duration-1000 ease-out',
            isMenuOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          {/* Background for Sliding Menu - slightly more muted to look "behind" */}
          <div
            className='absolute inset-0 -z-10'
            style={{
              backgroundImage:
                'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(/nav-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'white',
            }}
          />

          <div className='container mx-auto px-4 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
              {items
                .filter((item) => item.type === 'catalog')
                .map((item) => {
                  const href = `/catalog/${item.slug}`;

                  return (
                    <div
                      key={item.id}
                      className='flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-1000'
                    >
                      {/* Catalog Level 1 Banner */}
                      <Link
                        href={href}
                        className='hidden md:block group overflow-hidden relative aspect-[4/3]'
                      >
                        {item.image ? (
                          <Image
                            src={item.image.url}
                            alt={tl(item, 'name')}
                            fill
                            className='object-cover transition-transform duration-700 group-hover:scale-105'
                          />
                        ) : (
                          <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
                            <span className='text-gray-400 font-serif uppercase tracking-widest'>
                              {tl(item, 'name')}
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Catalog Level 1 Title */}
                      <Link href={href} className='group'>
                        <h3 className='text-[18px] md:text-[20px] font-serif font-[444] tracking-normal leading-none uppercase text-[#49000D] group-hover:text-[#49000D]/60 transition-colors'>
                          {tl(item, 'name')}
                        </h3>
                      </Link>

                      {/* Catalog Level 2 List */}
                      <div className='flex flex-col gap-3'>
                        {item.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={`/catalog/${item.slug}/${child.slug}`}
                            className='text-[14px] md:text-[16px] text-[#49000D]/60 hover:text-[#49000D] transition-colors uppercase font-serif tracking-[0.1em]'
                          >
                            {tl(child, 'name')}
                          </Link>
                        ))}
                        <Link
                          href={`/catalog/${item.slug}/sale`}
                          className='text-[14px] md:text-[16px] text-red-600/60 hover:text-red-600 transition-colors uppercase font-serif tracking-[0.1em]'
                        >
                          {t('sale')}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              <div className='flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-1000'>
                <div className='h-[24px] invisible md:block' />{' '}
                {/* Spacer to align with titles on desktop grid */}
                <Link
                  href='/sale'
                  className='text-[24px] font-serif font-[444] tracking-normal leading-none uppercase text-red-600 hover:text-red-700 transition-colors'
                >
                  {t('allSale')}
                </Link>
              </div>
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
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
