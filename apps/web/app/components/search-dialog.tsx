'use client';

import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocalizedText } from '@/providers/language-provider';

interface SearchResult {
  id: string;
  name: string;
  nameVi: string | null;
  slug: string;
  price: string;
  image: string | null;
  imageAlt: string;
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const t = useTranslations('Search');
  const tl = useLocalizedText();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  React.useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Global keyboard shortcut (Cmd/Ctrl + K)
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // This will be handled by parent - we just prevent default
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  // Keyboard navigation within dialog
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }

    if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      router.push(`/product/${results[selectedIndex].slug}`);
      onClose();
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] animate-in fade-in duration-200'
        onClick={onClose}
      />

      {/* Dialog */}
      <div className='fixed inset-x-4 top-[10vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-[201] animate-in fade-in slide-in-from-top-4 duration-300'>
        <div className='bg-white rounded-xl shadow-2xl overflow-hidden'>
          {/* Search Input */}
          <div className='flex items-center gap-4 px-6 py-4 border-b border-gray-100'>
            <Search className='w-5 h-5 text-gray-400 flex-shrink-0' />
            <input
              ref={inputRef}
              type='text'
              placeholder={t('placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className='flex-1 text-lg outline-none placeholder:text-gray-400'
            />
            {isLoading && <Loader2 className='w-5 h-5 text-gray-400 animate-spin' />}
            <button
              onClick={onClose}
              className='p-1 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <X className='w-5 h-5 text-gray-500' />
            </button>
          </div>

          {/* Results */}
          <div className='max-h-[60vh] overflow-y-auto'>
            {query.length >= 2 && results.length === 0 && !isLoading && (
              <div className='px-6 py-12 text-center text-gray-500'>
                <Search className='w-12 h-12 mx-auto mb-4 text-gray-300' />
                <p>{t('noResults', { query })}</p>
              </div>
            )}

            {results.length > 0 && (
              <ul className='py-2'>
                {results.map((result, index) => (
                  <li key={result.id}>
                    <Link
                      href={`/product/${result.slug}`}
                      onClick={onClose}
                      className={`flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors ${
                        selectedIndex === index ? 'bg-gray-50' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className='w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                        {result.image ? (
                          <NextImage
                            src={result.image}
                            alt={result.imageAlt}
                            width={64}
                            height={64}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-400'>
                            <Search className='w-6 h-6' />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-medium text-gray-900 truncate'>{tl(result, 'name')}</h4>
                        <p className='text-sm text-[#49000D] font-medium'>
                          {formatPrice(result.price)}
                        </p>
                      </div>

                      {/* Keyboard hint */}
                      {selectedIndex === index && (
                        <span className='text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded'>
                          Enter ↵
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Empty state - initial */}
            {query.length < 2 && (
              <div className='px-6 py-12 text-center text-gray-500'>
                <p className='mb-2'>{t('initialHint')}</p>
                <p className='text-sm text-gray-400'>{t('shortcutHint')}</p>
              </div>
            )}
          </div>

          {/* Footer - simplified on mobile */}
          <div className='px-4 md:px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500'>
            <div className='hidden md:flex items-center gap-4'>
              <span className='flex items-center gap-1'>
                <kbd className='px-1.5 py-0.5 bg-white rounded border border-gray-200 font-mono'>
                  ↑
                </kbd>
                <kbd className='px-1.5 py-0.5 bg-white rounded border border-gray-200 font-mono'>
                  ↓
                </kbd>
                <span className='ml-1'>{t('navigate')}</span>
              </span>
              <span className='flex items-center gap-1'>
                <kbd className='px-1.5 py-0.5 bg-white rounded border border-gray-200 font-mono'>
                  ↵
                </kbd>
                <span className='ml-1'>{t('select')}</span>
              </span>
              <span className='flex items-center gap-1'>
                <kbd className='px-1.5 py-0.5 bg-white rounded border border-gray-200 font-mono'>
                  Esc
                </kbd>
                <span className='ml-1'>{t('close')}</span>
              </span>
            </div>
            {/* Mobile hint */}
            <span className='md:hidden text-gray-400'>{t('tapOutsideToClose')}</span>
          </div>
        </div>
      </div>
    </>
  );
}
