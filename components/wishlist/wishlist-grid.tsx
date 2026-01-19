'use client';

import { WishlistItem } from './wishlist-item';
import type { WishlistItemWithProduct } from '@/lib/types/database';

interface WishlistGridProps {
  items: WishlistItemWithProduct[];
  onItemRemove?: (itemId: string) => void;
}

export function WishlistGrid({ items, onItemRemove }: WishlistGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <WishlistItem
          key={item.id}
          item={item}
          onRemove={onItemRemove}
        />
      ))}
    </div>
  );
}

