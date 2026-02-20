# Specification: Resolve all 'any' types

## Overview
This track aims to eliminate all `any` type usages across the furniture monorepo. This will involve replacing `any` with specific interfaces, type aliases, or generic definitions, primarily utilizing the `@repo/shared` package. The focus is on improving type safety, developer experience, and code quality.

## Functional Requirements
- **Systematic Identification:** Audit all files in `apps/web`, `apps/admin`, and `packages/*` for `: any` or `any[]`.
- **Replacement Strategy:**
    - Priority 1: Use existing core entity types from `@repo/shared`.
    - Priority 2: Create new utility types in `@repo/shared` for common patterns.
    - Priority 3: Improve typing for external integrations (next-intl, Zod, Drizzle).
- **Core Entities Coverage:** Ensure `Product`, `Catalog`, `Collection`, `User`, `Blog`, `Project`, and `Service` types are fully applied.
- **Utility Types:** Define shared types for common UI props like `t` (translations), `params`, and `searchParams`.

## Non-Functional Requirements
- **Zero regressions:** Application logic must remain untouched.
- **Code Quality:** Achieve zero "Unexpected any" linting warnings in the affected areas.

## Acceptance Criteria
- [ ] No `: any` or `any[]` usages remain in the source code (excluding critical external overrides if absolutely necessary).
- [ ] `pnpm lint` returns zero warnings for `Unexpected any` in `apps/web` and `apps/admin`.
- [ ] `pnpm check-types` passes for all workspace projects.

## Out of Scope
- Refactoring application logic or component structures.
- Adding comprehensive unit tests (focus is purely on typing).
