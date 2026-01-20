'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale, DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isVietnamese: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || DEFAULT_LOCALE);

  // Load from cookie on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && !initialLocale) {
      const stored = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
        ?.split('=')[1] as Locale | undefined;
      if (stored === 'vi' || stored === 'en') {
        setLocaleState(stored);
      }
    }
  }, [initialLocale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Store in cookie for 1 year
    if (typeof window !== 'undefined') {
      document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    }
  }, []);

  const value: LanguageContextType = {
    locale,
    setLocale,
    isVietnamese: locale === 'vi',
    isEnglish: locale === 'en',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Hook to access the language context.
 * Must be used within a LanguageProvider.
 *
 * @returns LanguageContextType with locale, setLocale, isVietnamese, isEnglish
 * @throws Error if used outside of LanguageProvider
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Hook that combines useLanguage with getLocalizedText for convenient inline usage.
 * Returns a function that can be called to get localized text.
 *
 * Usage:
 * const t = useLocalizedText();
 * const productName = t(product, 'name');
 */
export function useLocalizedText() {
  const { locale } = useLanguage();

  return function <T extends object>(entity: T, field: keyof T): string {
    if (locale === 'vi') {
      const viField = `${String(field)}Vi` as keyof T;
      const viValue = (entity as any)[viField];
      if (viValue && typeof viValue === 'string' && viValue.trim() !== '') {
        return viValue;
      }
    }
    const value = entity[field];
    return typeof value === 'string' ? value : '';
  };
}
