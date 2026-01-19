/**
 * POST /api/wishlist/add
 * Add product to user's wishlist
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { addToWishlist } from '@/lib/db/wishlist';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const wishlistItem = await addToWishlist(user.id, productId);

    return NextResponse.json({
      success: true,
      item: wishlistItem,
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to add to wishlist';
    
    if (errorMessage.includes('already in wishlist')) {
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

