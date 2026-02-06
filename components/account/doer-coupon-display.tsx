'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, ExternalLink, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DoerCouponDisplayProps {
  couponCode: string | null;
  expiresAt?: string | null;
  used?: boolean;
  usedAt?: string | null;
  className?: string;
  compact?: boolean;
}

export function DoerCouponDisplay({
  couponCode,
  expiresAt,
  used = false,
  usedAt,
  className,
  compact = false,
}: DoerCouponDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!couponCode) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy coupon code:', error);
    }
  };

  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;
  const isValid = !used && !isExpired;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Gift className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm">{couponCode}</span>
        {isValid && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-6 px-2"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn('border-primary/20 bg-primary/5', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-6 w-6 flex-shrink-0 items-center justify-center">
              <Image
                src="/usedoer_favicon.png"
                alt="DOER logo"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
                unoptimized
              />
            </span>
            <CardTitle>6 Months Free DOER Pro</CardTitle>
          </div>
          {used && (
            <Badge variant="outline" className="bg-gray-500/10 text-gray-700 dark:text-gray-400">
              Used
            </Badge>
          )}
          {isExpired && !used && (
            <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400">
              Expired
            </Badge>
          )}
        </div>
        <CardDescription>
          Your bonus coupon code for 6 months of free DOER Pro subscription on usedoer.com
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coupon Code */}
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border bg-background p-3 font-mono text-lg font-semibold">
            {couponCode}
          </div>
          {isValid && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-muted-foreground">
          {expiresAt && !used && (
            <p>
              Valid until: {new Date(expiresAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
          {used && usedAt && (
            <p>
              Redeemed on: {new Date(usedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>

        {/* Actions */}
        {isValid && (
          <div className="flex gap-2">
            <Button
              asChild
              className="flex-1"
              variant="default"
            >
              <a
                href="https://usedoer.com/checkout?plan=pro&cycle=monthly"
                target="_blank"
                rel="noopener noreferrer"
              >
                Redeem on DOER
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        )}

        {/* Instructions */}
        {isValid && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">How to redeem:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Visit usedoer.com/checkout?plan=pro&cycle=monthly (or cycle=annual)</li>
              <li>Enter your code in the Promo Code field at checkout</li>
              <li>Enjoy 6 months free Pro subscription</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
