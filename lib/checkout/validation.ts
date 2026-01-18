/**
 * Checkout form validation schemas
 * Uses Zod for type-safe validation
 */

import * as z from 'zod';

/**
 * Address schema (for billing address)
 */
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  zipCode: z.string().min(1, 'ZIP code is required').max(20),
  country: z.string().min(1, 'Country is required').max(100),
});

export type Address = z.infer<typeof addressSchema>;

/**
 * Customer information schema
 */
export const customerInfoSchema = z.object({
  name: z.string().min(1, 'Full name is required').max(200),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  billingAddress: addressSchema.optional(),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>;

/**
 * Complete checkout form schema
 */
export const checkoutFormSchema = z.object({
  customerInfo: customerInfoSchema,
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/**
 * Helper function to get validation error message
 */
export function getValidationErrorMessage(error: z.ZodError<any>): string {
  if (error.issues && error.issues.length > 0) {
    const firstError = error.issues[0];
    return firstError?.message || 'Validation error';
  }
  return 'Validation error';
}

