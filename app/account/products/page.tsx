import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { getUserProductAccess } from '@/lib/db/access';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Download, Gift, BookOpen } from 'lucide-react';
import { ProductsList } from '@/components/account/products-list';
import { DoerCouponDisplay } from '@/components/account/doer-coupon-display';

export const metadata = {
  title: 'My Products & Downloads | LogBloga',
  description: 'Access your purchased digital products',
};

export default async function ProductsPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Get all products user has access to (direct purchases + via packages)
  const products = await getUserProductAccess(user.id);

  // Separate packages and individual products
  const packages = products.filter(p => p.product_type === 'package');
  const individualProducts = products.filter(p => p.product_type !== 'package');

  // Get orders with Doer coupons for packages
  const { data: orders } = await supabase
    .from('orders')
    .select('id, doer_coupon_code, doer_coupon_expires_at, doer_coupon_used, doer_coupon_used_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .not('doer_coupon_code', 'is', null)
    .order('created_at', { ascending: false });

  const ordersWithCoupons = orders || [];

  if (packages.length === 0 && individualProducts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2">No products yet</CardTitle>
          <CardDescription className="text-center">
            You haven't purchased any products yet. Start shopping to build your library.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Packages Section */}
      {packages.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Packages
            </h2>
            <p className="text-muted-foreground mt-1">
              Your purchased packages and their included products
            </p>
          </div>
          <ProductsList 
            products={packages} 
            ordersWithCoupons={ordersWithCoupons}
            type="package"
          />
        </div>
      )}

      {/* Individual Products Section */}
      {individualProducts.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Download className="h-6 w-6" />
              Individual Products
            </h2>
            <p className="text-muted-foreground mt-1">
              Products purchased separately or included in packages
            </p>
          </div>
          <ProductsList 
            products={individualProducts}
            ordersWithCoupons={[]}
            type="individual"
          />
        </div>
      )}
    </div>
  );
}
