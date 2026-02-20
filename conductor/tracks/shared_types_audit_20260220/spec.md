# Specification: Audit and Implement Shared Types

## Overview
This track involves a comprehensive audit of TypeScript types used in the `apps/web` and `apps/admin` applications. The goal is to identify common types and move them to the `@repo/shared` package to ensure consistency across the monorepo and reduce code duplication.

## Functional Requirements
- **Audit Phases:**
    - Audit `apps/web` and `apps/admin` for local type definitions (`types/` folders and inline).
    - Categorize found types (Product, Catalog, User, Blog, etc.).
- **Shared Implementation:**
    - Create new shared type definitions in `packages/shared/src/types`.
    - Handle overlaps: If types differ significantly between apps, maintain separate versions in the shared package (e.g., `SharedUser` vs. `AdminUser`).
- **Refactoring:**
    - Replace local type imports in `apps/web` and `apps/admin` with imports from `@repo/shared`.
- **Zod Synchronization:**
    - Identify corresponding Zod schemas and move them to `@repo/shared/src/utils` or `src/validation` if applicable.

## Non-Functional Requirements
- Maintain strict type safety across the entire monorepo.
- Ensure zero impact on existing application functionality.

## Acceptance Criteria
- [ ] Comprehensive audit report generated for `web` and `admin`.
- [ ] Shared types for Core Entities (Product, Catalog, Collection) implemented in `@repo/shared`.
- [ ] Shared types for Auth & Users implemented.
- [ ] Shared types for Content & Media (Blog, Projects, Services) implemented.
- [ ] All apps compile successfully with `pnpm check-types`.
- [ ] No local type duplication for audited entities.

## Out of Scope
- Major restructuring of the database schema.
- Refactoring application logic beyond type import updates.
- Implementing complex business logic in the shared package.
