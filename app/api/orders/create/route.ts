import { requireAuth } from '@/lib/auth/utils';
import { getUserCartItems, clearUserCart } from '@/lib/db/cart';
import { createOrderWithItems } from '@/lib/db/orders';
import { validateCoupon } from '@/lib/db/coupons';
import { calculateOrderTotals } from '@/lib/checkout/calculations';
import { NextResponse } from 'next/server';
import type { CustomerInfo } from '@/lib/checkout/validation';
import { createNotification } from '@/lib/db/notifications-db';

/**
 * POST /api/orders/create
 * Create a new order from cart items
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { customerInfo, couponCode } = body;

    // Validate customer info
    if (!customerInfo || !customerInfo.email || !customerInfo.name) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      );
    }

    // Get cart items
    const cartItems = await getUserCartItems(user.id);

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty. Add items to your cart before placing an order.' },
        { status: 400 }
      );
    }

    // Validate coupon if provided
    let coupon = null;
    if (couponCode) {
      const subtotal = cartItems.reduce((sum, item) => {
        const price = typeof item.product?.price === 'number'
          ? item.product.price
          : parseFloat(String(item.product?.price || 0));
        return sum + (price * (item.quantity || 0));
      }, 0);

      const productIds = cartItems
        .map(item => item.product_id)
        .filter((id): id is string => !!id);

      const validationResult = await validateCoupon(couponCode, subtotal, productIds);
      if (validationResult.valid && validationResult.coupon) {
        coupon = validationResult.coupon;
      }
    }

    // Calculate order totals
    const orderTotals = calculateOrderTotals(cartItems, coupon || undefined);

    // Create order with items
    const order = await createOrderWithItems(
      {
        userId: user.id,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        subtotal: orderTotals.subtotal,
        totalAmount: orderTotals.total,
        taxAmount: orderTotals.taxAmount,
        discountAmount: orderTotals.discountAmount,
        couponId: coupon?.id,
        currency: 'USD',
        billingAddress: customerInfo.billingAddress || null,
      },
      cartItems
    );

    // Clear cart after successful order creation
    try {
      await clearUserCart(user.id);
    } catch (error) {
      console.error('Error clearing cart after order creation:', error);
      // Don't fail the order creation if cart clearing fails
    }

    // Create order confirmation notification (non-blocking)
    try {
      await createNotification({
        user_id: user.id,
        type: 'order_confirmation',
        title: 'Order Placed',
        message: `Your order #${order.order_number || 'N/A'} has been placed successfully.`,
        link: `/account/orders/${order.id}`,
        metadata: { orderId: order.id },
      });
    } catch (error) {
      console.error('Error creating order confirmation notification:', error);
    }

    // Send order confirmation email (non-blocking)
    try {
      const { sendOrderConfirmation } = await import('@/lib/email/senders');
      if (order.customer_email) {
        const emailData = {
          order: {
            id: order.id,
            orderNumber: order.order_number || '',
            status: order.status || 'pending',
            totalAmount: parseFloat(String(order.total_amount)),
            subtotal: parseFloat(String(order.subtotal)),
            taxAmount: order.tax_amount ? parseFloat(String(order.tax_amount)) : null,
            discountAmount: order.discount_amount ? parseFloat(String(order.discount_amount)) : null,
            currency: order.currency || 'USD',
            createdAt: order.created_at || new Date().toISOString(),
            customerEmail: order.customer_email,
            customerName: order.customer_name,
          },
          items: (order.items || []).map(item => ({
            productName: item.product_name,
            quantity: item.quantity,
            unitPrice: parseFloat(String(item.unit_price)),
            total: parseFloat(String(item.total_price)),
          })),
        };
        await sendOrderConfirmation(user.id, emailData);
      }
    } catch (error) {
      // Log error but don't fail the order creation
      console.error('Error sending order confirmation email:', error);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }

    console.error('Error creating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

