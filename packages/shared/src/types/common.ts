/**
 * Base localized fields that can be optionally present on entities.
 */
export interface LocalizedFields {
  nameVi?: string | null;
  descriptionVi?: string | null;
  shortDescriptionVi?: string | null;
  titleVi?: string | null;
}

/**
 * Common metadata fields present on most database-backed entities.
 */
export interface EntityBase {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Type for next-intl translation function
 */
export type TranslationFunction = (key: string, values?: Record<string, any>) => string;

/**
 * Common Next.js Page Props
 */
export interface NextPageProps<T = Record<string, string>> {
  params: Promise<T>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Helper types for Drizzle queries commonly used in admin actions
 */
export interface DrizzleOrderByOperators {
  asc: (column: any) => any;
  desc: (column: any) => any;
}
