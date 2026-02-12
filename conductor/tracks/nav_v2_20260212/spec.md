# Specification: Navigation V2

## Overview
The goal of this track is to evolve the storefront navigation from a single "Products" mega-menu to a more direct and elegant multi-level menu. In Navigation V2, top-level Catalogs will be displayed directly as primary navigation items. Hovering over a Catalog will reveal its Sub-catalogs.

## Requirements
- **Deprecation:** Mark the existing `Navbar` component as deprecated. Retain the code for reference but transition the application to use `NavbarV2`.
- **Dynamic Catalog Items:** The top-level navigation (Tier 2) should dynamically render primary Catalogs fetched from the database.
- **Hover Interactions:**
    - Hovering over a Catalog item should display a dropdown or sub-menu containing its Sub-catalogs.
    - Transitions should be smooth and elegant (e.g., subtle fades or transforms).
- **Responsive Design:** The new navigation must maintain full responsiveness, ensuring a high-quality experience on mobile and tablet devices.
- **Visual Aesthetic:** Align with the "Modern & Minimalist" and "Professional & Elegant" principles defined in the Product Guidelines.
- **Maintain Existing Features:** Retain Search, Logo, Language Switcher, and links to "About Us", "Showroom", "Design Project", "Exports", "Blogs", and "Contact Us".

## Technical Details
- **Component:** Create `apps/web/app/components/navbar-v2.tsx`.
- **Data Fetching:** Continue to use the `getRootCatalogs` query in `RootLayout` to provide data to the new component.
- **State Management:** Manage hover states to control the visibility of sub-catalog menus.
- **Styling:** Use Tailwind CSS for transitions and layout.
