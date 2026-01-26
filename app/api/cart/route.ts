import { requireAuth } from '@/lib/auth/utils';
import { getUserCartItems, addCartItem } from '@/lib/db/cart';
import { NextResponse } from 'next/server';
import type { Product } from '@/lib/types/database';

/**
 * GET /api/cart
 * Get all cart items for authenticated user
 */
export async function GET() {
  try {
    const user = await requireAuth();
    const cartItems = await getUserCartItems(user.id);

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Add item to cart
 * Only allows packages to be added
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { productId, quantity, variantId } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0 || quantity > 10) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Validate that product is a package
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id, product_type, active')
      .eq('id', productId)
      .single();

    if (productError || !productData) {
      console.error('Error fetching product:', productError);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Type assertion - product_type column exists in database but may not be in generated types
    const product = productData as unknown as Product;

    if (!product.active) {
      return NextResponse.json(
        { error: 'Product is no longer available' },
        { status: 400 }
      );
    }

    // Only allow packages to be added to cart
    if (product.product_type !== 'package') {
      return NextResponse.json(
        { error: 'Only packages can be added to cart.' },
        { status: 400 }
      );
    }

    const cartItem = await addCartItem(
      user.id,
      productId,
      quantity,
      variantId
    );

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
    
    if (errorMessage.includes('not found') || errorMessage.includes('no longer available')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

