/**
 * POST /api/recommendations/track
 * Track recommendation analytics events
 */

import { NextResponse } from 'next/server';
import type { RecommendationAnalyticsEvent } from '@/lib/recommendations/analytics';
import { storeAnalyticsEvents } from '@/lib/db/recommendation-analytics';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { events } = body;

    if (!Array.isArray(events)) {
      return NextResponse.json({ error: 'Events array is required' }, { status: 400 });
    }

    // Validate events structure
    const validEvents: RecommendationAnalyticsEvent[] = [];
    for (const event of events) {
      if (
        event.productId &&
        event.recommendedProductId &&
        event.type &&
        event.event &&
        ['view', 'click', 'purchase'].includes(event.event)
      ) {
        validEvents.push({
          recommendationId: event.recommendationId,
          productId: event.productId,
          recommendedProductId: event.recommendedProductId,
          type: event.type,
          event: event.event,
          userId: event.userId,
          sessionId: event.sessionId,
          timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
        });
      }
    }

    // Store events in database
    let storedCount = 0;
    try {
      storedCount = await storeAnalyticsEvents(validEvents);
    } catch (storageError) {
      console.error('Error storing analytics events:', storageError);
      // Don't fail the request if storage fails - events are still logged
      // This allows the system to continue functioning even if analytics storage is temporarily unavailable
    }

    // Optional: Send to external analytics service (e.g., Google Analytics, Mixpanel)
    // This can be added later as an additional analytics destination
    // Example:
    // if (process.env.GOOGLE_ANALYTICS_ID) {
    //   await sendToGoogleAnalytics(validEvents);
    // }

    return NextResponse.json({
      success: true,
      eventsProcessed: validEvents.length,
      eventsStored: storedCount,
    });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to track analytics';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

