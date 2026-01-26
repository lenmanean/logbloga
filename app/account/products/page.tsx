import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { getUserProductAccess } from '@/lib/db/access';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { ProductsList } from '@/components/account/products-list';
import { DoerCouponDisplay } from '@/components/account/doer-coupon-display';

export const metadata = {
  title: 'My Products & Downloads | Logbloga',
  description: 'Access your purchased digital products',
};

export default async function ProductsPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Get all packages user has access to (packages only)
  const products = await getUserProductAccess(user.id);
  const packages = products.filter(p => p.product_type === 'package');

  // Get orders with DOER coupons for packages
  // Using type assertion since columns are added via migration but types may not be regenerated yet
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, doer_coupon_code, doer_coupon_expires_at, doer_coupon_used, doer_coupon_used_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .not('doer_coupon_code', 'is', null)
    .order('created_at', { ascending: false }) as any;

  // Handle case where columns might not exist or query fails
  const ordersWithCoupons: Array<{
    id: string;
    doer_coupon_code: string | null;
    doer_coupon_expires_at: string | null;
    doer_coupon_used: boolean | null;
    doer_coupon_used_at: string | null;
  }> = (orders && !ordersError) ? (orders as any[]).map((order: any) => ({
    id: order.id,
    doer_coupon_code: order.doer_coupon_code || null,
    doer_coupon_expires_at: order.doer_coupon_expires_at || null,
    doer_coupon_used: order.doer_coupon_used || false,
    doer_coupon_used_at: order.doer_coupon_used_at || null,
  })) : [];

  if (packages.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2">No packages yet</CardTitle>
          <CardDescription className="text-center">
            You haven't purchased any packages yet. Start shopping to build your library.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Packages Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Packages
          </h2>
          <p className="text-muted-foreground mt-1">
            Your purchased packages
          </p>
        </div>
        <ProductsList 
          products={packages} 
          ordersWithCoupons={ordersWithCoupons}
          type="package"
        />
      </div>
    </div>
  );
}
