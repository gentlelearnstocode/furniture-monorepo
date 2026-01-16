import { unstable_cache } from 'next/cache';

/**
 * Creates a cached database query with automatic revalidation
 *
 * @param queryFn - The database query function to cache
 * @param keys - Cache key identifiers (should be unique per query)
 * @param options - Cache configuration options
 * @returns Cached query function
 *
 * @example
 * const getServices = createCachedQuery(
 *   () => db.query.services.findMany({ where: ... }),
 *   ['services-list'],
 *   { revalidate: 3600, tags: ['services'] }
 * );
 */
export function createCachedQuery<T, Args extends any[]>(
  queryFn: (...args: Args) => Promise<T>,
  keys: string[],
  options?: {
    revalidate?: number | false;
    tags?: string[];
  }
) {
  return (...args: Args) =>
    unstable_cache(() => queryFn(...args), [...keys, ...args.map((a) => String(a))], {
      revalidate: options?.revalidate ?? 3600, // Default 1 hour
      tags: options?.tags ?? [],
    })();
}
