/**
 * Utility to revalidate the storefront cache from the admin app.
 * Calls the web app's /api/revalidate endpoint to invalidate specific cache tags.
 *
 * Features:
 * - Retry logic with exponential backoff (3 attempts)
 * - Request timeout (5 seconds per request)
 * - Detailed result object for caller feedback
 */

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

// Configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT_MS = 5000;
const BASE_DELAY_MS = 1000; // 1 second base delay for exponential backoff

export type RevalidationResult = {
  success: boolean;
  revalidated?: string[];
  error?: string;
  attempts: number;
};

/**
 * Delay execution for a specified number of milliseconds
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates an AbortController with a timeout
 */
function createTimeoutController(timeoutMs: number): {
  controller: AbortController;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    controller,
    cleanup: () => clearTimeout(timeoutId),
  };
}

/**
 * Revalidates cache tags on the storefront with retry logic.
 * Should be called after content mutations in admin actions.
 *
 * @param tags - Array of cache tags to revalidate (e.g., ['hero'], ['products', 'catalogs'])
 * @returns Promise<RevalidationResult> - Detailed result with success status and attempt info
 *
 * @example
 * // After updating hero section
 * const result = await revalidateStorefront(['hero']);
 * if (!result.success) {
 *   console.error('Failed to revalidate:', result.error);
 * }
 *
 * @example
 * // After updating a product
 * const result = await revalidateStorefront(['products', 'catalogs']);
 * // result.attempts shows how many tries it took
 */
export async function revalidateStorefront(tags: string[]): Promise<RevalidationResult> {
  // Validate configuration
  if (!REVALIDATION_SECRET) {
    console.warn(
      '[revalidateStorefront] REVALIDATION_SECRET is not configured, skipping revalidation'
    );
    return {
      success: false,
      error: 'REVALIDATION_SECRET is not configured',
      attempts: 0,
    };
  }

  // Validate input
  if (!tags || tags.length === 0) {
    console.warn('[revalidateStorefront] No tags provided, skipping revalidation');
    return {
      success: false,
      error: 'No tags provided',
      attempts: 0,
    };
  }

  let lastError: string = 'Unknown error';

  // Retry loop with exponential backoff
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const { controller, cleanup } = createTimeoutController(REQUEST_TIMEOUT_MS);

    try {
      console.log(
        `[revalidateStorefront] Attempt ${attempt}/${MAX_RETRIES} for tags: ${tags.join(', ')}`
      );

      const response = await fetch(`${WEB_URL}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${REVALIDATION_SECRET}`,
        },
        body: JSON.stringify({ tags }),
        cache: 'no-store',
        signal: controller.signal,
      });

      cleanup();

      if (response.ok) {
        const result = await response.json();
        console.log(
          `[revalidateStorefront] Successfully revalidated tags: ${result.revalidated?.join(', ')} (attempt ${attempt})`
        );
        return {
          success: true,
          revalidated: result.revalidated,
          attempts: attempt,
        };
      }

      // Handle HTTP errors
      const errorBody = await response.json().catch(() => ({}));
      lastError = errorBody.error || `HTTP ${response.status}: ${response.statusText}`;

      if (response.status === 401) {
        // Auth errors won't succeed on retry
        console.error('[revalidateStorefront] Authentication failed - check REVALIDATION_SECRET');
        return {
          success: false,
          error: 'Authentication failed - check REVALIDATION_SECRET configuration',
          attempts: attempt,
        };
      }

      console.warn(`[revalidateStorefront] Attempt ${attempt} failed: ${lastError}`);
    } catch (error) {
      cleanup();

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          lastError = `Request timeout after ${REQUEST_TIMEOUT_MS}ms`;
          console.warn(
            `[revalidateStorefront] Attempt ${attempt} timed out after ${REQUEST_TIMEOUT_MS}ms`
          );
        } else {
          lastError = error.message;
          console.warn(`[revalidateStorefront] Attempt ${attempt} error: ${error.message}`);
        }
      } else {
        lastError = 'Unknown error occurred';
        console.warn(`[revalidateStorefront] Attempt ${attempt} failed with unknown error`);
      }
    }

    // Wait before next retry (exponential backoff: 1s, 2s, 4s)
    if (attempt < MAX_RETRIES) {
      const delayMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`[revalidateStorefront] Waiting ${delayMs}ms before retry...`);
      await delay(delayMs);
    }
  }

  // All retries exhausted
  console.error(
    `[revalidateStorefront] Failed to revalidate tags [${tags.join(', ')}] after ${MAX_RETRIES} attempts: ${lastError}`
  );

  return {
    success: false,
    error: `Failed after ${MAX_RETRIES} attempts: ${lastError}`,
    attempts: MAX_RETRIES,
  };
}
