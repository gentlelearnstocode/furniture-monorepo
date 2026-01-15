/**
 * Utility functions for parsing and handling listing page parameters
 */

interface ListingParams {
  page: number;
  search: string;
  [key: string]: string | number | undefined;
}

/**
 * Parse search params for listing pages
 * @param searchParams - Next.js search params object
 * @param options - Optional configuration
 * @returns Parsed and typed parameters
 */
export async function parseListingParams<T extends Record<string, any>>(
  searchParams: Promise<T>,
  options?: {
    defaultPage?: number;
    filterKeys?: string[];
  }
): Promise<ListingParams> {
  const resolved = await searchParams;
  const { defaultPage = 1, filterKeys = [] } = options || {};

  const params: ListingParams = {
    page: Number(resolved.page) || defaultPage,
    search: (resolved.search as string) || '',
  };

  // Add any additional filter keys
  filterKeys.forEach((key) => {
    if (resolved[key]) {
      params[key] = resolved[key];
    }
  });

  return params;
}
