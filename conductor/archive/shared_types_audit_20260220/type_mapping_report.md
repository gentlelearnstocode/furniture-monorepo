# Type Mapping Report: Shared Types Audit

## 1. Core Entities

### Product
- **Common Fields:** `id`, `name`, `slug`, `description`, `shortDescription`, `basePrice`, `isActive`, `createdAt`, `updatedAt`
- **Variations:**
    - `apps/web`: Includes `Vi` fields (`nameVi`, `shortDescriptionVi`, `descriptionVi`). `basePrice` is sometimes `string`.
    - `apps/admin`: `basePrice` is `number | string`. `dimensions` is `unknown` or `object`.
    - `Zod Schema`: Includes both base and `Vi` fields.

### Catalog
- **Common Fields:** `id`, `name`, `slug`, `description`, `createdAt`, `updatedAt`
- **Variations:** `apps/web` often expects localized name/description.

### Collection
- **Common Fields:** `id`, `name`, `slug`, `description`, `isActive`, `createdAt`, `updatedAt`
- **Variations:** `apps/web` expects `nameVi`, `descriptionVi`, and `bannerUrl`.

## 2. Supporting Types

### Image & Gallery
- **Common Fields:** `url`, `isPrimary`
- **Shared Concept:** `ImageDisplaySettings` (focusPoint, aspectRatio, objectFit).
- **Variations:** `apps/web` uses `AspectRatio` and `ObjectFit` enums extensively in UI components.

### User & Auth
- **Common Fields:** `id`, `name`, `username`, `role`, `isActive`
- **Variations:** `UserRole` ('admin' | 'editor') is shared.

## 3. Localization Pattern
- **Pattern:** `field` (English) and `fieldVi` (Vietnamese).
- **Consolidation Strategy:** Move all localized types to `@repo/shared` with optional `Vi` fields to support both apps.

## 4. Zod Schemas
- Most schemas in `apps/admin/lib/validations` are canonical definitions for entities and should be shared.
