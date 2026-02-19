# Implementation Plan: Storefront Translation Refactor

This plan outlines the steps required to refactor the storefront translation system to use URL-based localization (`[locale]` segment) and `next-intl` middleware.

## Phase 1: Setup Routing & Middleware [checkpoint: 6de3396]
1.  [x] **Configure Routing**:
    - Create `apps/web/i18n/routing.ts` to define locales, default locale, and path mappings using `next-intl`.
2.  [x] **Add Proxy**:
    - Create `apps/web/proxy.ts` to handle locale detection and redirection using the routing config (replaces deprecated `middleware.ts` in Next.js 16).
3.  [x] **Update Config**:
    - Update `apps/web/next.config.js` to ensure proper integration with `next-intl`.

## Phase 2: Structural Refactor [checkpoint: 6de3396]
1.  [x] **Move Application Pages**:
    - Create `apps/web/app/[locale]` directory.
    - Move all existing page files (`app/page.tsx`, `app/about-us/page.tsx`, etc.) and `layout.tsx` into `app/[locale]/`.
    - Note: Keep files that should NOT be localized (like `app/api/` or `app/icon.svg`) in the root `app/` directory if necessary.
2.  [x] **Refactor Root Layout**:
    - Update `app/[locale]/layout.tsx` to handle the `locale` parameter from `params`.
    - Ensure `LanguageProvider` receives the correct locale and messages.

## Phase 3: Update Components & Helpers [checkpoint: 6de3396]
1.  [x] **Refactor Dynamic Translation Helpers**:
    - Update `apps/web/lib/i18n.ts` to provide a single, type-safe `getLocalized(entity, field, locale)` helper.
    - Ensure it handles string, rich text, and HTML fields with consistent Vietnamese-suffix fallback logic (`field` -> `fieldVi`).
    - Standardize the `useLocalizedText` hook in `LanguageProvider.tsx` to use the shared core logic.
2.  [x] **Audit Data Usage**:
    - Review all components fetching data (e.g., `ProductCard`, `BlogsSection`, `Hero`) and ensure they use the new helper instead of manual `locale === 'vi'` checks.
    - Specifically check rich text fields in blog and custom pages for proper localization.
3.  [x] **Replace Navigation**:
    - Update `Link` and `useRouter` imports from `next/link` and `next/navigation` to use the localized versions from `next-intl/navigation`.
    - Update `NavbarV2` to use localized links and remove `window.location.reload()` on language switch.

## Phase 4: SEO & Metadata [checkpoint: 6de3396]
1.  [x] **Localized Metadata**:
    - Add `generateMetadata` to major pages (`Home`, `About Us`, `Catalog`, etc.) using `getTranslations` to provide localized SEO titles and descriptions.

## Phase 5: Testing & Cleanup [checkpoint: 6de3396]
1.  [x] **Verify Locales**:
    - Ensure `/en` and `/vi` work correctly.
    - Test client-side navigation between locales.
2.  [x] **Verify SEO**:
    - Check for correct `lang` attribute in `<html>` and localized metadata.
3.  [x] **Final Cleanup**:
    - Remove legacy cookie-only code and redundant logic.
