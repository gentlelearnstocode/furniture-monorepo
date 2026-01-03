# @repo/database

This package handles the database connection and schema definitions using [Drizzle ORM](https://orm.drizzle.team/) with [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (powered by Neon).

## Schema Overview

The database is designed for a modern furniture e-commerce platform, supporting complex product configurations.

### Core Entities
- **Products**: Base product definitions.
- **Catalogs**: Hierarchical categories (e.g., Living Room -> Sofas).
- **Collections**: Curated groups of products (e.g., Summer 2025).

### Variants & Options
- **Options**: Defines variation types (Color, Material, Size).
- **Option Values**: Specific choices (Red, Leather, King).
- **Variants**: Sellable SKUs (Product + specific Option Values).

### Media (Assets)
- **Assets**: Central repository for all media files (images, videos).
- **Galleries**: Products and Variants link to Assets for their specific imagery.

```mermaid
erDiagram
    PRODUCT ||--o{ VARIANT : "has"
    PRODUCT }|--|{ CATALOG : "belongs to"
    PRODUCT }|--|{ COLLECTION : "part of"
    PRODUCT ||--o{ PRODUCT_OPTION : "configures"
    
    VARIANT }|--|{ OPTION_VALUE : "assigned"
    
    PRODUCT ||--o{ PRODUCT_ASSET : "gallery"
    VARIANT ||--o{ VARIANT_ASSET : "specific photo"
    ASSET ||--|{ PRODUCT_ASSET : "referenced by"
```

## Setup

1.  **Create Vercel Postgres Database**:
    - Go to your Vercel dashboard
    - Navigate to Storage → Create Database → Postgres
    - Copy the connection string

2.  **Environment Variables**:
    Add to your `.env` (or `.env.local` in apps):
    ```bash
    POSTGRES_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
    ```
    
    *Vercel will automatically inject this in production. For local development, get it from your Vercel dashboard.*

3.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

4.  **Generate & Migrate**:
    ```bash
    cd packages/database
    
    # Generate SQL from schema.ts
    pnpm run generate
    
    # Push changes to the database
    pnpm run migrate
    ```

## Usage

### Server Components (Serverless)

```typescript
import { db } from "@repo/database/client";
import { products, catalogs } from "@repo/database/schema";
import { eq } from "drizzle-orm";

export default async function Page({ params }) {
  // Fetch product with catalog
  const product = await db.query.products.findFirst({
    where: eq(products.slug, params.slug),
    with: {
      catalog: true,
      gallery: {
        with: {
          asset: true
        }
      }
    }
  });
  
  return <pre>{JSON.stringify(product, null, 2)}</pre>;
}
```

## Why Vercel Postgres?

- **Serverless-optimized**: Built-in connection pooling for edge and serverless functions via `@vercel/postgres`.
- **Zero-config**: Auto-configuration on Vercel deployments.
- **Neon Power**: Under the hood, it uses Neon's serverless Postgres architecture, allowing for branching and scaling.
