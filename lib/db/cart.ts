/**
 * Cart database operations
 * Provides type-safe functions for managing shopping cart items in Supabase
 */

import { createClient } from '@/lib/supabase/server';
import type { CartItem, Product } from '@/lib/types/database';

export interface CartItemWithProduct extends CartItem {
  product?: Product;
}

/**
 * Get all cart items for a user with product details
 */
export async function getUserCartItems(userId: string): Promise<CartItemWithProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cart items:', error);
    throw new Error(`Failed to fetch cart items: ${error.message}`);
  }

  // Map the data to our type structure
  return (data || []).map((item: any) => ({
    ...item,
    product: item.product || undefined,
  })) as CartItemWithProduct[];
}

/**
 * Add item to cart (or update quantity if item already exists)
 */
export async function addCartItem(
  userId: string,
  productId: string,
  quantity: number,
  variantId?: string
): Promise<CartItemWithProduct> {
  const supabase = await createClient();

  // Validate product exists and is active
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, active, price')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    throw new Error('Product not found');
  }

  if (!product.active) {
    throw new Error('Product is no longer available');
  }

  // Check if item already exists in cart
  let query = supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId);
  
  if (variantId) {
    query = query.eq('variant_id', variantId);
  } else {
    query = query.is('variant_id', null);
  }
  
  const { data: existingItem } = await query.single();

  if (existingItem) {
    // Update quantity (add to existing, max 10)
    const newQuantity = Math.min(existingItem.quantity + quantity, 10);
    return updateCartItem(existingItem.id, newQuantity);
  }

  // Create new cart item
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: userId,
      product_id: productId,
      variant_id: variantId || null,
      quantity,
    })
    .select(`
      *,
      product:products(*)
    `)
    .single();

  if (error) {
    console.error('Error adding cart item:', error);
    throw new Error(`Failed to add item to cart: ${error.message}`);
  }

  return {
    ...data,
    product: (data as any).product || undefined,
  } as CartItemWithProduct;
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  cartItemId: string,
  quantity: number
): Promise<CartItemWithProduct> {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  if (quantity > 10) {
    throw new Error('Maximum quantity is 10 per item');
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .select(`
      *,
      product:products(*)
    `)
    .single();

  if (error) {
    console.error('Error updating cart item:', error);
    throw new Error(`Failed to update cart item: ${error.message}`);
  }

  return {
    ...data,
    product: (data as any).product || undefined,
  } as CartItemWithProduct;
}

/**
 * Remove item from cart
 */
export async function removeCartItem(cartItemId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) {
    console.error('Error removing cart item:', error);
    throw new Error(`Failed to remove cart item: ${error.message}`);
  }
}

/**
 * Clear all cart items for a user
 */
export async function clearUserCart(userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing cart:', error);
    throw new Error(`Failed to clear cart: ${error.message}`);
  }
}

/**
 * Remove from cart only the items whose product_id is in the given list.
 * Used after payment so only paid order items are removed; other cart items remain.
 */
export async function removeCartItemsByProductIds(
  userId: string,
  productIds: string[]
): Promise<void> {
  if (productIds.length === 0) return;

  const supabase = await createClient();

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .in('product_id', productIds);

  if (error) {
    console.error('Error removing cart items by product ids:', error);
    throw new Error(`Failed to remove cart items: ${error.message}`);
  }
}

/**
 * Get total item count (sum of quantities) for a user's cart
 */
export async function getCartItemCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('user_id', userId);

  if (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }

  return (data || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
}
