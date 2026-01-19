/**
 * GET /api/wishlist/check
 * Check if a product is in user's wishlist
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { isInWishlist } from '@/lib/db/wishlist';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const inWishlist = await isInWishlist(user.id, productId);

    return NextResponse.json({
      isInWishlist: inWishlist,
    });
  } catch (error) {
    console.error('Error checking wishlist:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to check wishlist';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

