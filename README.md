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

- **Web Application** (`apps/web`): Customer-facing storefront with internationalization (EN/VI)
- **Admin Portal** (`apps/admin`): Content management and product administration

The platform supports:

- **Bilingual Content**: Fully localized management (English/Vietnamese) for all products, blogs, and pages
- **Product Management**: Multi-variant products with dynamic pricing, inventory, and image focus/cropping controls
- **Catalog Hierarchy**: Two-level category structure (Level 1 → Level 2) with featured layout management
- **Lead Generation**: Customer contact inbox for inquiries and quote requests
- **Portfolio & Showcases**: Professional project portfolios, service catalogs, and showroom displays
- **Content CMS**: Blog/post management and custom page builder for static content
- **Admin Operations**: Product import from Excel, real-time notifications, and site-wide analytics
- **SEO Optimization**: Metadata controls for all core entities

---

## Project Structure

```
furniture-monorepo/
├── apps/
│   ├── admin/              # Admin portal (Next.js, port 4001)
│   └── web/                # Customer storefront (Next.js, port 4000)
├── packages/
│   ├── assets/             # Shared static assets
│   ├── database/           # Drizzle ORM schema, migrations, and client
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
| **i18n**       | next-intl (web only)      |

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
   pnpm dev:web    # Web on http://localhost:4000
   pnpm dev:admin  # Admin on http://localhost:4001
   ```

---

## Available Scripts

### Root Scripts

| Script             | Description                        |
| ------------------ | ---------------------------------- |
| `pnpm dev`         | Start all apps in development mode |
| `pnpm dev:web`     | Start web app only (port 4000)     |
| `pnpm dev:admin`   | Start admin app only (port 4001)   |
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

| Category        | Entities                                                                        |
| --------------- | ------------------------------------------------------------------------------- |
| **Catalog**     | Products, Variants, Options, Catalogs, Collections, Recommendations             |
| **Marketing**   | Hero, Intro, Sale Sections, Featured Layouts, Showrooms, Projects, Blogs        |
| **Operations**  | Inbox Messages, Notifications, Product Import Jobs, Analytics Visits            |
| **Settings**    | Site Settings, Site Footer, Site Contacts, Custom Pages                         |
| **Foundation**  | Users, Accounts, Sessions, Verification Tokens, Assets                          |

### Key Features

- **Multi-language**: Most text fields have `Vi` counterparts (e.g., `name` and `nameVi`)
- **Self-referencing**: Catalogs use `parentId` for a two-level hierarchy
- **Asset Links**: Images are linked via join tables (e.g., `product_assets`) with metadata for `focusPoint` and `aspectRatio`
- **Import/Export**: Tracking for Excel-based product imports

### Database Commands

```bash
# Push schema to database (development)
pnpm db:push

# Generate migration files
pnpm db:generate

# View database in Drizzle Studio
pnpm --filter @repo/database drizzle-kit studio
```

---

## Applications

### Web App (`apps/web`)

Customer-facing storefront featuring:

- **Catalog Explorer**: Browse products by catalog hierarchy or collections
- **Product Gallery**: Detailed pages with variant switching and pricing
- **Interactive PDF**: View catalogs using an interactive flipbook/PDF viewer
- **i18n Support**: Full support for English and Vietnamese switching
- **Showcases**: Projects, services, and showroom displays

**Key Directories:**

```
apps/web/
├── app/
│   ├── catalog/        # Multi-level catalog routing
│   ├── product/        # Product detail pages
│   ├── showroom-factory/ # Showroom display pages
│   ├── contact-us/     # Customer inquiry form
│   └── messages/       # i18n JSON files (en.json, vi.json)
└── components/         # Web-specific UI components
```

### Admin App (`apps/admin`)

Full CMS for managing all site content:

- **Dashboard**: Overview of analytics and recent activities
- **Product CMS**: Rich product management with batch import and asset optimization
- **Inbox**: Centralized view for managing customer inquiries
- **Homepage Builder**: Modular management of Hero, Intro, Sale, and Featured sections
- **Notifications**: Real-time system alerts for entity changes
- **Rich Editor**: TipTap-based editor for blog and page content

**Key Directories:**

```
apps/admin/
├── app/
│   ├── products/       # Advanced product management
│   ├── catalogs/       # Hierarchy and layout management
│   ├── homepage/       # Modular section builders
│   ├── inbox/          # Message management
│   └── (dashboard)/    # Analytics and overview
├── lib/
│   ├── actions/        # Extensive server actions library
│   └── validations/    # Shared Zod schemas for all forms
└── components/         # Admin UI components (dnd-kit integration)
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
