# @repo/database

This package handles the database connection and schema definitions using [Drizzle ORM](https://orm.drizzle.team/) with [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres).

## Setup

1.  **Create Vercel Postgres Database**:
    - Go to your Vercel dashboard
    - Navigate to Storage → Create Database → Postgres
    - Copy the connection string

2.  **Environment Variables**:
    Add to your `.env.local` in the app using this package:
    ```bash
    POSTGRES_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
    ```
    
    *Vercel will automatically inject this in production. For local development, get it from your Vercel dashboard.*

3.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

4.  **Generate Migrations**:
    ```bash
    cd packages/database
    pnpm run generate
    ```

5.  **Run Migrations**:
    ```bash
    pnpm run migrate
    ```

## Usage in Next.js

### Server Components (Recommended)
```typescript
import { db } from "@repo/database/client";
import { products } from "@repo/database/schema";

export default async function Page() {
  const allProducts = await db.select().from(products);
  return <pre>{JSON.stringify(allProducts, null, 2)}</pre>;
}
```

### API Routes
```typescript
import { db } from "@repo/database/client";
import { products } from "@repo/database/schema";

export async function GET() {
  const allProducts = await db.select().from(products);
  return Response.json(allProducts);
}
```

## Why Vercel Postgres?

- **Serverless-optimized**: Built-in connection pooling for edge and serverless functions
- **Zero-config on Vercel**: Environment variables auto-injected in production
- **Low latency**: Global edge network
- **Cost-effective**: Pay only for what you use
