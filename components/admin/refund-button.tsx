'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from './confirm-dialog';
import { Loader2, RefreshCw } from 'lucide-react';

interface RefundButtonProps {
  orderId: string;
  paymentIntentId: string;
  onRefundComplete?: () => void;
}

export function RefundButton({
  orderId,
  paymentIntentId,
  onRefundComplete,
}: RefundButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefund = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process refund');
      }

      alert('Refund processed successfully');
      onRefundComplete?.();
    } catch (error) {
      console.error('Error processing refund:', error);
      alert(error instanceof Error ? error.message : 'Failed to process refund');
    } finally {
      setIsProcessing(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsDialogOpen(true)}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Process Refund
          </>
        )}
      </Button>

      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Process Refund"
        description="Are you sure you want to process a refund for this order? This action cannot be undone."
        confirmLabel="Process Refund"
        variant="destructive"
        onConfirm={handleRefund}
      />
    </>
  );
}

