import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getOrderWithItems } from '@/lib/db/orders';
import { OrderDetails } from '@/components/orders/order-details';
import { OrderActions } from './order-actions';
import { canCancelOrder } from '@/lib/orders/status';
import { DoerCouponDisplay } from '@/components/account/doer-coupon-display';

export const metadata = {
  title: 'Order Details | Logbloga',
  description: 'View order details',
};

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin?redirect=/account/orders/' + id);
  }

  // Fetch order with items
  const order = await getOrderWithItems(id);

  if (!order) {
    notFound();
  }

  // Verify order belongs to user
  if (order.user_id !== user.id) {
    redirect('/account/orders');
  }

  const canCancel = canCancelOrder(order);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <a
            href="/account/orders"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            ← Back to Orders
          </a>
        </div>

        <OrderDetails order={order} showActions={true} />

        {/* DOER Coupon Display */}
        {(order as any).doer_coupon_code && (
          <div className="mt-6">
            <DoerCouponDisplay
              couponCode={(order as any).doer_coupon_code}
              expiresAt={(order as any).doer_coupon_expires_at || null}
              used={(order as any).doer_coupon_used || false}
              usedAt={(order as any).doer_coupon_used_at || null}
            />
          </div>
        )}

        {/* Order Actions */}
        <div className="mt-6">
          <OrderActions order={order} canCancel={canCancel} />
        </div>
      </div>
    </main>
  );
}

