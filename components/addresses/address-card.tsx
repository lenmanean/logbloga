'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MapPin, Check } from 'lucide-react';
import type { SavedAddress } from '@/lib/db/addresses';

interface AddressCardProps {
  address: SavedAddress;
  onEdit?: (address: SavedAddress) => void;
  onDelete?: (addressId: string) => void;
  onSetDefault?: (addressId: string, type: 'billing' | 'shipping') => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  const formatAddress = (): string => {
    const parts: string[] = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zip_code) parts.push(address.zip_code);
    if (address.country) parts.push(address.country);
    return parts.join(', ');
  };

  const getTypeLabel = (): string => {
    switch (address.type) {
      case 'billing':
        return 'Billing';
      case 'shipping':
        return 'Shipping';
      case 'both':
        return 'Billing & Shipping';
      default:
        return 'Address';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {address.label || getTypeLabel()}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {getTypeLabel()}
              </Badge>
              {address.is_default_billing && (
                <Badge variant="secondary" className="text-xs">
                  Default Billing
                </Badge>
              )}
              {address.is_default_shipping && (
                <Badge variant="secondary" className="text-xs">
                  Default Shipping
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {address.full_name && (
            <p className="font-medium">{address.full_name}</p>
          )}
          <p className="text-muted-foreground">{formatAddress()}</p>
          {address.phone && (
            <p className="text-muted-foreground">Phone: {address.phone}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4 border-t">
        <div className="flex gap-2 w-full">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(address)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(address.id)}
              className="flex-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
        {onSetDefault && (
          <div className="flex gap-2 w-full">
            {address.type !== 'shipping' && !address.is_default_billing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetDefault(address.id, 'billing')}
                className="flex-1 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Set Default Billing
              </Button>
            )}
            {address.type !== 'billing' && !address.is_default_shipping && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetDefault(address.id, 'shipping')}
                className="flex-1 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Set Default Shipping
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

