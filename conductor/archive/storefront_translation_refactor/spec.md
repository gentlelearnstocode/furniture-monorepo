# Track Specification: Storefront Translation Refactor

## Objective
Refactor the storefront (`apps/web`) to use URL-based localization (`[locale]` dynamic segment) instead of cookie-based switching. This will improve SEO and user experience by providing dedicated URLs for each language and enabling instant, client-side language switching.

## Current Issues
1.  **Cookie-based Locale**: URL remains the same for both languages, preventing search engines from indexing Vietnamese content.
2.  **Forced Reloads**: Switching languages triggers `window.location.reload()`.
3.  **Fragmented Logic**: Translation helpers are duplicated in `lib/i18n.ts`, `providers/language-provider.tsx`, and manually implemented in several pages.
4.  **Incomplete SEO**: `generateMetadata` does not fully leverage `next-intl` for translated titles and descriptions.

## Proposed Changes
1.  **Routing**: Wrap all storefront routes in a `[locale]` dynamic segment (e.g., `app/[locale]/about-us`).
2.  **Middleware**: Add `middleware.ts` to handle locale detection and redirection.
3.  **Navigation**: Use `next-intl/navigation` (`Link`, `usePathname`, `useRouter`) for seamless transitions.
4.  **Consolidated Dynamic Translation**: 
    - Unify dynamic database field translation logic (e.g., `name` vs `nameVi`) into a single, robust, type-safe helper.
    - Explicitly handle varied content types: simple strings (product names), descriptions, and rich text/HTML (blog content).
    - Ensure helpers work consistently in both Server Components (RSC) and Client Components.
5.  **Metadata**: Implement localized metadata for all major pages.
6.  **Cleanup**: Remove the need for `LanguageProvider`'s `window.location.reload()` and clean up cookie-only dependencies.

## Key Files to Modify
- `apps/web/app/*` (Move to `apps/web/app/[locale]/*`)
- `apps/web/middleware.ts` (New)
- `apps/web/lib/i18n.ts`
- `apps/web/providers/language-provider.tsx`
- `apps/web/next.config.js`
- `apps/web/i18n/routing.ts` (New for `next-intl` v4 configuration)
- `apps/web/i18n/request.ts` (Update)

## Success Criteria
- [ ] Dedicated URLs like `/en/about-us` and `/vi/about-us` work correctly.
- [ ] Switching languages is instant (no full page reload).
- [ ] Search engines can crawl both English and Vietnamese versions.
- [ ] Proper metadata is generated for both languages.
