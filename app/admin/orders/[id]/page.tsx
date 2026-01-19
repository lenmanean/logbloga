import { requireAdmin } from '@/lib/admin/permissions';
import { getAdminOrderWithItems } from '@/lib/admin/orders';
import { notFound } from 'next/navigation';
import { OrderDetails } from '@/components/admin/order-details';
import { OrderStatusSelector } from '@/components/admin/order-status-selector';
import { RefundButton } from '@/components/admin/refund-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { OrderStatus } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Order Details | Admin Dashboard | LogBloga',
  description: 'Order details and management',
};

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailsPage({ params }: OrderDetailsPageProps) {
  await requireAdmin();

  const { id } = await params;
  const order = await getAdminOrderWithItems(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-2">Order {order.order_number}</h1>
        </div>
        <div className="flex gap-2">
          <OrderStatusSelector orderId={order.id} currentStatus={(order.status || 'pending') as OrderStatus} />
          {order.status === 'completed' && order.stripe_payment_intent_id && (
            <RefundButton orderId={order.id} paymentIntentId={order.stripe_payment_intent_id} />
          )}
        </div>
      </div>

      <OrderDetails order={order} />

      {/* Order Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Order Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <OrderStatusSelector orderId={order.id} currentStatus={(order.status || 'pending') as OrderStatus} />
            {order.status === 'completed' && order.stripe_payment_intent_id && (
              <RefundButton orderId={order.id} paymentIntentId={order.stripe_payment_intent_id} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

