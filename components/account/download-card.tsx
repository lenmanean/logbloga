import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderItem } from "@/types/order";
import { Download, Calendar, FileText } from "lucide-react";

interface DownloadCardProps {
  orderItem: OrderItem;
}

export function DownloadCard({ orderItem }: DownloadCardProps) {
  const isExpired = new Date(orderItem.expires_at) < new Date();
  const daysRemaining = Math.ceil(
    (new Date(orderItem.expires_at).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {orderItem.product?.name || "Product"}
          </CardTitle>
          {isExpired ? (
            <Badge variant="destructive">Expired</Badge>
          ) : (
            <Badge variant="secondary">{daysRemaining} days left</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Purchased {formatDate(orderItem.created_at)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            Downloaded {orderItem.downloads_count} time{orderItem.downloads_count !== 1 ? "s" : ""}
          </div>
          <Button
            asChild
            disabled={isExpired}
            className="w-full mt-4"
          >
            <a
              href={`/api/download/${orderItem.download_key}`}
              download
            >
              <Download className="mr-2 h-4 w-4" />
              {isExpired ? "Download Expired" : "Download"}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

