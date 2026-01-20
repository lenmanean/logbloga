/**
 * POST /api/orders/[id]/cancel
 * Cancel an order
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getOrderById, updateOrderStatus } from '@/lib/db/orders';
import { canCancelOrder, isValidStatusTransition } from '@/lib/orders/status';
import { createFullRefund, StripeRefundError } from '@/lib/stripe/refunds';
import { logActionWithRequest, AuditActions, ResourceTypes } from '@/lib/security/audit';
import { createNotification } from '@/lib/db/notifications-db';
import type { OrderStatus } from '@/lib/types/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order belongs to user
    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized. This order does not belong to you.' },
        { status: 403 }
      );
    }

    // Check if order can be cancelled
    if (!canCancelOrder(order)) {
      return NextResponse.json(
        { error: `Order cannot be cancelled. Current status: ${order.status || 'unknown'}` },
        { status: 400 }
      );
    }

    // Validate status transition (order.status should not be null at this point, but handle it)
    const currentStatus = order.status;
    if (!currentStatus || !isValidStatusTransition(currentStatus as OrderStatus, 'cancelled')) {
      return NextResponse.json(
        { error: 'Invalid status transition' },
        { status: 400 }
      );
    }

    // If payment was processed, initiate Stripe refund before cancelling
    let refundResult = null;
    if (order.stripe_payment_intent_id && (order.status === 'processing' || order.status === 'completed')) {
      try {
        // Create full refund for the order
        refundResult = await createFullRefund(
          order.stripe_payment_intent_id,
          'requested_by_customer',
          {
            order_id: order.id,
            order_number: order.order_number || '',
            cancelled_by: 'customer',
          }
        );

        // Log refund action
        await logActionWithRequest(
          {
            user_id: user.id,
            action: AuditActions.ORDER_REFUND,
            resource_type: ResourceTypes.ORDER,
            resource_id: order.id,
            metadata: {
              refund_id: refundResult.id,
              refund_amount: refundResult.amount,
              refund_status: refundResult.status,
            },
          },
          request
        );

        // Create notification for user about refund
        try {
          await createNotification({
            user_id: user.id,
            type: 'order_status_update',
            title: 'Order Refunded',
            message: `Your order #${order.order_number || 'N/A'} has been cancelled and refunded. The refund amount of $${(refundResult.amount / 100).toFixed(2)} will be processed to your original payment method.`,
            link: `/account/orders/${order.id}`,
            metadata: {
              orderId: order.id,
              refundId: refundResult.id,
              refundAmount: refundResult.amount,
            },
          });
        } catch (notificationError) {
          console.error('Error creating refund notification:', notificationError);
          // Don't fail the cancellation if notification fails
        }
      } catch (refundError) {
        // If refund fails, log error but still allow cancellation
        // This allows manual refund processing if needed
        console.error('Error processing refund for order cancellation:', refundError);
        
        // Log refund failure
        await logActionWithRequest(
          {
            user_id: user.id,
            action: AuditActions.ORDER_REFUND,
            resource_type: ResourceTypes.ORDER,
            resource_id: order.id,
            metadata: {
              refund_attempted: true,
              refund_failed: true,
              error: refundError instanceof Error ? refundError.message : 'Unknown error',
            },
          },
          request
        );

        // Return error if refund is critical (payment was processed)
        if (order.status === 'completed') {
          return NextResponse.json(
            {
              error: 'Order cancellation failed: Unable to process refund. Please contact support.',
              refundError: refundError instanceof StripeRefundError ? refundError.message : 'Refund processing failed',
            },
            { status: 500 }
          );
        }

        // For processing orders, allow cancellation but warn about refund
        console.warn(`Order ${id} cancelled but refund failed. Manual refund may be required.`);
      }
    }

    // Update order status to cancelled (or refunded if refund was successful)
    const newStatus: OrderStatus = refundResult ? 'refunded' : 'cancelled';
    const updatedOrder = await updateOrderStatus(id, newStatus);

    // Log order cancellation
    await logActionWithRequest(
      {
        user_id: user.id,
        action: AuditActions.ORDER_CANCEL,
        resource_type: ResourceTypes.ORDER,
        resource_id: order.id,
        metadata: {
          previous_status: order.status,
          new_status: newStatus,
          refund_processed: !!refundResult,
        },
      },
      request
    );

    return NextResponse.json({
      ...updatedOrder,
      refund: refundResult ? {
        id: refundResult.id,
        amount: refundResult.amount,
        status: refundResult.status,
      } : null,
    });
  } catch (error) {
    console.error('Error cancelling order:', error);

    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to cancel order';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

