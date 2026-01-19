/**
 * GET /api/orders/[id]/invoice
 * Generate and download PDF invoice for an order
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getOrderWithItems } from '@/lib/db/orders';
import { generateInvoicePDF } from '@/lib/orders/pdf-generator';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order with items
    const order = await getOrderWithItems(id);

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

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(order);

    // Return PDF with proper headers
    const orderNumber = order.order_number || 'invoice';
    const filename = `invoice-${orderNumber}.pdf`;

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);

    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate invoice';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

