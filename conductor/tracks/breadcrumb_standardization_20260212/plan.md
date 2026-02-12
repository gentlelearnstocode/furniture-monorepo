# Implementation Plan: Breadcrumb Standardization

## Phase 1: Localization & Core Setup
Update the translation keys to ensure consistency and completeness across all supported languages.

- [x] Task: Update English translations (`apps/web/messages/en.json`) (Already correct)
- [x] Task: Update Vietnamese translations (`apps/web/messages/vi.json`) e8d8d24
- [~] Task: Conductor - User Manual Verification 'Phase 1: Localization & Core Setup' (Protocol in workflow.md)

## Phase 2: Static & Main Navigation Pages
Audit and update pages that have fixed labels or simple translations.

- [ ] Task: Standardize Showroom & Factory page (`apps/web/app/showroom-factory/page.tsx`)
- [ ] Task: Standardize About Us page (Identify and update the relevant file, likely `apps/web/app/about-us/page.tsx`)
- [ ] Task: Standardize Contact Us page (`apps/web/app/contact-us/page.tsx`)
- [ ] Task: Standardize Exports page (`apps/web/app/exports/page.tsx`)
- [ ] Task: Standardize Design & Project page (`apps/web/app/design-project/page.tsx`)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Static & Main Navigation Pages' (Protocol in workflow.md)

## Phase 3: Dynamic Content Modules
Update breadcrumbs for Services, Projects, and Blogs which involve both listing and detail pages.

- [ ] Task: Standardize Services module
    - Update Services listing page.
    - Update Service detail page (`apps/web/app/services/[slug]/page.tsx`).
- [ ] Task: Standardize Projects module
    - Update Projects listing page.
    - Update Project detail page.
- [ ] Task: Standardize Blogs/Stories module
    - Update Blogs listing page.
    - Update Blog detail page.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Dynamic Content Modules' (Protocol in workflow.md)

## Phase 4: Catalog & Product Pages
Standardize the most complex breadcrumb trails involving hierarchical data.

- [ ] Task: Standardize Catalog root page
- [ ] Task: Standardize Category detail pages
- [ ] Task: Standardize Collection pages
- [ ] Task: Standardize Product detail pages
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Catalog & Product Pages' (Protocol in workflow.md)

## Phase 5: Final Audit & Polish
Final check to ensure no edge cases were missed.

- [ ] Task: Perform full-site manual audit for breadcrumb consistency.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Audit & Polish' (Protocol in workflow.md)
