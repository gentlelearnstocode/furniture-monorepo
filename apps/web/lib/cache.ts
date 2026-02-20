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
export const createCachedQuery = <T, Args extends unknown[]>(
  queryFn: (...args: Args) => Promise<T>,
  keys: string[],
  options?: {
    revalidate?: number | false;
    tags?: string[] | ((...args: Args) => string[]);
  },
) => {
  return (...args: Args) => {
    const tags =
      typeof options?.tags === 'function' ? options.tags(...args) : (options?.tags ?? []);

    return unstable_cache(() => queryFn(...args), [...keys, ...args.map((a) => String(a))], {
      revalidate: options?.revalidate ?? 3600, // Default 1 hour
      tags,
    })();
  };
};
