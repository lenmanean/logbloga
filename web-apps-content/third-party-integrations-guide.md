# Third-Party Integrations Guide

## Overview

This guide covers integrating third-party APIs and services into your enterprise SaaS, including webhooks, OAuth, data synchronization, and best practices.

## Integration Patterns

### REST API Integration

**Basic Pattern**:

```typescript
async function callThirdPartyAPI(endpoint: string, options: RequestInit) {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
```

### OAuth Integration

**OAuth 2.0 Flow**:

```typescript
// 1. Redirect to authorization
const authUrl = `https://provider.com/oauth/authorize?
  client_id=${CLIENT_ID}&
  redirect_uri=${REDIRECT_URI}&
  response_type=code&
  scope=${SCOPES}`;

// 2. Handle callback
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // 3. Exchange code for token
  const tokenResponse = await fetch('https://provider.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const { access_token, refresh_token } = await tokenResponse.json();

  // 4. Store tokens securely
  await storeTokens(userId, { access_token, refresh_token });
}
```

## Webhook Implementation

### Receiving Webhooks

Create `app/api/webhooks/[provider]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-signature');

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // Handle different event types
  switch (event.type) {
    case 'user.created':
      await handleUserCreated(event.data);
      break;
    case 'user.updated':
      await handleUserUpdated(event.data);
      break;
    default:
      console.log('Unhandled event:', event.type);
  }

  return NextResponse.json({ received: true });
}
```

### Sending Webhooks

```typescript
async function sendWebhook(url: string, payload: any) {
  const signature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(JSON.stringify(payload))
    .digest('hex');

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': signature,
    },
    body: JSON.stringify(payload),
  });
}
```

## Common Integrations

### Email Service (SendGrid/Resend)

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to,
    subject,
    html,
  });
}
```

### Analytics (Mixpanel/Amplitude)

```typescript
import mixpanel from 'mixpanel';

const mixpanelClient = mixpanel.init(process.env.MIXPANEL_TOKEN!);

export function trackEvent(userId: string, event: string, properties?: any) {
  mixpanelClient.track(event, {
    distinct_id: userId,
    ...properties,
  });
}
```

### File Storage (AWS S3/Cloudflare R2)

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(key: string, buffer: Buffer) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: buffer,
  }));
}
```

## Error Handling & Retries

### Retry Logic

```typescript
async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Circuit Breaker

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > 60000) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= 5) {
      this.state = 'open';
    }
  }
}
```

## Rate Limiting

### Implement Rate Limiter

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

## Data Synchronization

### Sync Strategy

```typescript
async function syncData(externalId: string, localData: any) {
  // 1. Fetch from external API
  const externalData = await fetchExternalData(externalId);

  // 2. Compare and merge
  const merged = mergeData(localData, externalData);

  // 3. Update local database
  await updateLocalData(merged);

  // 4. Update external if needed
  if (needsExternalUpdate(merged)) {
    await updateExternalData(externalId, merged);
  }
}
```

## Security Best Practices

1. **Store secrets securely**: Use environment variables
2. **Verify webhooks**: Always verify signatures
3. **Use HTTPS**: Always for API calls
4. **Rotate keys**: Regularly rotate API keys
5. **Monitor usage**: Track API usage and costs
6. **Handle errors**: Implement proper error handling
7. **Rate limiting**: Respect API rate limits

## Testing Integrations

### Mock External APIs

```typescript
// In tests
jest.mock('@/lib/integrations/external-api', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'test' }),
}));
```

### Integration Tests

```typescript
describe('Third-party integration', () => {
  it('should handle webhook events', async () => {
    const response = await fetch('/api/webhooks/provider', {
      method: 'POST',
      body: JSON.stringify(mockEvent),
      headers: { 'X-Signature': validSignature },
    });
    expect(response.status).toBe(200);
  });
});
```

## Monitoring

### Track Integration Health

```typescript
async function checkIntegrationHealth(provider: string) {
  try {
    const start = Date.now();
    await testConnection(provider);
    const latency = Date.now() - start;

    await logHealthCheck({
      provider,
      status: 'healthy',
      latency,
      timestamp: new Date(),
    });
  } catch (error) {
    await logHealthCheck({
      provider,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date(),
    });
  }
}
```

## Resources

- [OAuth 2.0 Spec](https://oauth.net/2/)
- [Webhook Best Practices](https://webhooks.fyi/)
- [API Integration Patterns](https://restfulapi.net/)

---

**Third-party integrations add powerful capabilities. Always implement proper error handling, retries, and monitoring!**
