import { requireAuth } from '@/lib/auth/utils';
import { clearUserCart } from '@/lib/db/cart';
import { NextResponse } from 'next/server';

/**
 * DELETE /api/cart/clear
 * Clear all cart items for authenticated user
 */
export async function DELETE() {
  try {
    const user = await requireAuth();
    await clearUserCart(user.id);

    return NextResponse.json(
      { message: 'Cart cleared successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}

