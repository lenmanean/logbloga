/**
 * GET /api/wishlist/count
 * Get user's wishlist count
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getWishlistCount } from '@/lib/db/wishlist';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const count = await getWishlistCount(user.id);

    return NextResponse.json({
      count,
    });
  } catch (error) {
    console.error('Error fetching wishlist count:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wishlist count';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

