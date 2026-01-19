/**
 * License card component for list view
 * Displays license summary in a card format
 */

import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink, Key } from 'lucide-react';
import { useState } from 'react';
import type { LicenseWithProduct, LicenseStatus } from '@/lib/types/database';
import { maskLicenseKey } from '@/lib/licenses/generator';
import Link from 'next/link';

interface LicenseCardProps {
  license: LicenseWithProduct;
  showFullKey?: boolean;
}

export function LicenseCard({ license, showFullKey = false }: LicenseCardProps) {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(showFullKey);

  const licenseKey = license.license_key;
  const maskedKey = maskLicenseKey(licenseKey);
  const displayKey = showKey ? licenseKey : maskedKey;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy license key:', error);
    }
  };

  const activationDate = license.activated_at
    ? format(new Date(license.activated_at), 'MMM d, yyyy')
    : license.access_granted_at
      ? format(new Date(license.access_granted_at), 'MMM d, yyyy')
      : 'N/A';

  const statusColors: Record<LicenseStatus, { text: string; bg: string }> = {
    active: {
      text: 'text-green-700 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    inactive: {
      text: 'text-gray-700 dark:text-gray-400',
      bg: 'bg-gray-100 dark:bg-gray-900/30',
    },
    revoked: {
      text: 'text-red-700 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
  };

  const statusColor = statusColors[license.status as LicenseStatus] || statusColors.inactive;

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {license.product?.title || 'Product'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Activated {activationDate}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={`${statusColor.text} ${statusColor.bg} border-0`}
          >
            {license.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* License Key */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Key className="h-3 w-3" />
              License Key
            </span>
            <div className="flex items-center gap-2">
              {!showFullKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? 'Hide' : 'Show'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={handleCopy}
                title="Copy license key"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          <div className="p-2 bg-muted rounded-md font-mono text-xs break-all">
            {displayKey}
          </div>
        </div>

        {/* Lifetime Access Badge */}
        {license.lifetime_access && (
          <Badge variant="outline" className="text-xs">
            Lifetime Access
          </Badge>
        )}

        {/* Product Link */}
        {license.product?.slug && (
          <Link href={`/ai-to-usd/packages/${license.product.slug}`}>
            <Button variant="ghost" size="sm" className="w-full h-8">
              View Product
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
