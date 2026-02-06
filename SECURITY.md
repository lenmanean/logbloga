# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email security details to: security@logbloga.com
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge receipt of your report within 48 hours and provide an update on our progress within 7 days.

## Security Measures

### Authentication & Authorization

- **Supabase Auth**: All authentication is handled through Supabase Auth
- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, numbers, and special characters
- **Session Management**: Secure session management with HTTP-only cookies
- **JWT Tokens**: JWT tokens managed by Supabase (not exposed to client)

### API Security

- **Rate Limiting**: Auth rate limits (sign-in, sign-up, OTP) enforced by Supabase (Dashboard > Authentication > Rate Limits). Application-layer rate limit helpers are no-op.
- **CSRF Protection**: Double Submit Cookie pattern for state-changing requests
- **Input Validation**: All API endpoints validate input using Zod schemas
- **XSS Prevention**: Input sanitization and HTML escaping

### Data Protection

- **Encryption**: All data transmitted over HTTPS
- **Database**: PostgreSQL with Row Level Security (RLS) policies
- **Password Hashing**: Handled by Supabase (bcrypt)
- **API Keys**: Stored as environment variables, never exposed to client
- **Payment Data**: Processed securely through Stripe (PCI DSS compliant)

### Security Headers

- **Content-Security-Policy**: Restricts resource loading
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME sniffing)
- **Strict-Transport-Security**: Enforces HTTPS
- **Referrer-Policy**: strict-origin-when-cross-origin

### GDPR Compliance

- **Data Export**: Users can export all their data in JSON format
- **Right to Deletion**: Account deletion removes or anonymizes all user data
- **Cookie Consent**: Detailed consent management with categories
- **Consent Tracking**: Track user consents for marketing, analytics, and data processing
- **Audit Logging**: Comprehensive audit logs for security and compliance

### Audit Logging

We maintain audit logs for:
- Authentication events (login, logout, password change)
- Admin actions (order updates, user management)
- Payment events (refunds, chargebacks)
- Security events (failed login attempts, rate limit hits)
- GDPR events (data export, account deletion)

### Environment Security

- **Environment Variables**: All secrets stored as environment variables
- **Validation**: Environment variables validated at startup
- **API Key Rotation**: Regular rotation of API keys recommended

## Best Practices

1. **Never log sensitive data** (passwords, payment info, tokens)
2. **Use parameterized queries** (handled by Supabase)
3. **Validate all user input** on the server side
4. **Use HTTPS everywhere** in production
5. **Implement least privilege** principle
6. **Keep dependencies updated** for security patches
7. **Monitor security events** via audit logs
8. **Use secure cookies** (httpOnly, secure, sameSite)
9. **Implement proper error handling** without information disclosure
10. **Regular security audits** and penetration testing

## Incident Response

In case of a security incident:

1. **Immediate**: Assess the severity and impact
2. **Containment**: Isolate affected systems if necessary
3. **Investigation**: Determine root cause
4. **Remediation**: Fix the vulnerability
5. **Notification**: Notify affected users if required by law
6. **Review**: Conduct post-incident review

## Contact

For security concerns, please contact:
- **Email**: security@logbloga.com
- **Response Time**: Within 48 hours

## Acknowledgments

We appreciate responsible disclosure of security vulnerabilities. Security researchers who report valid vulnerabilities will be acknowledged (with permission) in our security acknowledgments.
