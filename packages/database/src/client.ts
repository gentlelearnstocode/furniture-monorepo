import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

// Using sql instance instead of createPool to avoid build-time errors
// The sql instance from @vercel/postgres handles lazy connection automatically
export const db = drizzle(sql, { schema });

export * from 'drizzle-orm';
export * from './schema';
