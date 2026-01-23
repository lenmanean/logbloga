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
   * Fetch cart items from API (authenticated users)
   */
  const fetchCartItems = useCallback(async () => {
    if (!isAuthenticated || !user) {
      // Load guest cart from localStorage
      const guestCart = getGuestCart();
      
      // For guest users, we need to fetch product details
      // For now, set empty items (will be populated when items are added)
      setItems([]);
      setIsLoading(false);
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
    // Optimistic update
    const optimisticItem: CartItemWithProduct = {
      id: `temp-${Date.now()}`,
      user_id: user?.id || '',
      product_id: productId,
      variant_id: variantId || null,
      quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setItems(prev => {
      // Check if item already exists (same product + variant)
      const existingIndex = prev.findIndex(
        item => item.product_id === productId && item.variant_id === (variantId || null)
      );

      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 0) + quantity,
        };
        return updated;
      }

      // Add new item
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
          item => item.productId === productId && item.variantId === variantId
        );

        if (existingIndex >= 0) {
          guestCart.items[existingIndex].quantity += quantity;
        } else {
          guestCart.items.push({ productId, quantity, variantId, addedAt: new Date().toISOString() });
        }

        saveGuestCart(guestCart);
        
        // For guests, we need to fetch product details to display
        // For now, refresh will be handled when cart page loads
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Revert optimistic update
      setItems(prev => prev.filter(item => item.id !== optimisticItem.id));
      throw error;
    }
  }, [isAuthenticated, user]);

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
        // Update in localStorage for guests
        const guestCart = getGuestCart();
        // For guests, we need to map cartItemId to productId
        // This is a limitation - guest cart items don't have stable IDs
        // We'll refresh cart to get updated state
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
            item => !(item.productId === removedItem.product_id && item.variantId === removedItem.variant_id)
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

