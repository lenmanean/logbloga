import { requireAuth } from '@/lib/auth/utils';
import { updateCartItem, removeCartItem, getUserCartItems } from '@/lib/db/cart';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * PATCH /api/cart/[id]
 * Update cart item quantity
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    if (quantity > 10) {
      return NextResponse.json(
        { error: 'Maximum quantity is 10 per item' },
        { status: 400 }
      );
    }

    // Verify user owns this cart item
    const supabase = await createClient();
    const { data: cartItem, error: fetchError } = await supabase
      .from('cart_items')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (cartItem.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updatedItem = await updateCartItem(id, quantity);
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to update cart item';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart/[id]
 * Remove cart item
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Verify user owns this cart item
    const supabase = await createClient();
    const { data: cartItem, error: fetchError } = await supabase
      .from('cart_items')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (cartItem.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await removeCartItem(id);
    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}

