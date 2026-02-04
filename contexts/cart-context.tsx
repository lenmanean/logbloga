'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { CartItemWithProduct } from '@/lib/db/cart';
import {
  getGuestCart,
  saveGuestCart,
  clearGuestCart,
  calculateCartTotal,
  calculateCartItemCount,
  mergeCartItems,
} from '@/lib/cart/utils';

const GUEST_ITEM_ID_PREFIX = 'guest:';
function guestCartItemId(productId: string, variantId?: string | null): string {
  return `${GUEST_ITEM_ID_PREFIX}${productId}:${variantId ?? 'none'}`;
}
function parseGuestCartItemId(id: string): { productId: string; variantId: string | null } | null {
  if (!id.startsWith(GUEST_ITEM_ID_PREFIX)) return null;
  const rest = id.slice(GUEST_ITEM_ID_PREFIX.length);
  const colon = rest.indexOf(':');
  if (colon === -1) return null;
  const productId = rest.slice(0, colon);
  const variantPart = rest.slice(colon + 1);
  return { productId, variantId: variantPart === 'none' ? null : variantPart };
}

export interface CartContextType {
  items: CartItemWithProduct[];
  isLoading: boolean;
  itemCount: number;
  total: number;
  addItem: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider Component
 * Manages cart state for both authenticated and guest users
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Calculate derived values
  const itemCount = calculateCartItemCount(items);
  const total = calculateCartTotal(items);

  /**
   * Fetch cart items from API (authenticated) or guest cart + product details (signed out)
   */
  const fetchCartItems = useCallback(async () => {
    if (!isAuthenticated || !user) {
      const guestCart = getGuestCart();
      if (guestCart.items.length === 0) {
        setItems([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const productIds = [...new Set(guestCart.items.map((i) => i.productId))];
        const res = await fetch(
          `/api/products/cart-details?ids=${encodeURIComponent(productIds.join(','))}`
        );
        if (!res.ok) {
          setItems([]);
          return;
        }
        const { products } = await res.json() as { products?: Array<{ id: string; title?: string; slug?: string | null; price: number; package_image?: string | null; images?: unknown }> };
        const productMap = new Map((products || []).map((p) => [p.id, p]));
        const built = guestCart.items
          .map((gi): CartItemWithProduct | null => {
            const product = productMap.get(gi.productId);
            if (!product) return null;
            return {
              id: guestCartItemId(gi.productId, gi.variantId),
              user_id: '',
              product_id: gi.productId,
              variant_id: gi.variantId ?? null,
              quantity: gi.quantity,
              created_at: gi.addedAt,
              updated_at: gi.addedAt,
              product: {
                id: product.id,
                title: product.title ?? 'Product',
                name: product.title ?? 'Product',
                slug: product.slug,
                price: product.price,
                package_image: product.package_image,
                images: product.images,
              } as CartItemWithProduct['product'],
            };
          })
          .filter((item): item is CartItemWithProduct => item !== null);
        setItems(built);
      } catch (error) {
        console.error('Error loading guest cart:', error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/cart');
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Sync guest cart to database when user logs in
   */
  const syncGuestCartToDatabase = useCallback(async () => {
    if (!isAuthenticated || !user || isSyncing) {
      return;
    }

    const guestCart = getGuestCart();
    if (guestCart.items.length === 0) {
      return;
    }

    try {
      setIsSyncing(true);
      
      // Get existing cart items to merge
      const existingResponse = await fetch('/api/cart');
      const existingItems = existingResponse.ok ? await existingResponse.json() : [];
      
      // Merge guest cart with existing cart
      const mergeResults = mergeCartItems(
        existingItems.map((item: CartItemWithProduct) => ({
          id: item.id,
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          quantity: item.quantity || 0,
        })),
        guestCart.items
      );

      // Apply merges: update existing items and add new ones
      for (const mergeResult of mergeResults) {
        try {
          if (mergeResult.isUpdate && mergeResult.existingCartItemId) {
            // Update existing item
            await fetch(`/api/cart/${mergeResult.existingCartItemId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ quantity: mergeResult.quantity }),
            });
          } else {
            // Add new item
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: mergeResult.productId,
                quantity: mergeResult.quantity,
                variantId: mergeResult.variantId,
              }),
            });
          }
        } catch (error) {
          console.error('Error syncing cart item:', error);
          // Continue with other items even if one fails
        }
      }

      // Clear guest cart after successful sync
      clearGuestCart();
      
      // Refresh cart
      await fetchCartItems();
    } catch (error) {
      console.error('Error syncing guest cart:', error);
      // Keep guest cart if sync fails
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, user, isSyncing, fetchCartItems]);

  /**
   * Initialize cart on mount and when auth state changes
   */
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  /**
   * Sync guest cart when user logs in
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      syncGuestCartToDatabase();
    }
  }, [isAuthenticated, user, syncGuestCartToDatabase]);

  /**
   * Add item to cart
   */
  const addItem = useCallback(async (productId: string, quantity: number, variantId?: string) => {
    const variantIdNorm = variantId ?? null;
    const optimisticItem: CartItemWithProduct = {
      id: isAuthenticated && user ? `temp-${Date.now()}` : guestCartItemId(productId, variantIdNorm),
      user_id: user?.id || '',
      product_id: productId,
      variant_id: variantIdNorm,
      quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product_id === productId && item.variant_id === variantIdNorm
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 0) + quantity,
        };
        return updated;
      }
      return [optimisticItem, ...prev];
    });

    try {
      if (isAuthenticated && user) {
        // Add to database
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity, variantId }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || 'Failed to add item to cart';
          throw new Error(errorMessage);
        }

        const addedItem = await response.json();
        
        // Replace optimistic item with real item
        setItems(prev => {
          const withoutTemp = prev.filter(item => !item.id.startsWith('temp-'));
          return [addedItem, ...withoutTemp];
        });
      } else {
        // Save to localStorage for guests
        const guestCart = getGuestCart();
        const existingIndex = guestCart.items.findIndex(
          item => item.productId === productId && (item.variantId ?? null) === (variantId ?? null)
        );

        if (existingIndex >= 0) {
          guestCart.items[existingIndex].quantity += quantity;
        } else {
          guestCart.items.push({ productId, quantity, variantId, addedAt: new Date().toISOString() });
        }

        saveGuestCart(guestCart);
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setItems(prev => prev.filter(item => item.id !== optimisticItem.id));
      throw error;
    }
  }, [isAuthenticated, user, fetchCartItems]);

  /**
   * Update cart item quantity
   */
  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    // Optimistic update
    setItems(prev => prev.map(item => 
      item.id === cartItemId ? { ...item, quantity } : item
    ));

    try {
      if (isAuthenticated && user) {
        const response = await fetch(`/api/cart/${cartItemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity }),
        });

        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }

        const updatedItem = await response.json();
        
        // Replace with updated item
        setItems(prev => prev.map(item => 
          item.id === cartItemId ? updatedItem : item
        ));
      } else {
        const parsed = parseGuestCartItemId(cartItemId);
        if (parsed) {
          const guestCart = getGuestCart();
          const idx = guestCart.items.findIndex(
            (i) => i.productId === parsed.productId && (i.variantId ?? null) === parsed.variantId
          );
          if (idx >= 0) {
            guestCart.items[idx].quantity = quantity;
            saveGuestCart(guestCart);
          }
        }
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Revert optimistic update
      await fetchCartItems();
      throw error;
    }
  }, [isAuthenticated, user, fetchCartItems]);

  /**
   * Remove item from cart
   */
  const removeItem = useCallback(async (cartItemId: string) => {
    // Optimistic update
    const removedItem = items.find(item => item.id === cartItemId);
    setItems(prev => prev.filter(item => item.id !== cartItemId));

    try {
      if (isAuthenticated && user) {
        const response = await fetch(`/api/cart/${cartItemId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to remove item');
        }
      } else {
        // Remove from localStorage for guests
        const guestCart = getGuestCart();
        if (removedItem) {
          guestCart.items = guestCart.items.filter(
            item => !(item.productId === removedItem.product_id && (item.variantId ?? null) === removedItem.variant_id)
          );
          saveGuestCart(guestCart);
        }
      }
    } catch (error) {
      console.error('Error removing item:', error);
      // Revert optimistic update
      if (removedItem) {
        setItems(prev => [...prev, removedItem]);
      }
      throw error;
    }
  }, [isAuthenticated, user, items]);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(async () => {
    // Optimistic update
    setItems([]);

    try {
      if (isAuthenticated && user) {
        const response = await fetch('/api/cart/clear', {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to clear cart');
        }
      } else {
        // Clear localStorage for guests
        clearGuestCart();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Revert optimistic update
      await fetchCartItems();
      throw error;
    }
  }, [isAuthenticated, user, fetchCartItems]);

  /**
   * Refresh cart from API/localStorage
   */
  const refreshCart = useCallback(async () => {
    await fetchCartItems();
  }, [fetchCartItems]);

  const value: CartContextType = {
    items,
    isLoading,
    itemCount,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart Hook
 * Provides easy access to cart context
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}

