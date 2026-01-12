# AI Agent Context Guide

> **Purpose**: This document provides AI coding agents (Antigravity, Copilot, Cursor, etc.) with essential context for working effectively in this codebase.

---

## 🎯 Quick Context

| Aspect              | Details                                             |
| ------------------- | --------------------------------------------------- |
| **Project**         | ThienAn Furniture - E-commerce platform             |
| **Type**            | Turborepo monorepo                                  |
| **Stack**           | Next.js 16, TypeScript 5.9, PostgreSQL, Drizzle ORM |
| **Package Manager** | pnpm 9.0                                            |
| **Apps**            | `web` (port 3000), `admin` (port 3001)              |

---

## 📁 Project Structure

```
furniture-monorepo/
├── apps/
│   ├── admin/                 # Admin CMS (port 3001)
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # Admin-specific components
│   │   └── lib/
│   │       ├── actions/       # Server actions for CRUD
│   │       └── validations/   # Zod validation schemas
│   └── web/                   # Customer storefront (port 3000)
│       ├── app/               # Next.js App Router pages
│       └── lib/               # Web utilities
├── packages/
│   ├── database/              # @repo/database - Drizzle ORM
│   │   └── src/
│   │       ├── client.ts      # Database client export
│   │       └── schema.ts      # All table definitions
│   ├── ui/                    # @repo/ui - Shared components
│   │   └── src/components/ui/ # shadcn/ui components
│   ├── assets/                # @repo/assets - Static files
│   ├── tailwind-config/       # @repo/tailwind-config
│   ├── typescript-config/     # @repo/typescript-config
│   └── eslint-config/         # @repo/eslint-config
└── docker-compose.yml         # Local PostgreSQL
```

---

## 🗄️ Database Schema

### Core Entities

| Table         | Purpose              | Key Fields                                                  |
| ------------- | -------------------- | ----------------------------------------------------------- |
| `products`    | Product catalog      | `name`, `slug`, `catalogId`, `basePrice`, `descriptionHtml` |
| `catalogs`    | Two-level categories | `name`, `slug`, `parentId`, `level` (1 or 2), `imageId`     |
| `collections` | Curated groups       | `name`, `slug`, `imageId`                                   |
| `assets`      | Media files          | `filename`, `contentType`, `url`, `width`, `height`         |
| `services`    | Company services     | `title`, `slug`, `descriptionHtml`, `isActive`              |
| `projects`    | Portfolio items      | `title`, `slug`, `descriptionHtml`                          |
| `posts`       | Blog articles        | `title`, `slug`, `content`                                  |
| `users`       | Admin accounts       | `email`, `password`, `role`                                 |

### Catalog Hierarchy

```
Level 1 Catalog (parent)
└── Level 2 Catalog (child, parentId → Level 1)
    └── Products (catalogId → Level 2)
```

### Join Tables

| Table                 | Links                                |
| --------------------- | ------------------------------------ |
| `collection_products` | collections ↔ products              |
| `catalog_collections` | catalogs ↔ collections              |
| `product_assets`      | products ↔ assets (with `position`) |
| `variant_assets`      | variants ↔ assets                   |
| `service_assets`      | services ↔ assets                   |
| `project_assets`      | projects ↔ assets                   |
| `post_assets`         | posts ↔ assets                      |

### Site Configuration Tables

| Table              | Purpose                           |
| ------------------ | --------------------------------- |
| `site_settings`    | Global settings                   |
| `site_heros`       | Homepage hero section             |
| `site_intros`      | Homepage intro section            |
| `site_footers`     | Footer content                    |
| `footer_addresses` | Footer address list               |
| `footer_contacts`  | Footer contact info (phone/email) |

---

## 📦 Import Patterns

### Database

```typescript
// Database client and ORM functions
import { db, eq, and, desc, asc } from '@repo/database';

// Schema tables and types
import { products, catalogs, SelectProduct } from '@repo/database/schema';
```

### UI Components

```typescript
// Individual UI components
import { Button } from '@repo/ui/ui/button';
import { Card, CardContent, CardHeader } from '@repo/ui/ui/card';
import { Input } from '@repo/ui/ui/input';
import { Form, FormField, FormItem, FormLabel } from '@repo/ui/ui/form';

// Utilities
import { cn } from '@repo/ui/lib/utils';
```

### Assets

```typescript
import logo from '@repo/assets/logo.png';
```

---

## 🔧 Common Patterns

### Server Actions (Admin)

Location: `apps/admin/lib/actions/`

```typescript
'use server';

import { db, eq } from '@repo/database';
import { products, InsertProduct } from '@repo/database/schema';
import { revalidatePath } from 'next/cache';

export async function createProduct(data: InsertProduct) {
  const [product] = await db.insert(products).values(data).returning();
  revalidatePath('/products');
  return product;
}
```

### Validation Schemas (Admin)

Location: `apps/admin/lib/validations/`

```typescript
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  basePrice: z.coerce.number().min(0),
  isActive: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
```

### Form Components (Admin)

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormValues } from '@/lib/validations/product';

export function ProductForm({ initialData }: { initialData?: ProductFormValues }) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ?? { name: '', slug: '' },
  });
  // ...
}
```

### Data Fetching

```typescript
// Server component data fetching
import { db, eq, desc } from '@repo/database';
import { products, catalogs, assets } from '@repo/database/schema';

// Simple query
const allProducts = await db.query.products.findMany({
  where: eq(products.isActive, true),
  orderBy: desc(products.createdAt),
});

// With relations
const productWithImages = await db.query.products.findFirst({
  where: eq(products.slug, slug),
  with: {
    catalog: true,
    assets: {
      with: { asset: true },
      orderBy: (a, { asc }) => asc(a.position),
    },
  },
});
```

---

## 📄 File Naming Conventions

| Pattern           | Example                   | Usage                  |
| ----------------- | ------------------------- | ---------------------- |
| `page.tsx`        | `products/page.tsx`       | Next.js page component |
| `layout.tsx`      | `products/layout.tsx`     | Next.js layout         |
| `[slug]/page.tsx` | `catalog/[slug]/page.tsx` | Dynamic route          |
| `*-form.tsx`      | `product-form.tsx`        | Form component         |
| `*.ts`            | `products.ts`             | Server actions         |

---

## 🚀 Commands Reference

### Development

```bash
# Start all apps
pnpm dev

# Start individual apps
pnpm dev:web      # Web on :3000
pnpm dev:admin    # Admin on :3001

# Type checking
pnpm check-types

# Linting
pnpm lint
```

### Database

```bash
# Push schema changes (no migration files)
pnpm db:push

# Generate migration files
pnpm db:generate

# Direct drizzle-kit access
pnpm --filter @repo/database drizzle-kit studio
```

### Building

```bash
# Build all
pnpm build

# Production start
pnpm start
pnpm start:web
pnpm start:admin
```

---

## ⚠️ Important Considerations

### When Modifying Schema

1. Edit `packages/database/src/schema.ts`
2. Add relations if needed
3. Export new types (InsertX, SelectX)
4. Run `pnpm db:push` to apply changes
5. Update server actions and validations as needed

### When Adding New Features

1. **Database**: Add tables/relations in `schema.ts`
2. **Validation**: Create Zod schema in `lib/validations/`
3. **Actions**: Create server actions in `lib/actions/`
4. **UI**: Create form/list components in appropriate `app/` folder
5. **Routes**: Follow Next.js App Router conventions

### Asset Handling

- Use Vercel Blob for file uploads
- Assets stored in `assets` table with metadata
- Link assets via join tables (`product_assets`, etc.)
- `position` field for ordering, `isPrimary` for featured images

### Authentication

- NextAuth.js v5 (beta) with Drizzle adapter
- Protected routes via middleware
- User roles stored in `users` table

---

## 🎨 UI Component Library

Available components in `@repo/ui/ui/*`:

| Category       | Components                                                  |
| -------------- | ----------------------------------------------------------- |
| **Layout**     | Card, Separator, Sidebar, Sheet                             |
| **Forms**      | Input, Textarea, Select, Checkbox, Switch, RadioGroup, Form |
| **Actions**    | Button, DropdownMenu, AlertDialog                           |
| **Display**    | Table, Badge, Avatar, Skeleton, Progress                    |
| **Feedback**   | Sonner (toast notifications), Tooltip                       |
| **Navigation** | Breadcrumb, Collapsible                                     |

---

## 🔄 State Management

- **No global state library** - Server Components + Server Actions pattern
- **Form state**: React Hook Form
- **URL state**: Next.js `searchParams` for filters/pagination
- **Server state**: Direct database queries in Server Components
- **Mutations**: Server Actions with `revalidatePath()`

---

## 📝 Helpful Queries

### Get products with all relations

```typescript
const products = await db.query.products.findMany({
  with: {
    catalog: { with: { parent: true } },
    assets: { with: { asset: true } },
    variants: { with: { optionValues: true, assets: true } },
    collections: { with: { collection: true } },
  },
});
```

### Get active services

```typescript
const services = await db.query.services.findMany({
  where: eq(services.isActive, true),
  with: { gallery: { with: { asset: true } } },
});
```

### Get catalog hierarchy

```typescript
// Level 1 catalogs with children
const catalogs = await db.query.catalogs.findMany({
  where: eq(catalogs.level, 1),
  with: {
    children: true,
    image: true,
  },
});
```

---

## 🛠️ Debugging Tips

1. **Database queries**: Use `drizzle-kit studio` for visual DB exploration
2. **Server Actions**: Check server logs for errors
3. **Type errors**: Run `pnpm check-types` to catch issues
4. **Build issues**: Run `pnpm build` to verify production build

---

## 📚 Additional Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
