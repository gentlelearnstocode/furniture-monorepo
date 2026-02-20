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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asc: (column: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  desc: (column: any) => any;
}

export interface DrizzleWhereOperators {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eq: (column: any, value: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ne: (column: any, value: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gt: (column: any, value: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gte: (column: any, value: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lt: (column: any, value: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lte: (column: any, value: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inArray: (column: any, values: any[]) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isNull: (column: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isNotNull: (column: any) => any;
}
