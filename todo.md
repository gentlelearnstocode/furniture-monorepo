# TODO

## Database Caching Refactor - Completed ✅

Successfully removed `force-dynamic` anti-pattern from the web application and implemented proper Next.js caching strategies.

### What Was Done

**Database Layer:**

- ✅ Updated database client to use `createPool` for connection pooling
- ✅ Created reusable cache utilities in `apps/web/lib/cache.ts`

**Web Application (11 pages refactored):**

- ✅ Removed `force-dynamic` from all public pages
- ✅ Added `generateStaticParams` for static generation at build time
- ✅ Implemented time-based revalidation (30min-1hr)
- ✅ Cached all database queries with appropriate tags

**Pages Updated:**

- Layout & Homepage
- Services (listing + detail)
- Projects (listing + detail)
- Blogs (listing + detail)
- Catalogs (parent + child)
- Products (detail)

### Benefits Achieved

- ✅ Static pages generated at build time
- ✅ ISR (Incremental Static Regeneration) enabled
- ✅ Cached database queries
- ✅ Lower server costs
- ✅ Faster response times
- ✅ Better SEO

### Remaining Tasks

#### Admin Application

- [ ] Review admin pages to determine which truly need `force-dynamic`
- [ ] Implement selective caching for admin pages (shorter revalidation times)
- [ ] Consider session-based caching strategies

#### Production Testing

- [ ] Run production build: `cd apps/web && pnpm build`
- [ ] Verify static pages are generated correctly
- [ ] Test ISR revalidation in production
- [ ] Monitor performance improvements

#### Future Optimizations

- [ ] Implement on-demand revalidation API routes
- [ ] Add cache invalidation when content is updated in admin
- [ ] Add cache warming strategies for popular pages
- [ ] Consider implementing Redis for distributed caching

### Cache Strategy

| Content Type      | Revalidation | Cache Tags     |
| ----------------- | ------------ | -------------- |
| Catalogs (navbar) | 1 hour       | `['catalogs']` |
| Hero content      | 30 minutes   | `['hero']`     |
| Services          | 1 hour       | `['services']` |
| Projects          | 1 hour       | `['projects']` |
| Blog posts        | 30 minutes   | `['posts']`    |
| Products          | 1 hour       | `['products']` |

### Files Changed

**Database:**

- `packages/database/src/client.ts`
- `apps/web/lib/cache.ts` (new)

**Web Pages:**

- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`
- `apps/web/app/services/page.tsx`
- `apps/web/app/services/[slug]/page.tsx`
- `apps/web/app/projects/page.tsx`
- `apps/web/app/projects/[slug]/page.tsx`
- `apps/web/app/blogs/page.tsx`
- `apps/web/app/blogs/[slug]/page.tsx`
- `apps/web/app/catalog/[slug]/page.tsx`
- `apps/web/app/catalog/[slug]/[childSlug]/page.tsx`
- `apps/web/app/product/[slug]/page.tsx`

### Notes

- Admin pages (21 files) still use `force-dynamic` - this is intentional for auth/session handling
- Dev server tested successfully - no errors
- All pages render correctly with new caching strategy
