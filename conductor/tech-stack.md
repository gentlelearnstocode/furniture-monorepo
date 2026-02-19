# Technology Stack: ThienAn Furniture Monorepo

## Core Infrastructure
- **Monorepo Manager:** [Turborepo 2.6](https://turbo.build/repo) - High-performance build system for JavaScript/TypeScript monorepos.
- **Package Manager:** [pnpm 9.0](https://pnpm.io/) - Fast, disk space efficient package manager.
- **Language:** [TypeScript 5.9](https://www.typescriptlang.org/) - Strict type checking for robust development.

## Frontend & Applications
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) - React framework for production-grade web applications.
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development.
- **Design Tokens:** Standardized CSS variable scale for Brand Colors (#7B0C0C scale) and Functional Neutral colors.
- **UI Component Library:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) - Accessible, unstyled primitives paired with beautiful, reusable components.
- **Typography:** Centralized brand typography engine (`prose-brand`) in shared UI package using Playfair Display (Serif) for brand content and Inter (Sans) for functional UI.
- **Rich Text Editor:** [TipTap](https://tiptap.dev/) - Headless WYSIWYG editor for the admin portal.

## Backend & Data
- **Database:** [PostgreSQL 15](https://www.postgresql.org/) - Powerful, open-source object-relational database.
- **ORM:** [Drizzle ORM 0.45](https://orm.drizzle.team/) - TypeScript ORM with a focus on performance and developer experience.
- **Authentication:** [NextAuth.js 5 (beta)](https://authjs.dev/) - Flexible authentication for Next.js applications.
- **File Storage:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) - Efficient storage for images and media assets.
- **I18n:** `next-intl` v4 - Internationalization with URL-based routing (`[locale]` segment) and `proxy.ts` for request interception (Next.js 16).
