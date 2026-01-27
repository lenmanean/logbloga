# Vercel Edge Functions Guide

## Overview

This guide covers using Vercel Edge Functions for low-latency, globally distributed serverless functions in your Next.js application.

**Documentation**: [vercel.com/docs/functions/edge-functions](https://vercel.com/docs/functions/edge-functions)

## What are Edge Functions?

Edge Functions run at the edge (closer to users) for:
- Lower latency
- Faster cold starts
- Global distribution
- Cost-effective execution

## Creating Edge Functions

### Basic Edge Function

Create `app/api/edge/route.ts`:

```typescript
export const runtime = 'edge';

export async function GET(request: Request) {
  return new Response(
    JSON.stringify({ message: 'Hello from Edge!' }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
```

### Edge Function with Headers

```typescript
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'World';

  return new Response(
    JSON.stringify({ message: `Hello, ${name}!` }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60',
      },
    }
  );
}
```

## Use Cases

### 1. API Proxies

```typescript
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response('Missing URL parameter', { status: 400 });
  }

  const response = await fetch(url);
  const data = await response.text();

  return new Response(data, {
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'text/plain',
      'Cache-Control': 'public, s-maxage=300',
    },
  });
}
```

### 2. Authentication

```typescript
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(JSON.stringify({ user }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### 3. Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export const runtime = 'edge';

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  return new Response(JSON.stringify({ message: 'Success' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### 4. A/B Testing

```typescript
export const runtime = 'edge';

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie');
  const variant = cookie?.includes('variant=b') ? 'b' : 'a';

  const response = new Response(JSON.stringify({ variant }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `variant=${variant}; Path=/; Max-Age=86400`,
    },
  });

  return response;
}
```

## Limitations

### What Edge Functions Can't Do

- **No Node.js APIs**: No `fs`, `path`, etc.
- **Limited runtime**: Smaller runtime than serverless functions
- **Size limits**: 1MB bundle size limit
- **Execution time**: 25 second timeout
- **No file system**: Can't read/write files

### What Edge Functions Can Do

- **Fetch API**: Make HTTP requests
- **Web APIs**: Use standard Web APIs
- **Environment variables**: Access env vars
- **Headers**: Read and set headers
- **Cookies**: Read and set cookies

## Best Practices

### 1. Keep Functions Small

```typescript
// ✅ Good: Small, focused function
export const runtime = 'edge';

export async function GET() {
  return new Response(JSON.stringify({ status: 'ok' }));
}
```

### 2. Use Caching

```typescript
export const runtime = 'edge';

export async function GET() {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### 3. Handle Errors

```typescript
export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // Your logic
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
```

## Configuration

### Edge Config

Create `vercel.json`:

```json
{
  "functions": {
    "app/api/edge/route.ts": {
      "runtime": "edge"
    }
  }
}
```

Or use export in route file:

```typescript
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
```

## Monitoring

### View Edge Function Logs

1. Go to Vercel Dashboard
2. Navigate to your project
3. Go to Functions tab
4. View edge function logs

### Performance Metrics

- **Invocation count**: Number of calls
- **Duration**: Execution time
- **Error rate**: Failed invocations
- **Cold starts**: First invocation time

## Migration from Serverless

### Before (Serverless)

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}
```

### After (Edge)

```typescript
export const runtime = 'edge';

export async function GET(request: Request) {
  return new Response(
    JSON.stringify({ message: 'Hello' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
```

## Resources

- [Vercel Edge Functions Docs](https://vercel.com/docs/functions/edge-functions)
- [Edge Runtime API](https://edge-runtime.vercel.sh/)
- [Web APIs in Edge](https://developer.mozilla.org/en-US/docs/Web/API)

---

**Edge Functions provide low-latency, globally distributed execution. Use them for high-traffic, latency-sensitive operations!**
