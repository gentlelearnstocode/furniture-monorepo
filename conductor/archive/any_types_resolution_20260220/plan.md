# Implementation Plan: Resolve all 'any' types

## Phase 1: Audit & Infrastructure [checkpoint: 4a4f5f9]
- [x] Task: Generate a comprehensive list of all remaining `any` usages in the monorepo (4a4f5f9)
- [x] Task: Define common utility types in `@repo/shared/src/types/common.ts` (e.g., `TranslationFunction`, `NextPageProps`) (4a4f5f9)
- [x] Task: Conductor - User Manual Verification 'Audit & Infrastructure' (Protocol in workflow.md) (4a4f5f9)

## Phase 2: Resolve 'any' in apps/web [checkpoint: 6d60b16]
- [x] Task: Replace `any` in `apps/web/app/[locale]/layout.tsx` and core components (6d60b16)
- [x] Task: Replace `any` in entity-specific pages (Product, Catalog, Collection) (6d60b16)
- [x] Task: Replace `any` in content pages (Blog, Projects, Services) (6d60b16)
- [x] Task: Verify with `pnpm --filter web check-types` and linting (6d60b16)
- [x] Task: Conductor - User Manual Verification 'Resolve any in apps/web' (Protocol in workflow.md) (6d60b16)

## Phase 3: Resolve 'any' in apps/admin & packages [checkpoint: 6d60b16]
- [x] Task: Replace `any` in `apps/admin` (actions, components, validations) (6d60b16)
- [x] Task: Replace `any` in `packages/*` (if any remain) (6d60b16)
- [x] Task: Verify with monorepo-wide `pnpm check-types` and `pnpm lint` (6d60b16)
- [x] Task: Conductor - User Manual Verification 'Resolve any in apps/admin & packages' (Protocol in workflow.md) (6d60b16)

## Phase 4: Final Verification [checkpoint: f142023]
- [x] Task: Ensure zero "Unexpected any" warnings in the entire monorepo (6d60b16)
- [x] Task: Final monorepo-wide build check (f142023)
- [x] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md) (f142023)
