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
function LanguageSwitcher({
  forceShow,
  isHeaderHovered,
}: {
  forceShow: boolean;
  isHeaderHovered: boolean;
}) {
  const { setLocale, isEnglish, isVietnamese } = useLanguage();

  return (
    <div
      className={cn(
        'flex items-center text-[18px] md:text-[24px] font-[444] tracking-normal leading-none gap-2 md:gap-3 font-serif',
        forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
      )}
    >
      <button
        onClick={() => setLocale('en')}
        className={cn(
          'transition-opacity duration-[2500ms] ease-in-out uppercase',
          isEnglish ? 'opacity-100' : 'opacity-40 hover:opacity-80',
        )}
      >
        ENG
      </button>
      <span className='opacity-20 transition-opacity duration-[2500ms]'>|</span>
      <button
        onClick={() => setLocale('vi')}
        className={cn(
          'transition-opacity duration-[2500ms] ease-in-out uppercase',
          isVietnamese ? 'opacity-100' : 'opacity-40 hover:opacity-80',
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

export const NavbarV2 = ({ items }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = React.useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navbar');
  const tl = useLocalizedText();

  // The navbar should be transparent (with white text) ONLY on the homepage.
  // On all other pages, it should be solid white with maroon text.
  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/vi';
  const isWhiteNavbarPath = !isHomePage;

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
        className={cn('top-0 left-0 w-full z-[100]', isWhiteNavbarPath ? 'relative' : 'absolute')}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={(e) => {
          setIsHeaderHovered(false);
          const relatedTarget = e.relatedTarget as Node;
          if (!relatedTarget || !(e.currentTarget as Node).contains(relatedTarget)) {
            setIsMenuOpen(false);
          }
        }}
      >
        {/* Top Header Layer */}
        <div
          className={cn(
            'relative z-30 transition-colors duration-[2500ms] ease-in-out',
            forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
            isMenuOpen || isWhiteNavbarPath
              ? 'shadow-[0_2px_4px_rgba(34,34,34,0.12),0_6px_6px_rgba(34,34,34,0.10),0_14px_9px_rgba(34,34,34,0.06),0_26px_10px_rgba(34,34,34,0.02)] border-b border-black/[0.03]'
              : 'border-b border-transparent',
          )}
        >
          {/* Background for Top Header */}
          <div
            className={cn(
              'absolute inset-0 -z-10 transition-opacity duration-[2500ms] ease-in-out pointer-events-none',
              forceShow || isHeaderHovered ? 'opacity-100 backdrop-blur-md' : 'opacity-0',
            )}
            style={{
              backgroundImage: isWhiteNavbarPath
                ? 'none'
                : 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(/nav-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
              backgroundColor: isWhiteNavbarPath ? '#FEFEFE' : 'white',
            }}
          />

          {!forceShow && (
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent -z-10 h-64 transition-opacity pointer-events-none',
                isHeaderHovered || forceShow ? 'opacity-0' : 'opacity-100',
              )}
              style={{ transitionDuration: '2000ms' }}
            />
          )}

          <div className='container'>
            {/* Tier 1: Hamburger, Search, Logo, Language */}
            <div className='flex items-center justify-between pt-8 pb-4'>
              <div className='flex items-center gap-8 flex-1'>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={cn(
                    'transition-colors duration-[2500ms]',
                    forceShow || isHeaderHovered
                      ? 'text-[#49000D] hover:opacity-70'
                      : 'text-white hover:opacity-70',
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
                    'transition-colors duration-[2500ms]',
                    forceShow || isHeaderHovered
                      ? 'text-[#49000D] hover:opacity-70'
                      : 'text-white hover:opacity-70',
                  )}
                >
                  <Search size={24} strokeWidth={1} />
                </button>
              </div>

              <div className='flex flex-col items-center flex-shrink-0'>
                <Link href='/' className='group flex flex-col items-center'>
                  <Image
                    src='/logo.svg'
                    alt='Thien An Furniture'
                    width={140}
                    height={140}
                    className={cn(
                      'h-14 md:h-24 w-auto transition-all duration-[2500ms]',
                      forceShow || isHeaderHovered ? '' : 'brightness-0 invert',
                    )}
                    priority
                  />
                </Link>
              </div>

              <div className='flex items-center justify-end flex-1'>
                <LanguageSwitcher forceShow={forceShow} isHeaderHovered={isHeaderHovered} />
              </div>
            </div>

            {/* Tier 2: Navigation Links */}
            <div
              className={cn(
                'hidden lg:flex items-center justify-between w-full pb-6 pt-0 transition-colors duration-[2500ms]',
                forceShow || isHeaderHovered ? '' : 'border-[#49000D]/10',
              )}
            >
              <Link
                href='/about-us'
                className={cn(
                  'text-[18px] font-serif font-[444] tracking-normal leading-none transition-colors duration-[2500ms] whitespace-nowrap block uppercase relative group/link pb-1',
                  forceShow || isHeaderHovered
                    ? 'text-[#49000D] hover:opacity-70'
                    : 'text-white hover:opacity-70',
                )}
              >
                {t('aboutUs')}
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                    forceShow || isHeaderHovered ? 'bg-[#49000D]' : 'bg-white',
                  )}
                />
              </Link>

              {/* Placeholder for dynamic catalog items */}
              <div className='flex gap-8'>
                {items
                  .filter((item) => item.type === 'catalog')
                  .slice(0, 5) // Limit for skeleton
                  .map((item) => (
                    <Link
                      key={item.id}
                      href={`/catalog/${item.slug}`}
                      className={cn(
                        'text-[18px] font-serif font-[444] tracking-normal leading-none transition-colors duration-[2500ms] whitespace-nowrap block uppercase relative group/link pb-1',
                        forceShow || isHeaderHovered
                          ? 'text-[#49000D] hover:opacity-70'
                          : 'text-white hover:opacity-70',
                      )}
                    >
                      {tl(item, 'name')}
                      <span
                        className={cn(
                          'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                          forceShow || isHeaderHovered ? 'bg-[#49000D]' : 'bg-white',
                        )}
                      />
                    </Link>
                  ))}
              </div>

              <Link
                href='/contact-us'
                className={cn(
                  'text-[18px] font-serif font-[444] tracking-normal leading-none transition-colors duration-[2500ms] whitespace-nowrap block uppercase relative group/link pb-1',
                  forceShow || isHeaderHovered
                    ? 'text-[#49000D] hover:opacity-70'
                    : 'text-white hover:opacity-70',
                )}
              >
                {t('contactUs')}
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                    forceShow || isHeaderHovered ? 'bg-[#49000D]' : 'bg-white',
                  )}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
