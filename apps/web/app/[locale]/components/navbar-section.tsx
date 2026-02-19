'use client';

import React from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Menu, Search, X } from 'lucide-react';
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
  const { isEnglish, isVietnamese } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: 'en' | 'vi') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      className={cn(
        'flex items-center text-[18px] md:text-[24px] font-[444] tracking-normal leading-none gap-2 md:gap-3 font-serif',
        forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
      )}
    >
      <button
        onClick={() => handleLocaleChange('en')}
        className={cn(
          'transition-opacity duration-[2500ms] ease-in-out uppercase',
          isEnglish ? 'opacity-100' : 'opacity-40 hover:opacity-80',
        )}
      >
        ENG
      </button>
      <span className='opacity-20 transition-opacity duration-[2500ms]'>|</span>
      <button
        onClick={() => handleLocaleChange('vi')}
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

/**
 * @deprecated Use NavbarV2 instead.
 */
export const Navbar = ({ items }: NavbarProps) => {
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
          // Only close the menu if the mouse is moving outside the entire nav container
          // and not into the absolute menu area. This prevents the "scroll up" bug.
          const relatedTarget = e.relatedTarget as Node;
          if (!relatedTarget || !(e.currentTarget as Node).contains(relatedTarget)) {
            setIsMenuOpen(false);
          }
        }}
      >
        {/* Top Header Layer (Tier 1 & 2) */}
        <div
          className={cn(
            'relative z-30 transition-colors duration-[2500ms] ease-in-out',
            forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
            // Apply shadow on menu open OR on non-homepage pages by default
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
            /* Gradient Background Layer - only show when menu is closed AND not a white navbar AND on homepage */
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
              {/* Left: Hamburger & Search */}
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

              {/* Center: Logo */}
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

              {/* Right: Language Switcher Only */}
              <div className='flex items-center justify-end flex-1'>
                <LanguageSwitcher forceShow={forceShow} isHeaderHovered={isHeaderHovered} />
              </div>
            </div>

            {/* Tier 2: Navigation Links (Evenly Spread) */}
            <div
              className={cn(
                'hidden lg:flex items-center justify-between w-full pb-6 pt-0 transition-colors duration-[2500ms]',
                forceShow || isHeaderHovered ? '' : 'border-[#49000D]/10',
              )}
            >
              <Link
                href='/about-us'
                onMouseEnter={() => setIsMenuOpen(false)}
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

              <div
                onMouseEnter={() => setIsMenuOpen(true)}
                className={cn(
                  'text-[18px] font-serif font-[444] tracking-normal leading-none transition-colors duration-[2500ms] whitespace-nowrap block uppercase relative group/link pb-1 cursor-default hover:opacity-70',
                  forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
                )}
              >
                {t('products')}
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] transition-all duration-300',
                    isMenuOpen ? 'w-full' : 'w-0 group-hover/link:w-full',
                    forceShow || isHeaderHovered ? 'bg-[#49000D]' : 'bg-white',
                  )}
                />
              </div>

              <Link
                href='/showroom-factory'
                onMouseEnter={() => setIsMenuOpen(false)}
                className={cn(
                  'text-[18px] font-serif font-[444] tracking-normal leading-none transition-colors duration-[2500ms] whitespace-nowrap block uppercase relative group/link pb-1',
                  forceShow || isHeaderHovered
                    ? 'text-[#49000D] hover:opacity-70'
                    : 'text-white hover:opacity-70',
                )}
              >
                {t('showroom')}
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                    forceShow || isHeaderHovered ? 'bg-[#49000D]' : 'bg-white',
                  )}
                />
              </Link>

              <Link
                href='/design-project'
                onMouseEnter={() => setIsMenuOpen(false)}
                className={cn(
                  'text-[18px] font-serif font-[444] tracking-normal leading-none transition-colors duration-[2500ms] whitespace-nowrap block uppercase relative group/link pb-1',
                  forceShow || isHeaderHovered
                    ? 'text-[#49000D] hover:opacity-70'
                    : 'text-white hover:opacity-70',
                )}
              >
                {t('designProject')}
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                    forceShow || isHeaderHovered ? 'bg-[#49000D]' : 'bg-white',
                  )}
                />
              </Link>

              <Link
                href='/exports'
                onMouseEnter={() => setIsMenuOpen(false)}
                className={cn(
                  'text-[18px] font-serif font-[444] tracking-normal leading-none transition-colors duration-[2500ms] whitespace-nowrap block uppercase relative group/link pb-1 hover:opacity-70',
                  forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
                )}
              >
                {t('exports')}
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                    forceShow || isHeaderHovered ? 'bg-[#49000D]' : 'bg-white',
                  )}
                />
              </Link>

              <Link
                href='/blogs'
                onMouseEnter={() => setIsMenuOpen(false)}
                className={cn(
                  'text-[18px] font-serif font-[444] tracking-normal leading-none transition-colors duration-[2500ms] whitespace-nowrap block uppercase relative group/link pb-1 hover:opacity-70',
                  forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
                )}
              >
                {t('blogs')}
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                    forceShow || isHeaderHovered ? 'bg-[#49000D]' : 'bg-white',
                  )}
                />
              </Link>

              <Link
                href='/contact-us'
                onMouseEnter={() => setIsMenuOpen(false)}
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

        {/* Sliding Menu Down (Tier 3) */}
        <div
          onMouseEnter={() => {
            setIsMenuOpen(true);
            setIsHeaderHovered(true);
          }}
          className={cn(
            'overflow-hidden absolute top-full left-0 w-full z-20 transition-all ease-out',
            isMenuOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0',
          )}
          style={{ transitionDuration: '2000ms' }}
        >
          {/* Background for Sliding Menu - slightly more muted to look "behind" */}
          <div
            className='absolute inset-0 -z-10'
            style={{
              backgroundImage: isWhiteNavbarPath
                ? 'none'
                : 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(/nav-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'no-repeat',
              backgroundColor: isWhiteNavbarPath ? '#FEFEFE' : 'white',
            }}
          />

          <div className='container py-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
              {items
                .filter((item) => item.type === 'catalog')
                .map((item) => {
                  const href = `/catalog/${item.slug}`;

                  return (
                    <div
                      key={item.id}
                      className='flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-[2000ms] fill-mode-forwards'
                    >
                      {/* Catalog Level 1 Banner */}
                      <Link
                        href={href}
                        onClick={() => setIsMenuOpen(false)}
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
                      <Link href={href} onClick={() => setIsMenuOpen(false)} className='group'>
                        <h3 className='text-[18px] md:text-[20px] font-serif font-[444] tracking-normal leading-none uppercase text-[#49000D] group-hover:opacity-70 transition-colors'>
                          {tl(item, 'name')}
                        </h3>
                      </Link>

                      {/* Catalog Level 2 List */}
                      <div className='flex flex-col gap-3'>
                        {item.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={`/catalog/${item.slug}/${child.slug}`}
                            onClick={() => setIsMenuOpen(false)}
                            className='text-[14px] md:text-[16px] text-[#49000D]/60 hover:text-[#49000D] transition-colors uppercase font-serif tracking-[0.1em]'
                          >
                            {tl(child, 'name')}
                          </Link>
                        ))}
                        <Link
                          href={`/catalog/${item.slug}/sale`}
                          onClick={() => setIsMenuOpen(false)}
                          className='text-[14px] md:text-[16px] text-red-600/60 hover:text-red-600 transition-colors uppercase font-serif tracking-[0.1em]'
                        >
                          {t('sale')}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              <div className='flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-[2000ms] fill-mode-forwards'>
                <div className='h-[24px] invisible md:block' />{' '}
                {/* Spacer to align with titles on desktop grid */}
                <Link
                  href='/sale'
                  onClick={() => setIsMenuOpen(false)}
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
