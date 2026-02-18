'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, X, ChevronRight, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SearchDialog } from './search-dialog';
import { useTranslations } from 'next-intl';
import { useLanguage, useLocalizedText } from '@/providers/language-provider';
import { cn } from '@repo/ui/lib/utils';

import Image from 'next/image';

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
        forceShow || isHeaderHovered ? 'text-brand-primary-900' : 'text-white',
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
  const [isMobileProductsOpen, setIsMobileProductsOpen] = React.useState(false);
  const [activeCatalog, setActiveCatalog] = React.useState<string | null>(null);
  const [expandedMobileCatalog, setExpandedMobileCatalog] = React.useState<string | null>(null);
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
    setIsMobileProductsOpen(false);
    setActiveCatalog(null);
    setExpandedMobileCatalog(null);
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
                  className='lg:hidden hover:opacity-70 transition-opacity'
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

            {/* Tier 2: Navigation Links (Desktop) */}
            <div className='hidden lg:flex items-center justify-between w-full pb-6 pt-2'>
              {[
                { label: t('aboutUs'), href: '/about-us' },
                { label: t('products'), href: null, isProducts: true },
                { label: t('showroomFactory'), href: '/showroom-factory' },
                { label: t('designProject'), href: '/design-project' },
                { label: t('exports'), href: '/exports' },
                { label: t('blogs'), href: '/blogs' },
                { label: t('contactUs'), href: '/contact-us' },
              ].map((link, idx) => {
                const isProducts = link.isProducts;

                return (
                  <div
                    key={idx}
                    className='relative flex items-center'
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
                          'text-[15px] font-serif font-[444] tracking-[0.05em] uppercase relative pb-1 group/link block',
                          'transition-colors duration-500',
                          forceShow || isHeaderHovered ? 'text-[#49000D]' : 'text-white',
                        )}
                      >
                        {link.label}
                        <span
                          className={cn(
                            'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full',
                            forceShow || isHeaderHovered ? 'bg-brand-primary-900' : 'bg-white',
                          )}
                        />
                      </Link>
                    ) : (
                      <span
                        className={cn(
                          'text-[15px] font-serif font-[444] tracking-[0.05em] uppercase relative pb-1 cursor-default group/link block',
                          'transition-colors duration-500',
                          forceShow || isHeaderHovered ? 'text-brand-primary-900' : 'text-white',
                        )}
                      >
                        {link.label}
                        <span
                          className={cn(
                            'absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] transition-all duration-300',
                            isProductsOpen ? 'w-full' : 'w-0 group-hover/link:w-full',
                            forceShow || isHeaderHovered ? 'bg-brand-primary-900' : 'bg-white',
                          )}
                        />
                      </span>
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
                                    ? 'bg-black/[0.03] text-brand-primary-900'
                                    : 'text-brand-primary-900/70 hover:text-brand-primary-900 hover:bg-black/[0.01]',
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
                                        className='block px-6 py-3 text-[13px] text-brand-primary-900/70 hover:text-brand-primary-900 hover:bg-black/[0.03] transition-colors uppercase font-serif tracking-[0.12em]'
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

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-full md:w-[400px] bg-[#FEFEFE] z-[110] shadow-2xl transition-transform duration-500 ease-in-out lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className='flex flex-col h-full'>
          {/* Mobile Header */}
          <div className='flex items-center justify-between px-8 py-8 border-b border-black/[0.05]'>
            <Image src='/logo.svg' alt='Logo' width={80} height={80} className='h-12 w-auto' />
            <button onClick={() => setIsMobileMenuOpen(false)} className='text-brand-primary-900 p-2'>
              <X size={28} strokeWidth={1} />
            </button>
          </div>

          {/* Navigation Items */}
          <div className='flex-1 overflow-y-auto px-8 py-12'>
            <div className='flex flex-col gap-8'>
              <Link
                href='/about-us'
                onClick={() => setIsMobileMenuOpen(false)}
                className='text-[22px] font-serif uppercase text-brand-primary-900 tracking-wider'
              >
                {t('aboutUs')}
              </Link>

              {/* Products Accordion */}
              <div className='flex flex-col'>
                <button
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                  className='flex items-center justify-between w-full text-left text-[22px] font-serif uppercase text-brand-primary-900 tracking-wider'
                >
                  <span>{t('products')}</span>
                  <ChevronDown
                    size={22}
                    className={cn(
                      'transition-transform duration-300 text-brand-primary-900/40',
                      isMobileProductsOpen ? 'rotate-180' : '',
                    )}
                  />
                </button>
                
                {isMobileProductsOpen && (
                  <div className='flex flex-col gap-6 mt-6 pl-4 animate-in fade-in slide-in-from-top-2 duration-300'>
                    {catalogs.map((catalog) => (
                      <div key={catalog.id} className='flex flex-col gap-4 border-l border-black/[0.05] pl-4'>
                        <div className='flex items-center justify-between w-full'>
                          <Link
                            href={`/catalog/${catalog.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='text-[18px] font-serif uppercase text-brand-primary-900 tracking-wide hover:opacity-70 transition-opacity'
                          >
                            {tl(catalog, 'name')}
                          </Link>
                          {catalog.children && catalog.children.length > 0 && (
                            <button
                              onClick={() =>
                                setExpandedMobileCatalog(
                                  expandedMobileCatalog === catalog.id ? null : catalog.id,
                                )
                              }
                              className='p-2 -mr-2 text-brand-primary-900/40 hover:text-brand-primary-900 transition-colors'
                            >
                              <ChevronDown
                                size={20}
                                className={cn(
                                  'transition-transform duration-300',
                                  expandedMobileCatalog === catalog.id ? 'rotate-180' : '',
                                )}
                              />
                            </button>
                          )}
                        </div>

                        {/* Sub-catalogs List */}
                        {expandedMobileCatalog === catalog.id && (
                          <div className='flex flex-col gap-3 pl-4 animate-in fade-in slide-in-from-top-2 duration-300'>
                            <Link
                              href={`/catalog/${catalog.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className='text-[14px] font-serif uppercase text-brand-primary-900/50 tracking-widest hover:text-brand-primary-900'
                            >
                              {t('viewAll')}
                            </Link>
                            {catalog.children?.map((child) => (
                              <Link
                                key={child.id}
                                href={`/catalog/${catalog.slug}/${child.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className='text-[14px] font-serif uppercase text-brand-primary-900/80 tracking-widest hover:text-brand-primary-900'
                              >
                                {tl(child, 'name')}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {['showroom-factory', 'design-project', 'exports', 'blogs', 'contact-us'].map(
                (slug) => {
                  const key = slug.replace(/-([a-z])/g, (g, p1) => (p1 ? p1.toUpperCase() : ''));
                  return (
                    <Link
                      key={slug}
                      href={`/${slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className='text-[22px] font-serif uppercase text-brand-primary-900 tracking-wider'
                    >
                      {t(key as any)}
                    </Link>
                  );
                },
              )}
            </div>
          </div>

          {/* Mobile Footer (Language) */}
          <div className='px-8 py-8 border-t border-black/[0.05] bg-black/[0.01]'>
            <div className='flex items-center gap-6 font-serif text-[18px] uppercase tracking-widest text-brand-primary-900'>
              <LanguageSwitcher forceShow={true} isHeaderHovered={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black/20 backdrop-blur-sm z-[105] lg:hidden animate-in fade-in duration-500'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
