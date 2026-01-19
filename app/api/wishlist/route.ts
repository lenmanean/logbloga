/**
 * GET /api/wishlist
 * Get user's wishlist
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getUserWishlist } from '@/lib/db/wishlist';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const wishlist = await getUserWishlist(user.id);

    return NextResponse.json({
      wishlist,
      count: wishlist.length,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wishlist';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

