'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Loader2 } from 'lucide-react';

interface AddPaymentMethodFormProps {
  onSuccess?: (paymentMethodId: string) => void;
  onCancel?: () => void;
}

export function AddPaymentMethodForm({ onSuccess, onCancel }: AddPaymentMethodFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Stripe.js dynamically
    const loadStripe = async () => {
      // Stripe Elements will be loaded via script tag or CDN
      // For now, we'll use a simple redirect to Stripe Customer Portal
      // In production, you'd integrate Stripe Elements here
    };

    loadStripe();
  }, []);

  const handleStripeCustomerPortal = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        throw new Error('Failed to create customer portal session');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Add Payment Method
        </CardTitle>
        <CardDescription>
          Add a new payment method to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          To add or manage payment methods, you'll be redirected to Stripe's secure customer portal.
        </p>
        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          onClick={handleStripeCustomerPortal}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Open Customer Portal
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

