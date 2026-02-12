# Specification: Breadcrumb Standardization

## Overview
Standardize breadcrumb labels and translations across the storefront (`apps/web`) to ensure consistency and improve user experience. The primary goal is to unify the root breadcrumb label and ensure all pages (static and dynamic) have accurate, localized breadcrumb trails.

## Objectives
- Unify the root breadcrumb label to "Home" (English) and "Trang chủ" (Vietnamese).
- Ensure consistent usage of the `AppBreadcrumb` component across the storefront.
- Provide full translation support for breadcrumb segments in all site sections.

## Functional Requirements
1.  **Translation Updates (`apps/web/messages/`):**
    -   Update `en.json`: Change `Breadcrumbs.home` from "Home Page" to "Home".
    -   Ensure `vi.json`: `Breadcrumbs.home` remains "Trang chủ".
    -   Audit and add missing segments for all main navigation sections (e.g., About Us, Showroom, Exports, etc.).

2.  **Breadcrumb Standardization:**
    -   Audit all storefront pages to ensure they implement `AppBreadcrumb`.
    -   Standardize the segment labels for:
        -   Static Pages (About Us, Contact, etc.)
        -   Dynamic Pages (Product Details, Category Listings, Collection Pages)
        -   Content Sections (Blogs/Stories, Services, Projects)

3.  **Dynamic Labeling:**
    -   Ensure breadcrumbs for Products, Services, and Blogs dynamically use the localized title of the current item.
    -   Category and Collection breadcrumbs must use the localized names fetched from the database.

4.  **Consistency Check:**
    -   Verify that all breadcrumb paths follow a logical hierarchy (e.g., `Home > Catalog > Category > Product`).

## Non-Functional Requirements
-   **Localization:** Support for English (`en`) and Vietnamese (`vi`).
-   **Performance:** Use cached database queries for dynamic breadcrumb segments where applicable.

## Acceptance Criteria
- [ ] Root breadcrumb is consistently labeled "Home" (EN) or "Trang chủ" (VI).
- [ ] Every user-facing page in `apps/web` displays a breadcrumb trail.
- [ ] Dynamic pages show the correct localized item name in the final segment.
- [ ] No "Home Page" text appears in any storefront breadcrumb.

## Out of Scope
-   Breadcrumb standardization in the Admin Dashboard (`apps/admin`).
-   Changing the UI/UX design of the `AppBreadcrumb` component.
