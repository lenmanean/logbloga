/**
 * Analytics event definitions
 * Standardized event names for tracking user interactions
 */

/**
 * E-commerce events
 */
export const AnalyticsEvents = {
  // Product events
  PRODUCT_VIEW: 'product_view',
  PRODUCT_CLICK: 'product_click',
  PRODUCT_ADD_TO_CART: 'add_to_cart',
  PRODUCT_REMOVE_FROM_CART: 'remove_from_cart',
  
  // Cart events
  CART_VIEW: 'cart_view',
  CART_CHECKOUT_START: 'begin_checkout',
  CART_CHECKOUT_STEP: 'checkout_progress',
  
  // Purchase events
  PURCHASE: 'purchase',
  PURCHASE_COMPLETE: 'purchase_complete',
  
  // User events
  USER_SIGNUP: 'sign_up',
  USER_SIGNIN: 'sign_in',
  USER_SIGNOUT: 'sign_out',
  
  // Navigation events
  PAGE_VIEW: 'page_view',
  SEARCH: 'search',
  
  // Engagement events
  WISHLIST_ADD: 'add_to_wishlist',
  WISHLIST_REMOVE: 'remove_from_wishlist',
  REVIEW_SUBMIT: 'review_submit',
  COUPON_APPLY: 'coupon_apply',
  
  // Recommendation events
  RECOMMENDATION_CLICK: 'recommendation_click',
  RECOMMENDATION_VIEW: 'recommendation_view',
} as const;

/**
 * Track product view
 */
export function trackProductView(productId: string, productName: string, category?: string) {
  const { trackEvent } = require('./client');
  trackEvent(AnalyticsEvents.PRODUCT_VIEW, {
    product_id: productId,
    product_name: productName,
    category: category || null,
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(productId: string, productName: string, price: number, quantity: number = 1) {
  const { trackEvent } = require('./client');
  trackEvent(AnalyticsEvents.PRODUCT_ADD_TO_CART, {
    product_id: productId,
    product_name: productName,
    price,
    quantity,
    value: price * quantity,
  });
}

/**
 * Track checkout start
 */
export function trackCheckoutStart(cartTotal: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) {
  const { trackEvent } = require('./client');
  trackEvent(AnalyticsEvents.CART_CHECKOUT_START, {
    value: cartTotal,
    currency: 'USD',
    items,
  });
}

/**
 * Track purchase
 */
export function trackPurchase(
  transactionId: string,
  value: number,
  items: Array<{ id: string; name: string; price: number; quantity: number }>
) {
  const { trackEvent } = require('./client');
  trackEvent(AnalyticsEvents.PURCHASE, {
    transaction_id: transactionId,
    value,
    currency: 'USD',
    items,
  });
}
