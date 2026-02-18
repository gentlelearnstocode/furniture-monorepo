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
| **Apps**            | `web` (port 4000), `admin` (port 4001)              |

---

## 📁 Project Structure

```
furniture-monorepo/
├── apps/
│   ├── admin/                 # Admin CMS (port 4001)
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # Admin-specific components
│   │   └── lib/
│   │       ├── actions/       # Server actions for CRUD
│   │       └── validations/   # Zod validation schemas
│   └── web/                   # Customer storefront (port 4000)
│       ├── app/               # Next.js App Router pages
│       ├── i18n/              # next-intl configuration
│       ├── messages/          # Translation JSONs (en.json, vi.json)
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

### Localization Pattern

Most text fields support bilingual content using the suffix `Vi` for Vietnamese:
- `name` (English, primary) / `nameVi` (Vietnamese)
- `description` / `descriptionVi`
- `contentHtml` / `contentHtmlVi`

### Core Entities

| Table         | Purpose                 | Key Fields                                                  |
| ------------- | ----------------------- | ----------------------------------------------------------- |
| `products`    | Product catalog         | `name`, `slug`, `catalogId`, `basePrice`, `description`     |
| `catalogs`    | Two-level hierarchy     | `name`, `slug`, `parentId`, `level` (1 or 2)                |
| `collections` | Curated groupings       | `name`, `slug`, `bannerId`                                  |
| `assets`      | Media library           | `url`, `filename`, `mimeType`, `size`                       |
| `showrooms`   | Physical displays       | `title`, `subtitle`, `contentHtml`, `imageId`               |
| `projects`    | Portfolio showcase      | `title`, `slug`, `contentHtml`                              |
| `services`    | Company services        | `title`, `slug`, `descriptionHtml`                          |
| `posts`       | Blog articles           | `title`, `slug`, `contentHtml`, `excerpt`                   |
| `inbox`       | Customer inquiries      | `name`, `phoneNumber`, `email`, `content`                   |
| `custom_pages`| Static content pages    | `slug`, `title`, `content` (jsonb)                          |
| `notifications`| System alerts          | `type`, `title`, `message`, `isRead`                        |

### Asset Gallery Pattern

Images are linked via join tables that include display metadata:
- `product_assets`, `service_assets`, `project_assets`, `post_assets`
- **Fields**: `assetId`, `position`, `isPrimary`
- **Focus Point**: `focusPoint: { x: number, y: number }` (0-100 percentage)
- **Customization**: `aspectRatio` (original, 1:1, 3:4, etc.), `objectFit` (cover, contain)

### Site Configuration

- `site_heros`: Homepage banner sliders
- `site_intros`: "About Us" section on homepage
- `site_footer`: Global footer settings, addresses, and contacts
- `featured_catalog_rows`: Customizable homepage grid for catalogs
- `site_contacts`: Floating contact buttons (Zalo, Phone, etc.)

---

## 📦 Import Patterns

### Database

```typescript
// Database client and ORM functions
import { db, eq, and, desc, asc, relations } from '@repo/database';

// Schema tables and types
import { products, catalogs, SelectProduct, InsertProduct } from '@repo/database/schema';
```

### UI Components

```typescript
// Individual UI components
import { Button } from '@repo/ui/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@repo/ui/ui/form';

// Utilities
import { cn } from '@repo/ui/lib/utils';
```

---

## 🔧 Common Patterns

### Server Actions (Admin)

Location: `apps/admin/lib/actions/`
Always use `'use server'` and `revalidatePath()`.

```typescript
'use server';

import { db, eq } from '@repo/database';
import { products } from '@repo/database/schema';
import { revalidatePath } from 'next/cache';

export async function updateProduct(id: string, data: Partial<InsertProduct>) {
  await db.update(products).set(data).where(eq(products.id, id));
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
}
```

### Validation Schemas (Admin)

Location: `apps/admin/lib/validations/`
Includes support for both languages.

```typescript
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameVi: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  basePrice: z.coerce.number().min(0),
});
```

### i18n (Web)

Uses `next-intl`. Translations are in `apps/web/messages/[locale].json`.
Access via `useTranslations` (Client) or `getTranslations` (Server).

---

## 🚀 Commands Reference

```bash
# Development (Individual Ports)
pnpm dev:web      # http://localhost:4000
pnpm dev:admin    # http://localhost:4001

# Database Management
pnpm db:push      # Push schema to DB (sync)
pnpm db:generate  # Generate migration SQL
pnpm --filter @repo/database drizzle-kit studio # UI for DB

# Quality Control
pnpm lint         # Run ESLint
pnpm check-types  # Run TSC
pnpm format       # Run Prettier
```

---

## 📄 File Naming Conventions

| Pattern           | Example                   | Usage                  |
| ----------------- | ------------------------- | ---------------------- |
| `page.tsx`        | `products/page.tsx`       | Next.js page component |
| `[slug]/page.tsx` | `catalog/[slug]/page.tsx` | Dynamic route          |
| `*-form.tsx`      | `product-form.tsx`        | Form component         |
| `actions.ts`      | `lib/actions/products.ts` | Server actions         |

---

## ⚠️ Important Considerations

1. **Schema Changes**: Always edit `packages/database/src/schema.ts` first.
2. **Media**: Use `Vercel Blob` for storage. Assets should be added to the `assets` table first, then linked to entities.
3. **Translations**: When adding a new field that requires translation, add both `fieldName` and `fieldNameVi` to the schema and Zod validation.
4. **Ordering**: Use the `position` or `displayOrder` fields for manual sorting in the UI.
5. **Caching**: Use `revalidatePath` or `revalidateTag` in server actions to ensure the web storefront reflects admin changes.

---

## 🎨 UI Component Library

Shared components in `@repo/ui/ui/*` (based on shadcn/ui):
- **Forms**: Input, Textarea, Select, Checkbox, Switch, DatePicker
- **Feedback**: Sonner (Toasts), Skeleton, Progress
- **Layout**: Card, Dialog, Sheet, Tabs, Accordion
- **Admin Specific**: Rich Text Editor (TipTap), Drag & Drop (dnd-kit)

---

## 📝 Helpful Queries

### Fetch Product with Full Relations

```typescript
const item = await db.query.products.findFirst({
  where: eq(products.slug, slug),
  with: {
    catalog: { with: { parent: true } },
    gallery: { with: { asset: true }, orderBy: (a, { asc }) => asc(a.position) },
    variants: { with: { optionValues: { with: { optionValue: { with: { option: true } } } } } },
    recommendations: { with: { recommendedProduct: true } },
  },
});
```

### Fetch Multi-level Catalog Tree

```typescript
const tree = await db.query.catalogs.findMany({
  where: eq(catalogs.level, 1),
  with: {
    children: { with: { image: true } },
    image: true,
  },
});
```

---

## 🛠️ Debugging Tips

1. **DB Studio**: Use `pnpm --filter @repo/database drizzle-kit studio` to inspect data.
2. **Server Logs**: Admin actions output errors to the terminal; check for database constraint violations.
3. **i18n Keys**: If a translation is missing on the web app, check the JSON files in `apps/web/messages/`.
4. **Vercel Blob**: If uploads fail, verify `BLOB_READ_WRITE_TOKEN` in the `.env` file.
