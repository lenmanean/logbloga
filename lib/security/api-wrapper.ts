/**
 * Secure API route wrapper
 * Provides authentication, rate limiting, CSRF protection, and validation
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { withRateLimit, type RateLimitOptions } from '@/lib/security/rate-limit-middleware';
import { withCsrfProtection } from '@/lib/security/csrf';
import { logActionWithRequest, AuditActions } from '@/lib/security/audit';
import type { ZodSchema } from 'zod';

/**
 * API wrapper options
 */
export interface ApiWrapperOptions {
  /**
   * Require authentication
   */
  requireAuth?: boolean;
  
  /**
   * Rate limit type
   */
  rateLimit?: RateLimitOptions['type'];
  
  /**
   * Require CSRF protection (for state-changing requests)
   */
  requireCsrf?: boolean;
  
  /**
   * Skip rate limiting in development
   */
  skipRateLimitInDev?: boolean;
  
  /**
   * Zod schema for request body validation
   */
  bodySchema?: ZodSchema<any>;
  
  /**
   * Zod schema for search params validation
   */
  searchParamsSchema?: ZodSchema<any>;
  
  /**
   * Log action in audit logs
   */
  auditLog?: {
    action: string;
    resourceType: string;
    resourceId?: string | ((request: Request) => Promise<string | undefined>);
    metadata?: (request: Request, body?: any) => Promise<Record<string, any>>;
  };
}

/**
 * Secure API route handler wrapper
 */
export function withSecureApi<T>(
  handler: (request: Request, context?: { user?: any; body?: any; searchParams?: any }) => Promise<Response>,
  options: ApiWrapperOptions = {}
): (request: Request, context?: any) => Promise<Response> {
  return async (request: Request, context?: any): Promise<Response> => {
    try {
      // Get user if authentication is required
      let user = null;
      if (options.requireAuth) {
        try {
          user = await requireAuth();
        } catch (error) {
          if (error instanceof Error && error.message.includes('Unauthorized')) {
            return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401 }
            );
          }
          throw error;
        }
      }

      // Apply CSRF protection if required
      if (options.requireCsrf) {
        const csrfResponse = await withCsrfProtection(request, async () => {
          // CSRF check passed, continue
          return null as any;
        });

        // If CSRF check failed, return the error response
        if (csrfResponse && csrfResponse.status === 403) {
          return csrfResponse;
        }
      }

      // Apply rate limiting
      if (options.rateLimit) {
        const rateLimitOptions: RateLimitOptions = {
          type: options.rateLimit,
          userId: user?.id,
          skipInDevelopment: options.skipRateLimitInDev,
        };

        return withRateLimit(
          request,
          rateLimitOptions,
          async () => {
            return handleRequest(request, handler, user, options, context);
          }
        );
      }

      // No rate limiting, handle request directly
      return handleRequest(request, handler, user, options, context);
    } catch (error) {
      console.error('API wrapper error:', error);
      
      // Don't expose sensitive error information
      if (error instanceof Error) {
        // Check if it's a validation error
        if (error.message.includes('Validation error')) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }

        // Check if it's an authorization error
        if (error.message.includes('Unauthorized')) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Handle request with validation and logging
 */
async function handleRequest(
  request: Request,
  handler: (request: Request, context?: any) => Promise<Response>,
  user: any,
  options: ApiWrapperOptions,
  context?: any
): Promise<Response> {
  // Validate request body if schema provided
  let body: any = undefined;
  if (options.bodySchema && request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      const json = await request.json();
      body = options.bodySchema.parse(json);
      
      // Re-create request with validated body for handler
      // Note: This creates a new Request object
      request = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(body),
      });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: `Validation error: ${error.message}` },
          { status: 400 }
        );
      }
      throw error;
    }
  }

  // Validate search params if schema provided
  let searchParams: any = undefined;
  if (options.searchParamsSchema) {
    try {
      const url = new URL(request.url);
      const params: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      searchParams = options.searchParamsSchema.parse(params);
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: `Validation error: ${error.message}` },
          { status: 400 }
        );
      }
      throw error;
    }
  }

  // Log audit action if configured
  if (options.auditLog && user) {
    try {
      const resourceId = typeof options.auditLog.resourceId === 'function'
        ? await options.auditLog.resourceId(request)
        : options.auditLog.resourceId;

      const metadata = options.auditLog.metadata
        ? await options.auditLog.metadata(request, body)
        : {};

      await logActionWithRequest(
        {
          user_id: user.id,
          action: options.auditLog.action,
          resource_type: options.auditLog.resourceType,
          resource_id: resourceId,
          metadata,
        },
        request
      );
    } catch (error) {
      console.error('Error logging audit action:', error);
      // Don't fail the request if logging fails
    }
  }

  // Call the handler
  return handler(request, { user, body, searchParams, ...context });
}
