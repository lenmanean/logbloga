/**
 * Recommendation Analytics
 * Tracks recommendation performance (views, clicks, purchases)
 */

export type RecommendationEvent = 'view' | 'click' | 'purchase';

export interface RecommendationAnalyticsEvent {
  recommendationId?: string;
  productId: string;
  recommendedProductId: string;
  type: 'upsell' | 'cross-sell' | 'related';
  event: RecommendationEvent;
  userId?: string;
  sessionId?: string;
  timestamp?: Date | string;
}

/**
 * Track a recommendation event
 * Stores events in localStorage for client-side tracking
 * Can be sent to server via API endpoint
 */
export function trackRecommendationEvent(event: RecommendationAnalyticsEvent): void {
  if (typeof window === 'undefined') {
    return; // Server-side, skip tracking
  }

  const timestamp = event.timestamp || new Date();
  const sessionId = event.sessionId || getOrCreateSessionId();

  const analyticsEvent = {
    ...event,
    timestamp: timestamp instanceof Date ? timestamp.toISOString() : timestamp,
    sessionId,
  };

  // Store in localStorage for batch sending
  const events = getStoredEvents();
  events.push(analyticsEvent);
  
  // Keep only last 100 events to prevent localStorage overflow
  if (events.length > 100) {
    events.shift();
  }
  
  localStorage.setItem('recommendation_analytics', JSON.stringify(events));

  // Optionally send to server immediately (or batch send)
  // sendAnalyticsToServer(analyticsEvent);
}

/**
 * Track recommendation view
 */
export function trackRecommendationView(
  productId: string,
  recommendedProductId: string,
  type: 'upsell' | 'cross-sell' | 'related',
  recommendationId?: string
): void {
  trackRecommendationEvent({
    recommendationId,
    productId,
    recommendedProductId,
    type,
    event: 'view',
  });
}

/**
 * Track recommendation click
 */
export function trackRecommendationClick(
  productId: string,
  recommendedProductId: string,
  type: 'upsell' | 'cross-sell' | 'related',
  recommendationId?: string
): void {
  trackRecommendationEvent({
    recommendationId,
    productId,
    recommendedProductId,
    type,
    event: 'click',
  });
}

/**
 * Track recommendation purchase
 */
export function trackRecommendationPurchase(
  productId: string,
  recommendedProductId: string,
  orderId: string,
  type: 'upsell' | 'cross-sell' | 'related',
  recommendationId?: string
): void {
  trackRecommendationEvent({
    recommendationId: recommendationId || orderId, // Use orderId if recommendationId not provided
    productId,
    recommendedProductId,
    type,
    event: 'purchase',
  });
}

/**
 * Get or create a session ID
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Get stored analytics events from localStorage
 */
export function getStoredEvents(): RecommendationAnalyticsEvent[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem('recommendation_analytics');
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading stored analytics events:', error);
    return [];
  }
}

/**
 * Clear stored analytics events
 */
export function clearStoredEvents(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem('recommendation_analytics');
}

/**
 * Send analytics events to server
 * Batches and sends all stored events
 */
export async function sendAnalyticsToServer(
  events?: RecommendationAnalyticsEvent[]
): Promise<void> {
  const eventsToSend = events || getStoredEvents();
  
  if (eventsToSend.length === 0) {
    return;
  }

  try {
    const response = await fetch('/api/recommendations/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events: eventsToSend }),
    });

    if (response.ok) {
      // Clear stored events after successful send
      clearStoredEvents();
    } else {
      console.error('Failed to send analytics events:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending analytics events:', error);
    // Events remain in localStorage for retry later
  }
}

/**
 * Initialize analytics
 * Sets up periodic sending of analytics events
 */
export function initializeAnalytics(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Send events every 30 seconds if there are any
  setInterval(() => {
    const events = getStoredEvents();
    if (events.length > 0) {
      sendAnalyticsToServer();
    }
  }, 30000);

  // Send events on page unload
  window.addEventListener('beforeunload', () => {
    sendAnalyticsToServer();
  });
}

