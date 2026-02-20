# Implementation Plan: Audit and Implement Shared Types

## Phase 1: Audit & Discovery [checkpoint: 47f2f7a]
- [x] Task: Audit `apps/web` for type definitions and usage patterns (3cc349e)
- [x] Task: Audit `apps/admin` for type definitions and usage patterns (3cc349e)
- [x] Task: Create a type mapping report (documenting commonalities and differences) (3cc349e)
- [x] Task: Conductor - User Manual Verification 'Audit & Discovery' (Protocol in workflow.md) (47f2f7a)

## Phase 2: Core Entities Implementation (Product, Catalog, Collection) [checkpoint: 3bf2b38]
- [x] Task: Define core entity types in `@repo/shared/src/types` (923cdc3)
- [x] Task: Update `apps/web` to use shared core entity types (30e1169)
- [x] Task: Update `apps/admin` to use shared core entity types (301a930)
- [x] Task: Verify types with `pnpm check-types` in affected applications (301a930)
- [x] Task: Conductor - User Manual Verification 'Core Entities Implementation' (Protocol in workflow.md) (3bf2b38)

## Phase 3: Auth, Users & Content Implementation [checkpoint: 10e13e6]
- [x] Task: Define Auth, User, Blog, Project, and Service types in `@repo/shared` (10e13e6)
- [x] Task: Update `apps/web` to use shared types for these categories (30e1169)
- [x] Task: Update `apps/admin` to use shared types for these categories (10e13e6)
- [x] Task: Verify types with `pnpm check-types` (10e13e6)
- [x] Task: Conductor - User Manual Verification 'Auth, Users & Content Implementation' (Protocol in workflow.md) (10e13e6)

## Phase 4: Zod Schema Synchronization & Final Validation
- [~] Task: Identify and move common Zod schemas to `@repo/shared`
- [ ] Task: Final monorepo-wide type check and linting
- [ ] Task: Conductor - User Manual Verification 'Zod Schema Synchronization & Final Validation' (Protocol in workflow.md)
