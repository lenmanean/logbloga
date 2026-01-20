/**
 * Environment variable validation
 * Ensures all required environment variables are present and valid
 */

import { z } from 'zod';

/**
 * Environment variables schema
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  
  // Stripe (optional for build, required at runtime)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'Stripe publishable key is required').optional(),
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'Stripe webhook secret is required').optional(),
  
  // Email (Resend)
  RESEND_API_KEY: z.string().min(1, 'Resend API key is required').optional(),
  RESEND_FROM_EMAIL: z.string().email('Invalid Resend from email').optional(),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL').optional(),
  
  // Upstash Redis (optional - only required if using rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url('Invalid Upstash Redis URL').optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'Upstash Redis token is required').optional(),
  
  // Security
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SECURITY_AUDIT_RETENTION_DAYS: z.coerce.number().int().positive().default(365).optional(),
  
  // Optional environment variables
  SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
});

/**
 * Validate environment variables
 * Should be called at application startup
 */
export function validateEnv(): z.infer<typeof envSchema> {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError && error.errors) {
      const missingVars = error.errors.map((e) => ({
        path: e.path ? e.path.join('.') : 'unknown',
        message: e.message || 'Validation error',
      }));

      const errorMessage = `
❌ Environment Variable Validation Failed

Missing or invalid environment variables:
${missingVars.map((v) => `  - ${v.path}: ${v.message}`).join('\n')}

Please check your .env.local file and ensure all required variables are set.
      `.trim();

      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    throw error;
  }
}

/**
 * Get validated environment variables
 * Use this instead of directly accessing process.env
 */
export function getEnv(): z.infer<typeof envSchema> {
  // Cache the validated env for performance
  if (!(global as any).__validatedEnv) {
    (global as any).__validatedEnv = validateEnv();
  }
  return (global as any).__validatedEnv;
}

/**
 * Check if a specific environment variable is set
 */
export function hasEnv(key: keyof z.infer<typeof envSchema>): boolean {
  const env = process.env as any;
  return env[key] !== undefined && env[key] !== '';
}

/**
 * Get environment variable with validation
 */
export function getEnvVar<T extends keyof z.infer<typeof envSchema>>(
  key: T
): z.infer<typeof envSchema>[T] {
  const env = getEnv();
  return env[key];
}

/**
 * Check if required environment variables for specific features are present
 */
export function checkFeatureRequirements(): {
  rateLimiting: boolean;
  email: boolean;
  analytics: boolean;
} {
  return {
    rateLimiting: hasEnv('UPSTASH_REDIS_REST_URL') && hasEnv('UPSTASH_REDIS_REST_TOKEN'),
    email: hasEnv('RESEND_API_KEY'),
    analytics: hasEnv('NEXT_PUBLIC_ANALYTICS_ID'),
  };
}
