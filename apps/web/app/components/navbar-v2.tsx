'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, X, ChevronRight } from 'lucide-react';
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
          'transition-opacity duration-[1000ms] ease-in-out uppercase',
          isEnglish ? 'opacity-100' : 'opacity-40 hover:opacity-80',
        )}
      >
        ENG
      </button>
      <span className='opacity-20 transition-opacity duration-[1000ms]'>|</span>
      <button
        onClick={() => setLocale('vi')}
        className={cn(
          'transition-opacity duration-[1000ms] ease-in-out uppercase',
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProductsOpen, setIsProductsOpen] = React.useState(false);
  const [activeCatalog, setActiveCatalog] = React.useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = React.useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navbar');
  const tl = useLocalizedText();

  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/vi';
  const isWhiteNavbarPath = !isHomePage;

  const forceShow = isMobileMenuOpen || isWhiteNavbarPath || isProductsOpen;

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsProductsOpen(false);
    setActiveCatalog(null);
  }, [pathname]);

  const catalogs = items.filter((item) => item.type === 'catalog');

  return (
    <>
      <nav
        className={cn('top-0 left-0 w-full z-[100]', isWhiteNavbarPath ? 'relative' : 'absolute')}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={(e) => {
          setIsHeaderHovered(false);
          const relatedTarget = e.relatedTarget as Node;
          if (!relatedTarget || !(e.currentTarget as Node).contains(relatedTarget)) {
            setIsProductsOpen(false);
            setActiveCatalog(null);
          }
        }}
      >
        {/* Top Header Layer */}
        <div
          className={cn(
            'relative z-30 transition-colors duration-[1000ms] ease-in-out',
            forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
            forceShow || isHeaderHovered
              ? 'shadow-sm border-b border-black/[0.03]'
              : 'border-b border-transparent',
          )}
        >
          {/* Background for Top Header */}
          <div
            className={cn(
              'absolute inset-0 -z-10 transition-opacity duration-[1000ms] ease-in-out pointer-events-none',
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
              style={{ transitionDuration: '1000ms' }}
            />
          )}

          <div className='container'>
            {/* Tier 1: Hamburger, Search, Logo, Language */}
            <div className='flex items-center justify-between pt-8 pb-4'>
              <div className='flex items-center gap-8 flex-1'>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className='hover:opacity-70 transition-opacity'
                >
                  {isMobileMenuOpen ? (
                    <X size={24} strokeWidth={1} />
                  ) : (
                    <Menu size={24} strokeWidth={1} />
                  )}
                </button>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className='hover:opacity-70 transition-opacity'
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
                      'h-14 md:h-24 w-auto transition-all duration-[1000ms]',
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
            <div className='hidden lg:flex items-center justify-between w-full pb-6 pt-2'>
              {[
                { label: t('aboutUs'), href: '/about-us' },
                { label: t('products'), href: null, isProducts: true },
                { label: t('showroom'), href: '/showroom-factory' },
                { label: t('designProject'), href: '/design-project' },
                { label: t('exports'), href: '/exports' },
                { label: t('blogs'), href: '/blogs' },
                { label: t('contactUs'), href: '/contact-us' },
              ].map((link, idx) => {
                const isProducts = link.isProducts;

                return (
                  <div
                    key={idx}
                    className='relative'
                    onMouseEnter={() => {
                      if (isProducts) setIsProductsOpen(true);
                      else {
                        setIsProductsOpen(false);
                        setActiveCatalog(null);
                      }
                    }}
                  >
                    {link.href ? (
                      <Link
                        href={link.href}
                        className={cn(
                          'text-[15px] font-serif font-[444] tracking-[0.05em] uppercase relative pb-1 group/link',
                          'transition-colors duration-500',
                          forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
                        )}
                      >
                        {link.label}
                        <span
                          className={cn(
                            'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                            forceShow || isHeaderHovered ? 'bg-[#49000D]' : 'bg-white',
                          )}
                        />
                      </Link>
                    ) : (
                      <div
                        className={cn(
                          'text-[15px] font-serif font-[444] tracking-[0.05em] uppercase relative pb-1 cursor-default group/link',
                          'transition-colors duration-500',
                          forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
                        )}
                      >
                        {link.label}
                        <span
                          className={cn(
                            'absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] transition-all duration-300',
                            isProductsOpen ? 'w-full' : 'w-0 group-hover/link:w-full',
                            forceShow || isHeaderHovered ? 'bg-[#49000D]' : 'bg-white',
                          )}
                        />
                      </div>
                    )}

                    {/* Level 1 Dropdown (Catalogs) */}
                    {isProducts && (
                      <div
                        className={cn(
                          'absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ease-out',
                          isProductsOpen
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 -translate-y-2 pointer-events-none',
                        )}
                        onMouseLeave={() => setActiveCatalog(null)}
                      >
                        <div className='bg-white shadow-xl border border-black/[0.03] min-w-[260px] py-4 rounded-sm'>
                          {catalogs.map((catalog) => (
                            <div
                              key={catalog.id}
                              className='relative group/item'
                              onMouseEnter={() => setActiveCatalog(catalog.id)}
                            >
                              <Link
                                href={`/catalog/${catalog.slug}`}
                                className={cn(
                                  'flex items-center justify-between px-6 py-3 text-[13px] uppercase font-serif tracking-[0.12em] transition-colors',
                                  activeCatalog === catalog.id
                                    ? 'bg-black/[0.03] text-[#49000D]'
                                    : 'text-[#49000D]/70 hover:text-[#49000D] hover:bg-black/[0.01]',
                                )}
                              >
                                {tl(catalog, 'name')}
                                {catalog.children && catalog.children.length > 0 && (
                                  <ChevronRight size={14} className='opacity-40' />
                                )}
                              </Link>

                              {/* Level 2 Dropdown (Sub-catalogs) */}
                              {catalog.children && catalog.children.length > 0 && (
                                <div
                                  className={cn(
                                    'absolute top-0 left-full ml-[-1px] transition-all duration-300 ease-out',
                                    activeCatalog === catalog.id
                                      ? 'opacity-100 translate-x-0 pointer-events-auto'
                                      : 'opacity-0 -translate-x-2 pointer-events-none',
                                  )}
                                >
                                  <div className='bg-white shadow-xl border border-black/[0.03] min-w-[260px] py-4 rounded-sm'>
                                    {catalog.children.map((child) => (
                                      <Link
                                        key={child.id}
                                        href={`/catalog/${catalog.slug}/${child.slug}`}
                                        className='block px-6 py-3 text-[13px] text-[#49000D]/70 hover:text-[#49000D] hover:bg-black/[0.03] transition-colors uppercase font-serif tracking-[0.12em]'
                                      >
                                        {tl(child, 'name')}
                                      </Link>
                                    ))}
                                    <div className='my-2 border-t border-black/[0.05]' />
                                    <Link
                                      href={`/catalog/${catalog.slug}/sale`}
                                      className='block px-6 py-3 text-[13px] text-red-600/70 hover:text-red-600 hover:bg-red-50/30 transition-colors uppercase font-serif tracking-[0.12em]'
                                    >
                                      {t('sale')}
                                    </Link>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <div className='my-2 border-t border-black/[0.05]' />
                          <Link
                            href='/sale'
                            className='block px-6 py-3 text-[13px] text-red-600/70 hover:text-red-600 hover:bg-red-50/30 transition-colors uppercase font-serif tracking-[0.12em]'
                          >
                            {t('allSale')}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (simplified for now) */}
      <div
        className={cn(
          'fixed inset-0 bg-white z-[90] transition-transform duration-500 lg:hidden pt-32',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className='container py-8 overflow-y-auto h-full'>
          <div className='flex flex-col gap-6'>
            <Link
              href='/about-us'
              className='text-[20px] font-serif uppercase text-[#49000D] border-b border-black/[0.05] pb-3'
            >
              {t('aboutUs')}
            </Link>
            <div className='flex flex-col gap-4'>
              <span className='text-[20px] font-serif uppercase text-[#49000D]/40'>
                {t('products')}
              </span>
              <div className='flex flex-col gap-4 pl-4'>
                {catalogs.map((catalog) => (
                  <div key={catalog.id} className='flex flex-col gap-2'>
                    <Link
                      href={`/catalog/${catalog.slug}`}
                      className='text-[18px] font-serif uppercase text-[#49000D]'
                    >
                      {tl(catalog, 'name')}
                    </Link>
                    <div className='flex flex-col gap-2 pl-4'>
                      {catalog.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={`/catalog/${catalog.slug}/${child.slug}`}
                          className='text-[14px] font-serif uppercase text-[#49000D]/60'
                        >
                          {tl(child, 'name')}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {['showroom', 'designProject', 'exports', 'blogs', 'contactUs'].map((key) => (
              <Link
                key={key}
                href={`/${key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`}
                className='text-[20px] font-serif uppercase text-[#49000D] border-b border-black/[0.05] pb-3'
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
