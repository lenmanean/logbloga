/**
 * DELETE /api/wishlist/remove
 * Remove product from user's wishlist
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { removeFromWishlist } from '@/lib/db/wishlist';

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await removeFromWishlist(user.id, productId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to remove from wishlist';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

