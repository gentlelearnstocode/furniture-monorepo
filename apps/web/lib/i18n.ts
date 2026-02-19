import { getLocale as getIntlLocale } from 'next-intl/server';

export type Locale = 'en' | 'vi';

export const DEFAULT_LOCALE: Locale = 'vi';

export const LOCALE_COOKIE_NAME = 'locale';

/**
 * Get the current locale (server-side).
 * In RSC, this uses next-intl/server's getLocale.
 */
export const getLocale = async (): Promise<Locale> => {
  return (await getIntlLocale()) as Locale;
};

/**
 * Get localized content with fallback logic.
 *
 * @param entity - The entity object
 * @param field - The base field name (English)
 * @param locale - The current locale
 * @returns The localized value, falling back to the base field
 */
export const getLocalized = <T extends Record<string, any>>(
  entity: T,
  field: keyof T,
  locale: string | Locale,
): string => {
  if (locale === 'vi') {
    const viField = `${String(field)}Vi` as keyof T;
    const viValue = entity[viField];
    if (viValue && typeof viValue === 'string' && viValue.trim() !== '') {
      return viValue;
    }
  }
  const value = entity[field];
  return typeof value === 'string' ? value : '';
};

/**
 * Legacy alias for getLocalized
 */
export const getLocalizedText = getLocalized;

/**
 * Get localized HTML content. Returns null if empty.
 */
export const getLocalizedHtml = <T extends Record<string, any>>(
  entity: T,
  field: keyof T,
  locale: string | Locale,
): string | null => {
  const value = getLocalized(entity, field, locale);
  return value.trim() !== '' ? value : null;
};

/**
 * Helper to check if a Vietnamese translation is available
 */
export const hasVietnameseTranslation = <T extends Record<string, any>>(
  entity: T,
  field: keyof T,
): boolean => {
  const viField = `${String(field)}Vi` as keyof T;
  const viValue = entity[viField];
  return typeof viValue === 'string' && viValue.trim() !== '';
};
