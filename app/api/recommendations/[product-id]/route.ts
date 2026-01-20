/**
 * GET /api/recommendations/[product-id]
 * Fetch recommendations for a product
 */

import { NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/recommendations/engine';
import type { RecommendationType } from '@/lib/recommendations/engine';
import { cachedResponse, cachePresets } from '@/lib/api/cache-headers';

interface RouteParams {
  params: Promise<{ 'product-id': string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { 'product-id': productId } = await params;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get('type');
    const limitParam = searchParams.get('limit');
    const excludeParam = searchParams.get('exclude');

    const types: RecommendationType[] = typeParam
      ? (typeParam.split(',') as RecommendationType[])
      : ['related', 'cross-sell', 'upsell'];

    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const excludeProductIds = excludeParam ? excludeParam.split(',') : [];

    const recommendations = await getRecommendations(productId, {
      types,
      limit,
      excludeProductIds,
    });

    // Format response
    const formatted = recommendations.map((rec) => ({
      product: rec.product,
      score: rec.score,
      source: rec.source,
      type: rec.type,
    }));

    // Return with cache headers (5 minutes for recommendations)
    return cachedResponse(
      {
        productId,
        recommendations: formatted,
        count: formatted.length,
      },
      cachePresets.mediumCache(300) // 5 minutes
    );
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch recommendations';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

