import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserOrders } from '@/lib/db/orders';
import { OrderCard } from '@/components/orders/order-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { OrdersListClient } from './orders-list-client';

export const metadata = {
  title: 'Order History | LogBloga',
  description: 'View your order history',
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin?redirect=/account/orders');
  }

  // Fetch user's orders
  const orders = await getUserOrders(user.id);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your orders
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">No orders yet</CardTitle>
              <CardDescription className="text-center">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <OrdersListClient orders={orders} />
        )}
      </div>
    </main>
  );
}

