/**
 * POST /api/packages/[package-id]/grant-access
 * Development endpoint to grant immediate access to a package (bypasses payment)
 * Creates a completed order with the package, granting lifetime access
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getProductById } from '@/lib/db/products';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ 'package-id': string }>;
}

export async function POST(
  request: Request,
  { params }: RouteParams
) {
  try {
    const user = await requireAuth();
    const { 'package-id': packageId } = await params;

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Get product/package info
    const product = await getProductById(packageId);

    if (!product) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Verify it's a package
    if (product.product_type !== 'package') {
      return NextResponse.json(
        { error: 'This endpoint only works for packages' },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Generate order number
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number');

    if (orderNumberError) {
      console.error('Error generating order number:', orderNumberError);
      return NextResponse.json(
        { error: 'Failed to generate order number' },
        { status: 500 }
      );
    }

    const orderNumber = orderNumberData as string;

    // Get product price
    const productPrice = typeof product.price === 'number'
      ? product.price
      : parseFloat(String(product.price || 0));

    // Create completed order (status: 'completed' for immediate access)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        customer_email: user.email || '',
        customer_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
        subtotal: productPrice,
        total_amount: productPrice,
        tax_amount: 0,
        discount_amount: 0,
        currency: 'USD',
        status: 'completed', // Completed status grants immediate access
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order item
    const { data: orderItem, error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: product.id,
        variant_id: null,
        product_name: product.title || product.name || 'Package',
        product_sku: product.slug || null,
        quantity: 1,
        price: productPrice,
        unit_price: productPrice,
        total_price: productPrice,
      })
      .select()
      .single();

    if (itemError || !orderItem) {
      console.error('Error creating order item:', itemError);
      // Order was created but item failed - try to clean up
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Failed to create order item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      message: 'Access granted successfully',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }

    console.error('Error granting access:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to grant access';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
