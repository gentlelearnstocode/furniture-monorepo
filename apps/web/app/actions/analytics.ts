'use server';

import { db } from '@repo/database';
import { analyticsVisits } from '@repo/database/schema';
import { headers } from 'next/headers';

type TrackVisitData = {
  path: string;
  sessionId: string;
};

export async function trackVisit(data: TrackVisitData) {
  try {
    const headersList = await headers();
    const referrer = headersList.get('referer');
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Simple device detection based on User-Agent
    const isMobile = /mobile/i.test(userAgent);
    const isTablet = /tablet/i.test(userAgent);
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    // Simple IP Hash (Privacy focused - just to distinguish sessions roughly if no session ID)
    // Note: In Next.js middleware or hosting like Vercel, getting IP can be tricky.
    // We'll skip IP hashing for now to avoid complexity and reliance on X-Forwarded-For headers which vary.
    // relying on client-generated sessionId is decent for basic analytics.

    await db.insert(analyticsVisits).values({
      path: data.path,
      sessionId: data.sessionId,
      referrer: referrer || null,
      deviceType,
      browser: userAgent,
    });
  } catch (error) {
    console.error('Failed to track visit:', error);
    // Don't crash the app for analytics failures
  }
}
