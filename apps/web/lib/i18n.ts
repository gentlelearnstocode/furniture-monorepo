export type Locale = 'en' | 'vi';

export const DEFAULT_LOCALE: Locale = 'vi';

export const LOCALE_COOKIE_NAME = 'locale';

/**
 * Get the current locale from cookies (for server components).
 * Import from 'next/headers' and call this in RSC to get the current locale.
 */
export async function getLocale(): Promise<Locale> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const stored = cookieStore.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined;
  return stored === 'vi' || stored === 'en' ? stored : DEFAULT_LOCALE;
}

/**
 * Get localized text with fallback to English.
 * Usage: getLocalizedText(product, 'name', locale)
 * Will return product.nameVi if locale === 'vi' and nameVi exists,
 * otherwise falls back to product.name
 *
 * @param entity - The entity object containing both English and Vietnamese fields
 * @param field - The base field name (English version)
 * @param locale - The current locale ('en' or 'vi')
 * @returns The localized string value, falling back to English if Vietnamese is not available
 */
export function getLocalizedText<T extends Record<string, unknown>>(
  entity: T,
  field: keyof T,
  locale: Locale,
): string {
  if (locale === 'vi') {
    // Construct the Vietnamese field name (e.g., 'name' -> 'nameVi')
    const viField = `${String(field)}Vi` as keyof T;
    const viValue = entity[viField];
    if (viValue && typeof viValue === 'string' && viValue.trim() !== '') {
      return viValue;
    }
  }
  // Fallback to English (default field)
  const value = entity[field];
  return typeof value === 'string' ? value : '';
}

/**
 * Get localized HTML content with fallback to English.
 * Same as getLocalizedText but returns null if no content available.
 *
 * @param entity - The entity object containing both English and Vietnamese fields
 * @param field - The base field name (English version)
 * @param locale - The current locale ('en' or 'vi')
 * @returns The localized HTML string value, or null if not available
 */
export function getLocalizedHtml<T extends Record<string, unknown>>(
  entity: T,
  field: keyof T,
  locale: Locale,
): string | null {
  if (locale === 'vi') {
    const viField = `${String(field)}Vi` as keyof T;
    const viValue = entity[viField];
    if (viValue && typeof viValue === 'string' && viValue.trim() !== '') {
      return viValue;
    }
  }
  const value = entity[field];
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

/**
 * Get multiple localized fields from an entity at once.
 * Returns an object with the localized values.
 *
 * @param entity - The entity object
 * @param fields - Array of base field names to localize
 * @param locale - The current locale
 * @returns Record mapping field names to their localized values
 */
export function getLocalizedFields<T extends Record<string, unknown>>(
  entity: T,
  fields: (keyof T)[],
  locale: Locale,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const field of fields) {
    result[String(field)] = getLocalizedText(entity, field, locale);
  }
  return result;
}

/**
 * Helper to check if a Vietnamese translation is available
 *
 * @param entity - The entity object
 * @param field - The base field name
 * @returns true if a non-empty Vietnamese translation exists
 */
export function hasVietnameseTranslation<T extends Record<string, unknown>>(
  entity: T,
  field: keyof T,
): boolean {
  const viField = `${String(field)}Vi` as keyof T;
  const viValue = entity[viField];
  return typeof viValue === 'string' && viValue.trim() !== '';
}
