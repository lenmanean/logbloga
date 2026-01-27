# Next.js SaaS Starter Setup Guide

## Overview

This guide helps you set up a Next.js project specifically configured for building a SaaS application with authentication, database, and subscription features.

**Current Version**: Next.js 15+ with App Router
**Documentation**: [nextjs.org/docs](https://nextjs.org/docs)

## Prerequisites

- Node.js 18+ installed
- Understanding of React and Next.js basics
- Supabase account (for database and auth)
- Stripe account (for payments)

## Step 1: Create Next.js Project

### Initialize Project

```bash
npx create-next-app@latest my-saas-app --typescript --tailwind --app --use-npm
```

**Options Explained**:
- `--typescript`: Adds TypeScript support
- `--tailwind`: Includes Tailwind CSS
- `--app`: Uses App Router (recommended)
- `--use-npm`: Uses npm (or use `--use-pnpm`, `--use-yarn`)

### Navigate to Project

```bash
cd my-saas-app
```

## Step 2: Install SaaS Dependencies

### Core Dependencies

```bash
# Supabase for database and auth
npm install @supabase/supabase-js @supabase/ssr

# Stripe for payments
npm install stripe @stripe/stripe-js @stripe/react-stripe-js

# Form handling
npm install react-hook-form @hookform/resolvers zod

# UI components (optional but recommended)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
```

### Development Dependencies

```bash
npm install -D @types/node @types/react @types/react-dom
```

## Step 3: Project Structure

Create the following directory structure:

```
my-saas-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   └── webhooks/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── dashboard/
│   └── ui/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── utils.ts
└── types/
    └── database.ts
```

## Step 4: Configure Supabase

### Install Supabase CLI (Optional)

```bash
npm install -g supabase
```

### Set Up Supabase Client

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle error
          }
        },
      },
    }
  );
}
```

## Step 5: Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Add `.env.local` to `.gitignore`

## Step 6: Configure Middleware

Create `middleware.ts` in root:

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

## Step 7: Set Up Authentication Pages

### Login Page

Create `app/(auth)/login/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded mb-4"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 border rounded mb-4"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

## Step 8: Create Protected Route

Create `app/(dashboard)/dashboard/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  );
}
```

## Step 9: Test Setup

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/login`
3. Create an account in Supabase Dashboard first, or implement signup
4. Test login flow

## Step 10: Next Steps

1. **Set up database schema**: Create tables in Supabase
2. **Implement signup**: Add registration page
3. **Add Stripe**: Integrate payment processing
4. **Build features**: Implement your SaaS functionality

## Common Issues

### Supabase Connection Errors

**Check**:
- Environment variables are set correctly
- Supabase project is active
- API keys are correct (anon key, not service role for client)

### Authentication Not Working

**Verify**:
- Middleware is configured
- Cookies are being set
- Redirect paths are correct

### TypeScript Errors

**Fix**:
- Install missing type packages
- Check `tsconfig.json` paths
- Restart TypeScript server

## Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Stripe Integration](https://stripe.com/docs)

---

**Your SaaS starter is ready!** Now move on to setting up your database schema and implementing core features.
