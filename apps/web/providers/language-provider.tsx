'use client';

import { createContext, useContext, useMemo } from 'react';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import { Locale } from '@/lib/i18n';
import { getLocalized } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  isVietnamese: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  messages?: AbstractIntlMessages;
}

export function LanguageProvider({ children, initialLocale, messages }: LanguageProviderProps) {
  const value: LanguageContextType = useMemo(() => ({
    locale: initialLocale,
    isVietnamese: initialLocale === 'vi',
    isEnglish: initialLocale === 'en',
  }), [initialLocale]);

  return (
    <LanguageContext.Provider value={value}>
      <NextIntlClientProvider locale={initialLocale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access the language context.
 * Must be used within a LanguageProvider.
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Hook that combines useLanguage with getLocalized for convenient inline usage.
 */
export function useLocalizedText() {
  const { locale } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <T extends Record<string, any>>(entity: T, field: keyof T): string => {
    return getLocalized(entity, field, locale);
  };
}
