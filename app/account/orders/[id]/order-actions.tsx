'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Loader2 } from 'lucide-react';
import type { Order } from '@/lib/types/database';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface OrderActionsProps {
  order: Order;
  canCancel: boolean;
}

export function OrderActions({ order, canCancel }: OrderActionsProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel order');
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error instanceof Error ? error.message : 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    window.location.href = `/api/orders/${order.id}/invoice`;
    // Reset after a delay to allow download to start
    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          {/* Download Invoice */}
          <Button
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            variant="outline"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </>
            )}
          </Button>

          {/* Cancel Order */}
          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isCancelling}>
                  {isCancelling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel Order
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel order {order.order_number}? 
                    This action cannot be undone. If payment was processed, a refund will be initiated.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Order</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelOrder}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Cancel Order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

