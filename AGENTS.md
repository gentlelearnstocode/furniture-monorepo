# AGENTS.md

Guide for AI coding agents working in this repository.

## Project Overview

ThienAn Furniture is a bilingual (EN/VI) furniture e-commerce platform built as a monorepo using Turborepo. It consists of:

- **apps/admin**: Admin portal for managing products, content, and settings (Next.js 16, port 4001)
- **apps/web**: Customer-facing storefront with i18n support (Next.js 16, port 4000)
- **packages/database**: Drizzle ORM schema and database client (PostgreSQL/Neon)
- **packages/ui**: Shared UI components (Radix UI + shadcn/ui)
- **packages/shared**: Shared types and Zod validation schemas
- **packages/eslint-config**: Shared ESLint configurations
- **packages/typescript-config**: Shared TypeScript configurations

## Build/Lint/Test Commands

### Root Commands

```bash
pnpm dev              # Start all apps in development mode
pnpm dev:web          # Start web app only (port 4000)
pnpm dev:admin        # Start admin app only (port 4001)
pnpm build            # Build all apps for production
pnpm start            # Start all built apps
pnpm lint             # Run ESLint across all packages (zero warnings policy)
pnpm check-types      # Run TypeScript type checking
pnpm format           # Format code with Prettier
```

### App-Specific Commands

```bash
pnpm --filter web lint          # Lint web app only
pnpm --filter admin lint        # Lint admin app only
pnpm --filter web check-types   # Type check web app
pnpm --filter admin check-types # Type check admin app
```

### Database Commands (run in packages/database)

```bash
cd packages/database
pnpm push              # Push schema to database (development)
pnpm generate          # Generate Drizzle migrations
pnpm migrate           # Run migrations
```

### UI Component Commands

```bash
pnpm --filter @repo/ui add:component <name>  # Add shadcn/ui component
```

### Testing

No test framework is currently configured. When adding tests, update this section.

## Code Style Guidelines

### Package Manager

Always use `pnpm`. Never use npm or yarn.

```bash
pnpm install
pnpm add <package>
pnpm --filter <app> <command>
```

### Imports

Organize imports in this order:

1. React/Next.js imports
2. Third-party libraries
3. Internal packages (`@repo/*`)
4. Local imports (`@/*`)
5. Relative imports

```typescript
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, products } from "@repo/database";
import { createProductSchema } from "@/lib/validations/products";
import { formatPrice } from "./utils";
```

### File Naming

- **Components**: PascalCase for the component, kebab-case for the file
  - `button.tsx` exports `Button`
  - `product-card.tsx` exports `ProductCard`
- **Utilities**: camelCase (`format-price.ts`)
- **Server Actions**: camelCase (`products.ts`)
- **Types**: camelCase (`product.ts`)
- **Pages**: Next.js convention (`page.tsx`, `layout.tsx`)

### TypeScript

- Strict mode is enabled
- Use explicit return types for exported functions
- Prefer interfaces for object types, types for unions/primitives
- Use `z.infer<typeof schema>` for types derived from Zod schemas

```typescript
// Good
export interface Product {
  id: string;
  name: string;
}

export type Status = "active" | "inactive";

export type CreateProductInput = z.infer<typeof createProductSchema>;

// Avoid
type Product = { id: string; name: string };
```

### React Components

- Use arrow functions for components
- Use `React.forwardRef` for components that need refs
- Destructure props in the function signature

```typescript
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive' | 'outline';
};

const Button = ({ variant = 'default', className, ...props }: ButtonProps) => {
  return <button className={cn(baseStyles, variants[variant], className)} {...props} />;
};

export { Button };
```

### Server Actions

- Always start with `'use server'`
- Use Zod for validation
- Return `{ error: string }` or `{ success: true, data: T }`
- Handle errors with try/catch

```typescript
"use server";

import { createProductSchema } from "@/lib/validations/products";
import { db, products } from "@repo/database";

export async function createProduct(data: unknown) {
  const validated = createProductSchema.safeParse(data);

  if (!validated.success) {
    return { error: "Invalid fields" };
  }

  try {
    const [product] = await db
      .insert(products)
      .values(validated.data)
      .returning();
    revalidatePath("/products");
    return { success: true as const, data: product };
  } catch (error) {
    return { error: "Failed to create product" };
  }
}
```

### Database

- Import from `@repo/database`
- Use Drizzle query builder for complex queries

```typescript
import { db, products, eq } from "@repo/database";

// Simple query
const product = await db.query.products.findFirst({
  where: eq(products.slug, slug),
});

// With relations
const product = await db.query.products.findFirst({
  where: eq(products.id, id),
  with: {
    catalog: true,
    gallery: { with: { asset: true } },
  },
});
```

### Forms

- Use React Hook Form + Zod + @hookform/resolvers

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductInput } from "@repo/shared";

const form = useForm<CreateProductInput>({
  resolver: zodResolver(createProductSchema),
  defaultValues: { name: "", isActive: true },
});
```

### Styling

- Use Tailwind CSS
- Use `cn()` utility for conditional classes (from `@repo/ui/lib/utils`)
- Follow shadcn/ui patterns for component variants

```typescript
import { cn } from '@repo/ui/lib/utils';

<div className={cn('base-class', isActive && 'active-class', className)} />
```

### Internationalization (Web App Only)

- Use `next-intl` for translations
- Store translations in `apps/web/app/[locale]/messages/`
- Use `setRequestLocale` in page components

```typescript
import { setRequestLocale, getTranslations } from 'next-intl/server';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  return <h1>{t('title')}</h1>;
}
```

### Error Handling

- Server actions: return `{ error: string }`
- Client: use `sonner` for toast notifications

```typescript
import { toast } from "sonner";

const result = await createProduct(data);
if (result.error) {
  toast.error(result.error);
} else {
  toast.success("Product created");
}
```

## Important Rules

1. **Check package.json first** for available scripts
2. **Never start the dev server** - assume it's already running at ports 4000 (web) and 4001 (admin)
3. **Run database commands** from `packages/database` directory
4. **ESLint has zero warnings policy** - always pass `--max-warnings 0`
5. **Always run lint and typecheck** after making changes:
   ```bash
   pnpm lint && pnpm check-types
   ```

## Common Patterns

### Adding a New Entity

1. Add schema to `packages/database/src/schema.ts`
2. Add types to `packages/shared/src/types/`
3. Add Zod schema to `packages/shared/src/validation/`
4. Create server actions in `apps/admin/lib/actions/`
5. Create admin pages in `apps/admin/app/`

### Adding a UI Component

```bash
pnpm --filter @repo/ui add:component <component-name>
```

Then import from `@repo/ui/ui/<component-name>`.
