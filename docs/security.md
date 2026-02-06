# Internal Security Documentation

## Overview

This document provides internal documentation for security measures implemented in the Logbloga application.

## Architecture

### Security Layers

1. **Network Layer**: HTTPS enforcement, security headers
2. **Application Layer**: Authentication, authorization, input validation
3. **Database Layer**: Row Level Security (RLS), parameterized queries
4. **API Layer**: Rate limiting, CSRF protection, input validation

## Implementation Details

### Rate Limiting

**Location**: `lib/security/rate-limit.ts`

**Configuration**:
- Public endpoints: 100 requests/minute per IP
- Authenticated endpoints: 200 requests/minute per user
- Auth endpoints: 5 requests/minute per IP
- Payment endpoints: 10 requests/minute per user
- Admin endpoints: 500 requests/minute per user

**Auth rate limits**: Configured in Supabase Dashboard (Authentication > Rate Limits). Application-layer rate limit helpers are no-op; auth (sign-in, sign-up, OTP) is limited by Supabase.

**Implementation**:
```typescript
import { withRateLimit } from '@/lib/security/rate-limit-middleware';

export async function GET(request: Request) {
  return withRateLimit(request, { type: 'public' }, async () => {
    // Handler code
  });
}
```

### CSRF Protection

**Location**: `lib/security/csrf.ts`

**Implementation**: Double Submit Cookie pattern

**Usage**:
1. Get CSRF token: `GET /api/csrf-token`
2. Include token in requests: `X-CSRF-Token: <token>`
3. Token validated automatically on state-changing requests

**Exemptions**: Stripe webhooks (use signature verification instead)

### Payment flow

Payment uses Stripe Checkout (redirect); card data is never handled by the app. Cart is cleared only after successful payment (Stripe webhook). See [PAYMENT_FLOW.md](PAYMENT_FLOW.md) for flow, webhook, and production env checklist.

### Input Validation

**Location**: `lib/security/validation.ts`

**Usage**: Zod schemas for all API endpoints

**Example**:
```typescript
import { validateRequestBody, orderCreateSchema } from '@/lib/security/validation';

const body = await validateRequestBody(request, orderCreateSchema);
```

### XSS Prevention

**Location**: `lib/security/xss.ts`, `lib/security/sanitization.ts`

**Implementation**:
- HTML entity escaping
- Content sanitization with DOMPurify
- URL validation and sanitization
- File upload validation

### Audit Logging

**Location**: `lib/security/audit.ts`

**Logged Events**:
- Authentication events
- Admin actions
- Payment events
- Security events
- GDPR events

**Usage**:
```typescript
import { logAction, AuditActions, ResourceTypes } from '@/lib/security/audit';

await logAction({
  user_id: user.id,
  action: AuditActions.ORDER_CREATE,
  resource_type: ResourceTypes.ORDER,
  resource_id: order.id,
  metadata: { amount: order.total_amount },
});
```

### GDPR Compliance

#### Data Export

**Location**: `lib/gdpr/data-export.ts`, `app/api/account/data-export/route.ts`

**Rate Limit**: 1 export per 24 hours per user

**Includes**:
- Profile information
- Order history
- Licenses
- Cart items
- Addresses
- Notifications
- Wishlist
- Reviews
- Audit logs
- Cookie consents
- Consent records

#### Account Deletion

**Location**: `app/api/account/delete/route.ts`

**Process**:
1. Log deletion request
2. Anonymize reviews (remove user association)
3. Anonymize audit logs (remove user association)
4. Delete user account (cascades to most related data)
5. Confirm deletion

**Data Retention**: Reviews and audit logs are anonymized (not deleted) for data integrity

#### Cookie Consent

**Location**: `lib/security/cookie-consent.ts`, `components/legal/cookie-consent.tsx`

**Categories**:
- Essential: Always enabled (auth, cart, security)
- Analytics: User tracking, analytics (optional)
- Marketing: Marketing cookies, ads (optional)

**Storage**: 
- Database (for authenticated users)
- localStorage + cookie (for guests)

#### Consent Tracking

**Location**: `lib/gdpr/consents.ts`

**Types**:
- Marketing communications
- Analytics tracking
- Data processing
- Third-party sharing

**Usage**:
```typescript
import { grantConsent, revokeConsent, hasConsent } from '@/lib/gdpr/consents';

await grantConsent(userId, 'marketing');
const hasMarketingConsent = await hasConsent(userId, 'marketing');
```

### API Security Wrapper

**Location**: `lib/security/api-wrapper.ts`

**Features**:
- Authentication (optional)
- Rate limiting
- CSRF protection
- Input validation
- Audit logging

**Usage**:
```typescript
import { withSecureApi } from '@/lib/security/api-wrapper';
import { orderCreateSchema } from '@/lib/security/validation';

export const POST = withSecureApi(
  async (request, { user, body }) => {
    // Handler code
  },
  {
    requireAuth: true,
    rateLimit: 'authenticated',
    requireCsrf: true,
    bodySchema: orderCreateSchema,
    auditLog: {
      action: AuditActions.ORDER_CREATE,
      resourceType: ResourceTypes.ORDER,
    },
  }
);
```

## Environment Variables

### Required

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key (server-only)
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret (server-only)

### Optional

- `RESEND_API_KEY`: Resend API key (for emails)
- `RESEND_FROM_EMAIL`: Resend from email address
- `NEXT_PUBLIC_APP_URL`: Application URL
- `SECURITY_AUDIT_RETENTION_DAYS`: Audit log retention period (default: 365)

**Validation**: Environment variables validated at startup (`lib/security/env-validation.ts`)

## Security Best Practices

1. **Never log sensitive data** (passwords, payment info, tokens)
2. **Use parameterized queries** (handled by Supabase)
3. **Validate all user input** on the server side
4. **Use HTTPS everywhere** in production
5. **Implement least privilege** principle
6. **Rotate API keys** regularly
7. **Monitor security events** via audit logs
8. **Keep dependencies updated** for security patches
9. **Use secure cookies** (httpOnly, secure, sameSite)
10. **Implement proper error handling** without information disclosure

## Incident Response

1. **Assess**: Determine severity and impact
2. **Contain**: Isolate affected systems if necessary
3. **Investigate**: Determine root cause
4. **Remediate**: Fix the vulnerability
5. **Notify**: Notify affected users if required by law
6. **Review**: Conduct post-incident review

## Security Contacts

- **Security Email**: security@logbloga.com
- **Response Time**: Within 48 hours

## API Key Rotation Strategy

1. **Create new keys** in respective services
2. **Update environment variables** in staging
3. **Test thoroughly** in staging environment
4. **Deploy to production** with new keys
5. **Keep old keys** active for 24-48 hours
6. **Revoke old keys** after confirmation
7. **Monitor for errors** during rotation period

## Regular Security Tasks

- **Weekly**: Review audit logs for suspicious activity
- **Monthly**: Update dependencies
- **Quarterly**: Security audit and penetration testing
- **Annually**: Review and update security policies

## Testing Security

1. **Rate Limiting**: Test with rapid requests
2. **CSRF Protection**: Attempt cross-site requests without token
3. **Input Validation**: Submit invalid/malicious input
4. **XSS Prevention**: Attempt XSS attacks with script tags
5. **Authentication**: Test unauthorized access attempts
6. **Authorization**: Test access to unauthorized resources

## Monitoring

- **Audit Logs**: Monitor for security events
- **Rate Limiting**: Monitor for abuse patterns
- **Failed Logins**: Monitor for brute force attempts
- **Unusual Activity**: Monitor for suspicious patterns
