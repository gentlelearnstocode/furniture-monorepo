# Thien An Furniture Monorepo

Replacement repository for [thienanfurniture.com](https://thienanfurniture.com/). This project uses a modern monorepo structure to manage the customer-facing website and the administrative dashboard.

## 🏗 Project Structure

This monorepo is managed using **Turbo** and **pnpm**.

### 📱 Applications
- **[apps/admin](file:///Users/quocdao/freelance/furniture-monorepo/apps/admin)**: The administrative dashboard for managing catalogs, products, and inventory. Built with **Next.js 15**, **Tailwind CSS**, and **Shadcn UI**.
- **[apps/web](file:///Users/quocdao/freelance/furniture-monorepo/apps/web)**: The customer-facing storefront (Work in Progress).

### 📦 Packages
- **[packages/database](file:///Users/quocdao/freelance/furniture-monorepo/packages/database)**: Shared database layer using **Drizzle ORM** and **PostgreSQL**.
- **[packages/assets](file:///Users/quocdao/freelance/furniture-monorepo/packages/assets)**: Shared asset management utility integrating with **Vercel Blob**.
- **[packages/ui](file:///Users/quocdao/freelance/furniture-monorepo/packages/ui)**: Reusable UI component library based on **Shadcn UI**.
- **packages/typescript-config**: Shared TypeScript configurations.
- **packages/tailwind-config**: Shared Tailwind CSS configurations.
- **packages/eslint-config**: Shared ESLint configurations.

## 🚀 Recent Features (Admin)

### 📦 Product Management
- **Full CRUD**: Create, read, update, and delete products with real-time database synchronization.
- **Advanced Metadata**: Support for product dimensions, short/long descriptions, and hierarchical catalog assignment.
- **Dynamic List**: Interactive product table with primary image thumbnails and status badges.

### 🖼 Asset Management
- **Direct Image Upload**: Integration with **Vercel Blob** for high-performance image storage.
- **Folder Organization**: Automatic organizational strategy using path-prefixes (e.g., `products/{slug}/`).
- **Primary Selection**: Ability to mark a specific image as "Primary" for the product listing.

## 🛠 Tech Stack
- **Framework**: [Next.js](https://nextjs.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Storage**: [Vercel Blob](https://vercel.com/storage/blob)
- **Monorepo Tooling**: [Turbo](https://turbo.build/)

## 🏁 Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```
2. **Setup environment variables**:
   Create a `.env` file in the root and appropriate `apps/` with:
   - `BLOB_READ_WRITE_TOKEN`: For image uploads.
   - `POSTGRES_URL`: For database connection.
3. **Run local database**:
   ```bash
   docker-compose up -d
   ```
4. **Development mode**:
   ```bash
   pnpm dev
   ```
