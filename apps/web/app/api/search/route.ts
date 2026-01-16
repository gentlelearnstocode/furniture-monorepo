import { NextRequest, NextResponse } from 'next/server';
import { db, products, productAssets } from '@repo/database';
import { ilike, or, eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const searchTerm = `%${query}%`;

  try {
    const searchResults = await db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        or(ilike(products.name, searchTerm), ilike(products.slug, searchTerm))
      ),
      limit: 10,
      columns: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
      },
      with: {
        gallery: {
          where: eq(productAssets.isPrimary, true),
          with: {
            asset: {
              columns: {
                url: true,
                altText: true,
              },
            },
          },
          limit: 1,
        },
      },
    });

    const results = searchResults.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.basePrice,
      image: product.gallery[0]?.asset?.url ?? null,
      imageAlt: product.gallery[0]?.asset?.altText ?? product.name,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('[Search API] Error:', error);
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 });
  }
}
