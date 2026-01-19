'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Trash2, Check } from 'lucide-react';
import type Stripe from 'stripe';

interface PaymentMethodCardProps {
  paymentMethod: Stripe.PaymentMethod;
  isDefault?: boolean;
  onSetDefault?: (paymentMethodId: string) => void;
  onDelete?: (paymentMethodId: string) => void;
}

export function PaymentMethodCard({
  paymentMethod,
  isDefault = false,
  onSetDefault,
  onDelete,
}: PaymentMethodCardProps) {
  const card = paymentMethod.card;

  if (!card) {
    return null;
  }

  const formatCardNumber = (last4: string): string => {
    return `•••• •••• •••• ${last4}`;
  };

  const getCardBrandIcon = (brand: string): string => {
    const brandLower = brand.toLowerCase();
    if (brandLower.includes('visa')) return '💳';
    if (brandLower.includes('mastercard')) return '💳';
    if (brandLower.includes('amex')) return '💳';
    if (brandLower.includes('discover')) return '💳';
    return '💳';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getCardBrandIcon(card.brand)}</div>
            <div>
              <div className="font-semibold flex items-center gap-2">
                {card.brand.toUpperCase()} {formatCardNumber(card.last4)}
                {isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Expires {card.exp_month}/{card.exp_year}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {card.funding && (
          <p className="text-xs text-muted-foreground capitalize">{card.funding}</p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {!isDefault && onSetDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(paymentMethod.id)}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-2" />
            Set Default
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(paymentMethod.id)}
            className="flex-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

