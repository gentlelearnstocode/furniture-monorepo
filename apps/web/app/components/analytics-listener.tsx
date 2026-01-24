'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackVisit } from '../actions/analytics';
import { v4 as uuidv4 } from 'uuid';

export function AnalyticsListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Generate or retrieve session ID
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('analytics_session_id', sessionId);
    }

    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    // Track the visit
    // Debounce or just fire? Fire is fine for page views.
    // React 18 strict mode in dev might fire twice, which is annoying for analytics testing,
    // but in prod it's fine. We can use a ref to prevent double firing in dev if we really want,
    // but typically route change effects run once per navigation.

    // In strict mode, useEffect runs twice.
    // We can rely on the fact that pathname changes trigger this.

    trackVisit({
      path: fullPath,
      sessionId,
    });
  }, [pathname, searchParams]);

  return null;
}
