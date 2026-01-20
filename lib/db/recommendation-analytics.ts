/**
 * Recommendation analytics database operations
 * Provides functions for storing and querying recommendation analytics events
 */

import { createServiceRoleClient } from '@/lib/supabase/server';
import type { RecommendationAnalyticsEvent } from '@/lib/recommendations/analytics';

export interface RecommendationAnalytics {
  id: string;
  recommendation_id: string | null;
  product_id: string;
  recommended_product_id: string;
  type: 'upsell' | 'cross-sell' | 'related';
  event: 'view' | 'click' | 'purchase';
  user_id: string | null;
  session_id: string | null;
  timestamp: string;
  metadata: Record<string, any>;
  created_at: string;
}

/**
 * Store recommendation analytics events in the database
 * Performs batch insert for performance
 * 
 * @param events - Array of analytics events to store
 * @returns Number of events successfully stored
 */
export async function storeAnalyticsEvents(
  events: RecommendationAnalyticsEvent[]
): Promise<number> {
  if (!events || events.length === 0) {
    return 0;
  }

  const supabase = await createServiceRoleClient();

  // Prepare events for database insertion
  const eventsToInsert = events.map((event) => ({
    recommendation_id: event.recommendationId || null,
    product_id: event.productId,
    recommended_product_id: event.recommendedProductId,
    type: event.type,
    event: event.event,
    user_id: event.userId || null,
    session_id: event.sessionId || null,
    timestamp: event.timestamp
      ? (typeof event.timestamp === 'string' ? event.timestamp : event.timestamp.toISOString())
      : new Date().toISOString(),
    metadata: {},
  }));

  // Batch insert events
  const { data, error } = await supabase
    .from('recommendation_analytics')
    .insert(eventsToInsert)
    .select('id');

  if (error) {
    console.error('Error storing recommendation analytics events:', error);
    throw new Error(`Failed to store analytics events: ${error.message}`);
  }

  return data?.length || 0;
}

/**
 * Get analytics events for a specific product
 * 
 * @param productId - Product ID to get analytics for
 * @param limit - Maximum number of events to return
 * @returns Array of analytics events
 */
export async function getProductAnalytics(
  productId: string,
  limit: number = 100
): Promise<RecommendationAnalytics[]> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('recommendation_analytics')
    .select('*')
    .eq('product_id', productId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching product analytics:', error);
    throw new Error(`Failed to fetch product analytics: ${error.message}`);
  }

  return (data || []) as unknown as RecommendationAnalytics[];
}

/**
 * Get analytics events for a recommended product
 * 
 * @param recommendedProductId - Recommended product ID
 * @param limit - Maximum number of events to return
 * @returns Array of analytics events
 */
export async function getRecommendedProductAnalytics(
  recommendedProductId: string,
  limit: number = 100
): Promise<RecommendationAnalytics[]> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('recommendation_analytics')
    .select('*')
    .eq('recommended_product_id', recommendedProductId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recommended product analytics:', error);
    throw new Error(`Failed to fetch recommended product analytics: ${error.message}`);
  }

  return (data || []) as unknown as RecommendationAnalytics[];
}

/**
 * Get analytics events for a user
 * 
 * @param userId - User ID
 * @param limit - Maximum number of events to return
 * @returns Array of analytics events
 */
export async function getUserAnalytics(
  userId: string,
  limit: number = 100
): Promise<RecommendationAnalytics[]> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('recommendation_analytics')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user analytics:', error);
    throw new Error(`Failed to fetch user analytics: ${error.message}`);
  }

  return (data || []) as unknown as RecommendationAnalytics[];
}

/**
 * Get conversion rate for a recommendation
 * Calculates click-through rate and purchase conversion rate
 * 
 * @param recommendationId - Recommendation ID
 * @returns Conversion metrics
 */
export async function getRecommendationConversionMetrics(
  recommendationId: string
): Promise<{
  views: number;
  clicks: number;
  purchases: number;
  clickThroughRate: number; // clicks / views
  conversionRate: number; // purchases / clicks
}> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('recommendation_analytics')
    .select('event')
    .eq('recommendation_id', recommendationId);

  if (error) {
    console.error('Error fetching recommendation conversion metrics:', error);
    throw new Error(`Failed to fetch conversion metrics: ${error.message}`);
  }

  const views = data?.filter((e) => e.event === 'view').length || 0;
  const clicks = data?.filter((e) => e.event === 'click').length || 0;
  const purchases = data?.filter((e) => e.event === 'purchase').length || 0;

  const clickThroughRate = views > 0 ? (clicks / views) * 100 : 0;
  const conversionRate = clicks > 0 ? (purchases / clicks) * 100 : 0;

  return {
    views,
    clicks,
    purchases,
    clickThroughRate: Math.round(clickThroughRate * 100) / 100,
    conversionRate: Math.round(conversionRate * 100) / 100,
  };
}
