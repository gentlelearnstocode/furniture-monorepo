# Implementation Plan: Breadcrumb Standardization

## Phase 1: Localization & Core Setup [checkpoint: f8b2203]
Update the translation keys to ensure consistency and completeness across all supported languages.

- [x] Task: Update English translations (`apps/web/messages/en.json`) (Already correct)
- [x] Task: Update Vietnamese translations (`apps/web/messages/vi.json`) e8d8d24
- [x] Task: Conductor - User Manual Verification 'Phase 1: Localization & Core Setup' (Protocol in workflow.md) f8b2203

## Phase 2: Static & Main Navigation Pages [checkpoint: ea02f50]
Audit and update pages that have fixed labels or simple translations.

- [x] Task: Standardize Showroom & Factory page (`apps/web/app/showroom-factory/page.tsx`) c47ab14
- [x] Task: Standardize About Us page (Identify and update the relevant file, likely `apps/web/app/about-us/page.tsx`) c47ab14
- [x] Task: Standardize Contact Us page (`apps/web/app/contact-us/page.tsx`) c47ab14
- [x] Task: Standardize Exports page (`apps/web/app/exports/page.tsx`) c47ab14
- [x] Task: Standardize Design & Project page (`apps/web/app/design-project/page.tsx`) c47ab14
- [x] Task: Conductor - User Manual Verification 'Phase 2: Static & Main Navigation Pages' (Protocol in workflow.md) ea02f50

## Phase 3: Dynamic Content Modules
Update breadcrumbs for Services, Projects, and Blogs which involve both listing and detail pages.

## Phase 3: Dynamic Content Modules
Update breadcrumbs for Services, Projects, and Blogs which involve both listing and detail pages.

- [x] Task: Standardize Services module
    - Update Services listing page.
    - Update Service detail page (`apps/web/app/services/[slug]/page.tsx`).
- [x] Task: Standardize Projects module
    - Update Projects listing page.
    - Update Project detail page.
- [x] Task: Standardize Blogs/Stories module
    - Update Blogs listing page.
    - Update Blog detail page.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Dynamic Content Modules' (Protocol in workflow.md) c8a3c7d

## Phase 4: Catalog & Product Pages [checkpoint: c8a3c7d]
Standardize the most complex breadcrumb trails involving hierarchical data.

- [x] Task: Standardize Catalog root page
- [x] Task: Standardize Category detail pages c47ab14
- [x] Task: Standardize Collection pages
- [x] Task: Standardize Product detail pages c47ab14
- [x] Task: Conductor - User Manual Verification 'Phase 4: Catalog & Product Pages' (Protocol in workflow.md) c8a3c7d

## Phase 5: Final Audit & Polish [checkpoint: c8a3c7d]
Final check to ensure no edge cases were missed.

- [x] Task: Perform full-site manual audit for breadcrumb consistency.
- [x] Task: Conductor - User Manual Verification 'Phase 5: Final Audit & Polish' (Protocol in workflow.md) c8a3c7d
