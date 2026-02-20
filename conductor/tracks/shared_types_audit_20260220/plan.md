# Implementation Plan: Audit and Implement Shared Types

## Phase 1: Audit & Discovery
- [ ] Task: Audit `apps/web` for type definitions and usage patterns
- [ ] Task: Audit `apps/admin` for type definitions and usage patterns
- [ ] Task: Create a type mapping report (documenting commonalities and differences)
- [ ] Task: Conductor - User Manual Verification 'Audit & Discovery' (Protocol in workflow.md)

## Phase 2: Core Entities Implementation (Product, Catalog, Collection)
- [ ] Task: Define core entity types in `@repo/shared/src/types`
- [ ] Task: Update `apps/web` to use shared core entity types
- [ ] Task: Update `apps/admin` to use shared core entity types
- [ ] Task: Verify types with `pnpm check-types` in affected applications
- [ ] Task: Conductor - User Manual Verification 'Core Entities Implementation' (Protocol in workflow.md)

## Phase 3: Auth, Users & Content Implementation
- [ ] Task: Define Auth, User, Blog, Project, and Service types in `@repo/shared`
- [ ] Task: Update `apps/web` to use shared types for these categories
- [ ] Task: Update `apps/admin` to use shared types for these categories
- [ ] Task: Verify types with `pnpm check-types`
- [ ] Task: Conductor - User Manual Verification 'Auth, Users & Content Implementation' (Protocol in workflow.md)

## Phase 4: Zod Schema Synchronization & Final Validation
- [ ] Task: Identify and move common Zod schemas to `@repo/shared`
- [ ] Task: Final monorepo-wide type check and linting
- [ ] Task: Conductor - User Manual Verification 'Zod Schema Synchronization & Final Validation' (Protocol in workflow.md)
