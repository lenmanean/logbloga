'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import type { SavedAddress } from '@/lib/db/addresses';

interface AddressSelectorProps {
  addresses: SavedAddress[];
  selectedAddressId?: string;
  onSelect: (addressId: string | null) => void;
  onAddNew?: () => void;
  type?: 'billing' | 'shipping';
  label?: string;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  onAddNew,
  type = 'billing',
  label,
}: AddressSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedAddressId);

  useEffect(() => {
    setSelectedId(selectedAddressId);
  }, [selectedAddressId]);

  const handleSelect = (value: string) => {
    setSelectedId(value);
    onSelect(value === 'none' ? null : value);
  };

  const formatAddress = (address: SavedAddress): string => {
    const parts: string[] = [];
    if (address.label) parts.push(address.label);
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    return parts.join(', ') || 'Address';
  };

  const filteredAddresses = addresses.filter((addr) => {
    if (type === 'billing') {
      return addr.type === 'billing' || addr.type === 'both';
    } else {
      return addr.type === 'shipping' || addr.type === 'both';
    }
  });

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <Select value={selectedId || 'none'} onValueChange={handleSelect}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select an address" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {filteredAddresses.map((address) => (
              <SelectItem key={address.id} value={address.id}>
                {formatAddress(address)}
                {address.is_default_billing && type === 'billing' && ' (Default)'}
                {address.is_default_shipping && type === 'shipping' && ' (Default)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {onAddNew && (
          <Button type="button" variant="outline" onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        )}
      </div>
    </div>
  );
}

