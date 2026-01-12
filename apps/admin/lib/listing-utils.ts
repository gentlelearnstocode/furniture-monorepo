import { SQL, and, ilike, or, sql } from 'drizzle-orm';
import { db } from '@repo/database';

interface ListingOptions {
  page?: number;
  limit?: number;
  search?: string;
  searchColumns?: any[];
  filters?: SQL[];
  orderBy?: any;
  queryName?: string;
}

export async function getListingData(table: any, options: ListingOptions & { with?: any } = {}) {
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

  const tableName = queryName || (table as any)[Symbol.for('drizzle:Name')];

  if (!tableName || !(db.query as any)[tableName]) {
    throw new Error(
      `Table "${tableName}" not found in db.query structure. Please ensure it is exported from the schema.`
    );
  }

  const conditions: SQL[] = [...filters];

  if (search && searchColumns.length > 0) {
    const searchConditions = searchColumns.map((col) => ilike(col, `%${search}%`));
    conditions.push(or(...searchConditions)!);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    (db.query as any)[tableName].findMany({
      where,
      limit,
      offset,
      orderBy,
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
