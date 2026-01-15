/**
 * Utility to revalidate the storefront cache from the admin app.
 * Calls the web app's /api/revalidate endpoint to invalidate specific cache tags.
 */

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

/**
 * Revalidates cache tags on the storefront.
 * Should be called after content mutations in admin actions.
 *
 * @param tags - Array of cache tags to revalidate (e.g., ['hero'], ['products', 'catalogs'])
 * @returns Promise<boolean> - true if revalidation succeeded, false otherwise
 *
 * @example
 * // After updating hero section
 * await revalidateStorefront(['hero']);
 *
 * @example
 * // After updating a product (revalidate both list and potential catalog views)
 * await revalidateStorefront(['products', 'catalogs']);
 */
export async function revalidateStorefront(tags: string[]): Promise<boolean> {
  if (!REVALIDATION_SECRET) {
    console.warn(
      '[revalidateStorefront] REVALIDATION_SECRET is not configured, skipping revalidation'
    );
    return false;
  }

  if (!tags || tags.length === 0) {
    console.warn('[revalidateStorefront] No tags provided, skipping revalidation');
    return false;
  }

  try {
    const response = await fetch(`${WEB_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${REVALIDATION_SECRET}`,
      },
      body: JSON.stringify({ tags }),
      // Don't cache this request
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error(
        `[revalidateStorefront] Failed to revalidate tags [${tags.join(', ')}]:`,
        error
      );
      return false;
    }

    const result = await response.json();
    console.log(
      `[revalidateStorefront] Successfully revalidated tags: ${result.revalidated?.join(', ')}`
    );
    return true;
  } catch (error) {
    // Log but don't throw - revalidation failure shouldn't break the admin operation
    console.error('[revalidateStorefront] Error:', error);
    return false;
  }
}
