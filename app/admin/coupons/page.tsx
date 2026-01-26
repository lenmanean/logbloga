import { requireAdmin } from '@/lib/admin/permissions';
import { getAllCoupons } from '@/lib/admin/coupons';
import { CouponTable } from '@/components/admin/coupon-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Coupons | Admin Dashboard | Logbloga',
  description: 'Manage coupons',
};

export default async function AdminCouponsPage() {
  await requireAdmin();

  const coupons = await getAllCoupons({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground mt-1">
            Manage discount coupons
          </p>
        </div>
        <Link href="/admin/coupons/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Coupon
          </Button>
        </Link>
      </div>

      <CouponTable coupons={coupons} />
    </div>
  );
}

