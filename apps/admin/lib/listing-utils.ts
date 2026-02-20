import { SQL, and, ilike, or, sql } from 'drizzle-orm';
import { db } from '@repo/database';
import { type AnyPgColumn, type AnyPgTable } from 'drizzle-orm/pg-core';

interface ListingOptions {
  page?: number;
  limit?: number;
  search?: string;
  searchColumns?: AnyPgColumn[];
  filters?: SQL[];
  orderBy?: SQL | SQL[] | ((t: any, operators: DrizzleOrderByOperators) => SQL | SQL[]);
  queryName?: string;
}

import { type DrizzleOrderByOperators } from '@repo/shared';

export async function getListingData<T = unknown>(
  table: AnyPgTable,
  options: ListingOptions & { with?: Record<string, unknown> } = {},
) {
  const {
    page = 1,
    limit = 10,
    search,
    searchColumns = [],
    filters = [],
    orderBy = [],
    with: withRelations,
    queryName,
  } = options;

  const offset = (page - 1) * limit;

  const tableName = queryName || (table as unknown as Record<symbol, string>)[Symbol.for('drizzle:Name')];

  if (!tableName || !(db.query as unknown as Record<string, unknown>)[tableName]) {
    throw new Error(
      `Table "${tableName}" not found in db.query structure. Please ensure it is exported from the schema.`,
    );
  }

  const conditions: SQL[] = [...filters];

  if (search && searchColumns.length > 0) {
    const searchConditions = searchColumns.map((col) => ilike(col, `%${search}%`));
    conditions.push(or(...searchConditions)!);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const query = (db.query as unknown as Record<string, { findMany: (args: unknown) => Promise<T[]> }>)[tableName];

  if (!query) {
    throw new Error(`Query for table "${tableName}" is undefined.`);
  }

  const [data, countResult] = await Promise.all([
    query.findMany({
      where,
      limit,
      offset,
      orderBy: orderBy as any,
      with: withRelations,
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(table)
      .where(where),
  ]);

  const totalItems = Number(countResult[0]?.count || 0);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  };
}
