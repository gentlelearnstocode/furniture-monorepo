# Specification: Scaffold '@repo/shared' package

## Overview
This track involves scaffolding a new internal package named `shared` within the `packages/` directory of the furniture monorepo. This package will be named `@repo/shared` and serve as a central location for shared TypeScript types and utility functions between the `admin` and `web` applications.

## Functional Requirements
- Create a new directory `packages/shared`.
- Initialize `package.json` with appropriate name (`@repo/shared`) and version.
- Initialize `tsconfig.json` extending `@repo/typescript-config`.
- Set up initial directory structure:
  - `src/`
    - `types/`
    - `utils/`
    - `index.ts` (Entry point exporting from `types` and `utils`).
- Register the new package within the monorepo workspace.

## Non-Functional Requirements
- Adhere to the existing monorepo architectural patterns and naming conventions (e.g., `@repo/*`).
- Ensure the package is correctly linked for use by other packages/apps.

## Acceptance Criteria
- [ ] `packages/shared` directory exists.
- [ ] `package.json` and `tsconfig.json` are present and correctly configured.
- [ ] `src/types` and `src/utils` directories exist.
- [ ] `pnpm install` successfully links the new package.

## Out of Scope
- Implementing actual shared logic or complex types in this track.
- Setting up build/deployment pipelines for this package (beyond what's standard for the monorepo).
