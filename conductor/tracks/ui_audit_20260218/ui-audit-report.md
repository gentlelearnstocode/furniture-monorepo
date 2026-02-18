# UI Audit Report (`ui_audit_20260218`)

## Status: Completed (Phase 1)
**Audit Date:** 2026-02-18

---

## 1. Inconsistent Typography (font-sans)
Found major discrepancies in how `font-sans` is defined and used across the workspace.

- **`packages/tailwind-config/tailwind.config.ts`**: Currently sets `sans` to `Playfair_Display`, which is a serif font.
- **`apps/admin/tailwind.config.ts`**: Overrides `sans` to `Inter`.
- **`apps/web/app/layout.tsx`**: Uses `GeistSans` and `Playfair_Display` variables, but assigns `geistSans` as `font-sans` in the `body` class.

**Standardization Goal:**
- **Admin Portal:** Standardize on `sans-serif` (Inter) for all functional UI.
- **Web Storefront:** Standardize on `Playfair Display` (serif) as the primary brand font.
- **Implementation:** Move these definitions to `packages/tailwind-config` and provide clear `font-sans` and `font-serif` (or `font-brand`) utilities.

---

## 2. Inconsistent Color and Border Usage
Mixed usage of Tailwind default colors (`gray`, `zinc`, `neutral`) and custom `brand-neutral` colors.

- **Admin Portal:**
  - `AdminLayout`: `bg-gray-50/50`, `border-gray-100`.
  - `ListingCard`: `border-gray-200`.
  - `Sidebar`: `text-brand-neutral-900`, `bg-brand-primary-600`.
  - `PageHeader`: `text-gray-500`, `text-gray-900`.
- **Web Storefront:**
  - `NavbarV2`: Hardcoded `text-[#49000D]`, `border-black/[0.03]`.
  - `Footer`: Hardcoded `text-[#7B0C0C]`, `bg-[#7B0C0C]`, `text-gray-700`, `text-gray-900`, `text-gray-600`, `text-gray-500`, `border-gray-200`, `border-gray-300`, `bg-gray-700`.
  - `Hero`: `hover:bg-gray-200`.

**Recommendation:**
- Standardize on `brand-neutral-*` for all functional UI elements (borders, text, backgrounds).
- Map hardcoded brand colors (`#49000D`, `#7B0C0C`) to the `brand-primary-*` scale in Tailwind.
- Avoid raw `gray-*` classes unless they are part of a library (like shadcn/ui defaults that haven't been mapped yet).

---

## 3. Component Inconsistencies (Breadcrumbs)
Shared UI components from `@repo/ui` are not consistently used.

- **Findings:** `apps/admin/components/layout/page-header.tsx` implements manual breadcrumbs with `span` and `mx-2 /`, ignoring the `Breadcrumb` component available in `packages/ui/src/components/ui/breadcrumb.tsx`.

**Recommendation:**
- Refactor `PageHeader` to use the standard `@repo/ui/ui/breadcrumb`.

---

## 4. Admin Layout Spacing (Hardcoded Values)
Admin layout uses hardcoded padding and max-widths that might not be ideal for all screen sizes.

- **Findings:** `AdminLayout` has `p-6` on `main` and `max-w-7xl` on the inner container.
- **Issues:** This can cause misalignment with header/footer if they don't share the same padding/container constraints.

**Recommendation:**
- Use a shared `Container` component or standardized layout classes to ensure consistency across all dashboard pages.

---

## 5. Shared Utility Inconsistencies (`cn`)
The `twMerge` and `clsx` utilities are redefined in multiple places instead of using the shared library.

- **Findings:** `apps/web/app/components/navbar-v2.tsx` defines its own `cn` function.
- **Issues:** This leads to code duplication and potential differences in how class merging is handled.

**Recommendation:**
- Use `import { cn } from '@repo/ui/lib/utils'` everywhere.

---

## 6. Admin-to-Web Stylistic Discrepancies
The Admin Tiptap editor doesn't share styling with the Web Storefront content renderer.

- **Findings:** The TipTap editor uses basic `border-gray-300`, while the storefront might use specific serif fonts and colors for headings.
- **Issues:** "What you see" in admin is not "what you get" in storefront.

**Recommendation:**
- Create a shared `typography.css` or similar in `@repo/ui` that both the TipTap editor and the storefront renderer consume.
- Ensure fonts match (Playfair for headings) in the editor's preview mode.

---
