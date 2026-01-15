import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint for on-demand cache revalidation.
 * Called by the admin app after content mutations to invalidate storefront cache.
 *
 * POST /api/revalidate
 * Body: { tags: string[] }
 * Headers: { Authorization: Bearer <REVALIDATION_SECRET> }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate authorization
    const authHeader = request.headers.get('authorization');
    const secret = process.env.REVALIDATION_SECRET;

    if (!secret) {
      console.error('[Revalidate API] REVALIDATION_SECRET is not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate body
    const body = await request.json();
    const { tags } = body;

    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: tags must be a non-empty array' },
        { status: 400 }
      );
    }

    // Revalidate each tag
    const revalidated: string[] = [];
    for (const tag of tags) {
      if (typeof tag === 'string' && tag.trim()) {
        revalidateTag(tag, 'max');
        revalidated.push(tag);
      }
    }

    console.log(`[Revalidate API] Revalidated tags: ${revalidated.join(', ')}`);

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Revalidate API] Error:', error);
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
