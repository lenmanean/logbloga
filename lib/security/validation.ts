/**
 * Centralized input validation utilities
 * Provides Zod schemas for common API endpoints
 */

import { z } from 'zod';

/**
 * Common validation schemas
 */

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

// UUID validation
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Email validation
export const emailSchema = z.string().email('Invalid email address').toLowerCase().trim();

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Product schemas
export const productCreateSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  category: z.string().min(1).max(100),
  price: z.number().positive('Price must be positive'),
  original_price: z.number().positive().optional().nullable(),
  duration: z.string().max(100).optional().nullable(),
  content_hours: z.string().max(50).optional().nullable(),
  package_image: z.string().url().optional().nullable(),
  images: z.array(z.string().url()).optional().default([]),
  tagline: z.string().max(500).optional().nullable(),
  pricing_justification: z.string().optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  review_count: z.number().int().min(0).optional().default(0),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
});

export const productUpdateSchema = productCreateSchema.partial();

// Order schemas
export const orderCreateSchema = z.object({
  items: z.array(z.object({
    product_id: uuidSchema,
    variant_id: uuidSchema.optional().nullable(),
    quantity: z.number().int().positive('Quantity must be positive'),
  })).min(1, 'At least one item is required'),
  discount_code: z.string().optional().nullable(),
  billing_address: z.object({
    street: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    zipCode: z.string().min(1).max(20),
    country: z.string().min(1).max(100),
  }).optional(),
  customer_email: emailSchema,
  customer_name: z.string().min(1).max(200),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled', 'refunded']),
});

// User profile schemas
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(200).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
});

export const emailUpdateSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const passwordUpdateSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: passwordSchema,
  confirm_password: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

// Address schemas
export const addressCreateSchema = z.object({
  label: z.string().min(1).max(100),
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  zip_code: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
  is_default: z.boolean().optional().default(false),
});

export const addressUpdateSchema = addressCreateSchema.partial();

// Coupon schemas
export const couponCreateSchema = z.object({
  code: z.string().min(1).max(50).regex(/^[A-Z0-9-]+$/, 'Code must be uppercase alphanumeric with hyphens'),
  type: z.enum(['percentage', 'fixed_amount']),
  value: z.number().positive('Value must be positive'),
  minimum_purchase: z.number().positive().optional().nullable(),
  maximum_discount: z.number().positive().optional().nullable(),
  valid_from: z.string().datetime().optional().nullable(),
  valid_until: z.string().datetime().optional().nullable(),
  usage_limit: z.number().int().positive().optional().nullable(),
  applies_to: z.any().optional().nullable(), // JSONB
  active: z.boolean().optional().default(true),
});

export const couponValidateSchema = z.object({
  code: z.string().min(1),
  total_amount: z.number().nonnegative('Total amount must be non-negative'),
});

// Review schemas
export const reviewCreateSchema = z.object({
  product_id: uuidSchema,
  order_id: uuidSchema.optional().nullable(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200).optional().nullable(),
  content: z.string().min(1).max(5000).optional().nullable(),
});

export const reviewUpdateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(1).max(200).optional().nullable(),
  content: z.string().min(1).max(5000).optional().nullable(),
});

// Admin schemas
export const adminOrderStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled', 'refunded']),
  notes: z.string().max(1000).optional().nullable(),
});

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().min(1).max(200).optional(),
  category: z.string().max(100).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  sort_by: z.enum(['created_at', 'title', 'price', 'rating']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
}).merge(paginationSchema);

/**
 * Validate and parse request body
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation error: ${message}`);
    }
    throw error;
  }
}

/**
 * Validate and parse URL search params
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams | { [key: string]: string | string[] | undefined },
  schema: z.ZodSchema<T>
): T {
  // Convert URLSearchParams or object to plain object
  const params: Record<string, string> = {};
  
  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  } else {
    Object.entries(searchParams).forEach(([key, value]) => {
      params[key] = Array.isArray(value) ? value[0] : value || '';
    });
  }

  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation error: ${message}`);
    }
    throw error;
  }
}

/**
 * Validate UUID from URL params
 */
export function validateUuid(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    value = value[0];
  }
  if (!value) {
    throw new Error('UUID is required');
  }
  return uuidSchema.parse(value);
}
