import { formatDate } from "@/lib/utils";
import { formatAmountForDisplay as formatPrice } from "@/lib/stripe/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order";
import { Calendar, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
          <Badge className={statusColors[order.status]}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(order.created_at)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-bold">{formatPrice(order.total_amount)}</span>
          </div>
          <Button variant="outline" size="sm" asChild className="w-full mt-4">
            <Link href={`/account/orders?order=${order.id}`}><span>View Details</span></Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

