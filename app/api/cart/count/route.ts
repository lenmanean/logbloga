import { requireAuth } from '@/lib/auth/utils';
import { getCartItemCount } from '@/lib/db/cart';
import { NextResponse } from 'next/server';

/**
 * GET /api/cart/count
 * Get total item count (sum of quantities) for authenticated user's cart
 */
export async function GET() {
  try {
    const user = await requireAuth();
    const count = await getCartItemCount(user.id);

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    
    return NextResponse.json(
      { error: 'Failed to get cart count', count: 0 },
      { status: 500 }
    );
  }
}

