/**
 * Shared Payment Element options for checkout and express checkout.
 * Keeps payment method order consistent across the app.
 */

export const PAYMENT_METHOD_ORDER: readonly string[] = [
  'card',
  'apple_pay',
  'google_pay',
  'link',
  'amazon_pay',
  'cashapp',
  'klarna',
  'afterpay_clearpay',
  'affirm',
];
