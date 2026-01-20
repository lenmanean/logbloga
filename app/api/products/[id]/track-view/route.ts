/**
 * POST /api/products/[id]/track-view
 * Track a product view for recently viewed products
 * Supports both authenticated users and guest sessions
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { trackProductView } from '@/lib/db/recently-viewed';
import { getProductById } from '@/lib/db/products';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get user if authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get session ID from request body or generate one
    const body = await request.json().catch(() => ({}));
    const sessionId = body.sessionId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined);

    // Track the view
    try {
      await trackProductView(
        user?.id || null,
        productId,
        sessionId
      );
    } catch (trackError) {
      console.error('Error tracking product view:', trackError);
      // Don't fail the request if tracking fails
      // Return success even if tracking fails to prevent breaking product pages
    }

    return NextResponse.json({
      success: true,
      productId,
    });
  } catch (error) {
    console.error('Error in track-view endpoint:', error);
    
    // Return success even on error to prevent breaking product pages
    // Tracking is non-critical functionality
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track view',
    });
  }
}
