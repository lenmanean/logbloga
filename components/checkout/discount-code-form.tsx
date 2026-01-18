'use client';

import { useState } from 'react';
import { useCheckout } from '@/contexts/checkout-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DiscountCodeForm() {
  const { appliedCoupon, applyCoupon, removeCoupon, isValidatingCoupon, checkoutError } = useCheckout();
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!code.trim()) {
      setLocalError('Please enter a coupon code');
      return;
    }

    const result = await applyCoupon(code.trim());
    if (!result.success) {
      setLocalError(result.error || 'Failed to apply coupon');
    } else {
      setCode(''); // Clear input on success
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setCode('');
    setLocalError(null);
  };

  const errorMessage = localError || checkoutError;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <Label className="text-base font-semibold">Discount Code</Label>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-md">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold text-sm">{appliedCoupon.code}</p>
              <p className="text-xs text-muted-foreground">
                {appliedCoupon.type === 'percentage'
                  ? `${appliedCoupon.value}% off`
                  : `$${appliedCoupon.value} off`}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove coupon</span>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setLocalError(null);
              }}
              disabled={isValidatingCoupon}
              className="flex-1"
              aria-invalid={!!errorMessage}
            />
            <Button
              type="submit"
              disabled={isValidatingCoupon || !code.trim()}
              variant="outline"
            >
              {isValidatingCoupon ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="sr-only">Applying...</span>
                </>
              ) : (
                'Apply'
              )}
            </Button>
          </div>
          {errorMessage && (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

