# ThienAn Furniture Monorepo

A modern, full-stack furniture e-commerce platform built with Next.js 16, Turborepo, and PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)
![pnpm](https://img.shields.io/badge/pnpm-9.0-orange)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Applications](#applications)
- [Packages](#packages)
- [Contributing](#contributing)

---

## Overview

This monorepo contains the ThienAn Furniture e-commerce platform, consisting of:

- **Web Application** (`apps/web`): Customer-facing storefront
- **Admin Portal** (`apps/admin`): Content management and product administration

The platform supports:

- Product and catalog management with two-level hierarchies
- Collections and curated product groupings
- Blog/post management
- Service showcases
- Project portfolios
- User authentication and management
- SEO-optimized content

---

## Project Structure

```
furniture-monorepo/
├── apps/
│   ├── admin/              # Admin portal (Next.js, port 3001)
│   └── web/                # Customer storefront (Next.js, port 3000)
├── packages/
│   ├── assets/             # Shared static assets
│   ├── database/           # Drizzle ORM schema and client
│   ├── eslint-config/      # Shared ESLint configuration
│   ├── tailwind-config/    # Shared Tailwind CSS configuration
│   ├── typescript-config/  # Shared TypeScript configuration
│   └── ui/                 # Shared UI component library (Radix + shadcn/ui)
├── docker-compose.yml      # PostgreSQL development database
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── package.json            # Root package.json with scripts
```

---

## Tech Stack

### Core Technologies

| Category            | Technology              |
| ------------------- | ----------------------- |
| **Framework**       | Next.js 16 (App Router) |
| **Language**        | TypeScript 5.9          |
| **Package Manager** | pnpm 9.0                |
| **Monorepo Tool**   | Turborepo 2.6           |

### Database

| Category     | Technology       |
| ------------ | ---------------- |
| **Database** | PostgreSQL 15    |
| **ORM**      | Drizzle ORM 0.45 |
| **Hosting**  | Vercel Postgres  |

### Frontend

| Category       | Technology                |
| -------------- | ------------------------- |
| **Styling**    | Tailwind CSS 3.4          |
| **Components** | Radix UI + shadcn/ui      |
| **Forms**      | React Hook Form 7 + Zod 4 |
| **Icons**      | Lucide React              |
| **Rich Text**  | TipTap (admin only)       |

### Authentication & Storage

| Category         | Technology           |
| ---------------- | -------------------- |
| **Auth**         | NextAuth.js 5 (beta) |
| **File Storage** | Vercel Blob          |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** 9.0 (install via `npm install -g pnpm`)
- **Docker** (for local PostgreSQL)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd furniture-monorepo
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the database**

   ```bash
   docker-compose up -d
   ```

4. **Configure environment variables**

   Create `.env.development.local` files in both apps:

   ```bash
   # apps/web/.env.development.local
   POSTGRES_URL="postgres://postgres:postgres@localhost:5432/thienan_furniture"

   # apps/admin/.env.development.local (includes auth config)
   POSTGRES_URL="postgres://postgres:postgres@localhost:5432/thienan_furniture"
   AUTH_SECRET="your-auth-secret-here"
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
   ```

5. **Push the database schema**

   ```bash
   pnpm db:push
   ```

6. **Start development servers**

   ```bash
   # Start both apps
   pnpm dev

   # Or start individually
   pnpm dev:web    # Web on http://localhost:3000
   pnpm dev:admin  # Admin on http://localhost:3001
   ```

---

## Available Scripts

### Root Scripts

| Script             | Description                        |
| ------------------ | ---------------------------------- |
| `pnpm dev`         | Start all apps in development mode |
| `pnpm dev:web`     | Start web app only (port 3000)     |
| `pnpm dev:admin`   | Start admin app only (port 3001)   |
| `pnpm build`       | Build all apps for production      |
| `pnpm start`       | Start all built apps               |
| `pnpm lint`        | Run ESLint across all packages     |
| `pnpm check-types` | Run TypeScript type checking       |
| `pnpm format`      | Format code with Prettier          |
| `pnpm db:push`     | Push schema changes to database    |
| `pnpm db:generate` | Generate Drizzle migrations        |

---

## Database

### Schema Overview

The database schema is defined in `packages/database/src/schema.ts` and includes:

| Entity            | Description                                      |
| ----------------- | ------------------------------------------------ |
| **Products**      | Main product catalog with variants and options   |
| **Catalogs**      | Two-level category hierarchy (Level 1 → Level 2) |
| **Collections**   | Curated product groupings linked to catalogs     |
| **Assets**        | Uploaded media files (images, videos)            |
| **Services**      | Company service offerings                        |
| **Projects**      | Portfolio/showcase projects                      |
| **Posts/Blogs**   | Blog articles and content                        |
| **Users**         | Admin user accounts                              |
| **Site Settings** | Hero, intro, and footer configurations           |

### Key Relationships

- Products belong to a catalog (Level 2)
- Collections can belong to multiple catalogs
- Products can belong to multiple collections
- Assets are linked via join tables (product_assets, variant_assets, etc.)

### Database Commands

```bash
# Push schema to database (development)
pnpm db:push

# Generate migration files
pnpm db:generate

# Run in database package directly
pnpm --filter @repo/database drizzle-kit push
```

---

## Environment Variables

### Required Variables

| Variable                | App   | Description                  |
| ----------------------- | ----- | ---------------------------- |
| `POSTGRES_URL`          | Both  | PostgreSQL connection string |
| `AUTH_SECRET`           | Admin | NextAuth.js secret key       |
| `BLOB_READ_WRITE_TOKEN` | Admin | Vercel Blob storage token    |

### Local Development

For local development with Docker PostgreSQL:

```
POSTGRES_URL="postgres://postgres:postgres@localhost:5432/thienan_furniture"
```

---

## Applications

### Web App (`apps/web`)

Customer-facing storefront featuring:

- Product browsing by catalog/collection
- Product detail pages with variants
- Blog/article pages
- Service and project showcases
- SEO-optimized pages

**Key Directories:**

```
apps/web/
├── app/
│   ├── blogs/          # Blog listing and detail pages
│   ├── catalog/        # Catalog and subcatalog pages
│   ├── collections/    # Collection pages
│   ├── product/        # Product detail pages
│   └── components/     # Shared web components
└── lib/                # Utilities
```

### Admin App (`apps/admin`)

Content management portal with:

- Dashboard overview
- Product CRUD with image uploads
- Catalog and collection management
- Blog/post editor (TipTap rich text)
- Service and project management
- User management
- Site settings (hero, intro, footer)

**Key Directories:**

```
apps/admin/
├── app/
│   ├── products/       # Product management
│   ├── catalogs/       # Catalog management
│   ├── collections/    # Collection management
│   ├── blogs/          # Blog post management
│   ├── services/       # Service management
│   ├── projects/       # Project management
│   ├── users/          # User management
│   └── homepage/       # Site settings (hero, intro, footer)
├── components/         # Admin UI components
└── lib/
    ├── actions/        # Server actions
    └── validations/    # Zod schemas
```

---

## Packages

### @repo/database

- Drizzle ORM schema and database client
- Exports: `@repo/database` (client), `@repo/database/schema`

### @repo/ui

- Shared component library (Radix UI + shadcn/ui)
- Form components, buttons, dialogs, tables, etc.
- Exports: `@repo/ui/ui/*`, `@repo/ui/lib/utils`

### @repo/assets

- Shared static assets (images, etc.)

### @repo/tailwind-config

- Shared Tailwind CSS configuration

### @repo/typescript-config

- Shared TypeScript configurations

### @repo/eslint-config

- Shared ESLint configurations

---

## Contributing

### Code Style

- TypeScript strict mode enabled
- ESLint with zero warnings policy
- Prettier for code formatting

### Workflow

1. Create a feature branch
2. Make changes and test locally
3. Run `pnpm lint` and `pnpm check-types`
4. Submit a pull request

### Adding UI Components

```bash
# Using shadcn/ui CLI
pnpm --filter @repo/ui add:component <component-name>
```

---

## License

Private repository - All rights reserved.
