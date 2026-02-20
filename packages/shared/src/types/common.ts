/**
 * Base localized fields that can be optionally present on entities.
 */
export interface LocalizedFields {
  nameVi?: string | null;
  descriptionVi?: string | null;
  shortDescriptionVi?: string | null;
  titleVi?: string | null;
  introHtmlVi?: string | null;
  paragraphHtmlVi?: string | null;
  textHtmlVi?: string | null;
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
export type TranslationFunction = (key: string, values?: Record<string, unknown>) => string;

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
  asc: (column: unknown) => unknown;
  desc: (column: unknown) => unknown;
}

export interface DrizzleWhereOperators {
  eq: (column: unknown, value: unknown) => unknown;
  ne: (column: unknown, value: unknown) => unknown;
  gt: (column: unknown, value: unknown) => unknown;
  gte: (column: unknown, value: unknown) => unknown;
  lt: (column: unknown, value: unknown) => unknown;
  lte: (column: unknown, value: unknown) => unknown;
  inArray: (column: unknown, values: unknown[]) => unknown;
  isNull: (column: unknown) => unknown;
  isNotNull: (column: unknown) => unknown;
}
