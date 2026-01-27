# Supabase Setup Guide

## Overview

This guide walks you through setting up Supabase for your SaaS application. Supabase provides database, authentication, storage, and real-time features.

**Current Documentation**: [supabase.com/docs](https://supabase.com/docs)

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email

## Step 2: Create New Project

1. Click "New Project"
2. Fill in details:
   - **Name**: Your project name
   - **Database Password**: Strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient to start
3. Click "Create new project"
4. Wait 2-3 minutes for setup

## Step 3: Get API Keys

1. Go to Project Settings → API
2. Copy these keys:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Starts with `eyJ...`
   - **service_role key**: Starts with `eyJ...` (keep secret!)

**Important**: 
- `anon` key: Safe for frontend (with RLS enabled)
- `service_role` key: Server-side only, bypasses RLS

## Step 4: Install Supabase Client

In your Next.js project:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Step 5: Set Up Client Files

### Browser Client

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

### Server Client

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

## Step 6: Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 7: Create Your First Table

### Using SQL Editor

1. Go to SQL Editor in Supabase Dashboard
2. Click "New query"
3. Run this example:

```sql
-- Create users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policy: Users can view own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Create policy: Users can update own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);
```

### Using Table Editor

1. Go to Table Editor
2. Click "New table"
3. Name: `profiles`
4. Add columns:
   - `id` (uuid, primary key, references auth.users)
   - `email` (text)
   - `full_name` (text)
   - `created_at` (timestamptz, default now())
5. Enable RLS
6. Create policies

## Step 8: Set Up Authentication

### Enable Auth Providers

1. Go to Authentication → Providers
2. Enable providers:
   - **Email**: Enabled by default
   - **GitHub**: Click to enable (optional)
   - **Google**: Click to enable (optional)

### Configure Email Auth

1. Go to Authentication → Settings
2. Configure:
   - **Site URL**: Your app URL
   - **Redirect URLs**: Add your redirect URLs
   - **Email templates**: Customize if needed

## Step 9: Test Connection

Create test file `app/test-supabase/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server';

export default async function TestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('*');

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div>Connected! Data: {JSON.stringify(data)}</div>;
}
```

Visit `/test-supabase` to verify connection.

## Step 10: Row Level Security (RLS)

### Why RLS is Critical

RLS ensures users can only access their own data. Always enable RLS on tables.

### Example Policies

```sql
-- Allow users to read own data
create policy "Users can read own data"
  on your_table
  for select
  using (auth.uid() = user_id);

-- Allow users to insert own data
create policy "Users can insert own data"
  on your_table
  for insert
  with check (auth.uid() = user_id);

-- Allow users to update own data
create policy "Users can update own data"
  on your_table
  for update
  using (auth.uid() = user_id);
```

## Step 11: Storage Setup (Optional)

### Create Storage Bucket

1. Go to Storage
2. Click "New bucket"
3. Name: `avatars` (or your bucket name)
4. Public: Yes/No (depending on use case)
5. Click "Create bucket"

### Set Up Policies

```sql
-- Allow authenticated users to upload
create policy "Users can upload avatars"
  on storage.objects
  for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access
create policy "Public can view avatars"
  on storage.objects
  for select
  using (bucket_id = 'avatars');
```

## Step 12: Database Migrations

### Using Supabase CLI

1. Install CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize:
   ```bash
   supabase init
   ```

3. Link project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Create migration:
   ```bash
   supabase migration new create_profiles_table
   ```

5. Write SQL in migration file
6. Apply:
   ```bash
   supabase db push
   ```

## Common Issues

### Connection Errors

**Check**:
- Environment variables are correct
- Project is not paused (free tier pauses after inactivity)
- URL and keys match dashboard

### RLS Blocking Queries

**Solution**: Ensure policies are created and correct. Test with service role key to verify data exists.

### Authentication Not Working

**Verify**:
- Redirect URLs are configured
- Site URL is correct
- Cookies are enabled

## Best Practices

1. **Always enable RLS**: Never expose data without RLS
2. **Use anon key on frontend**: Service role only on server
3. **Test policies**: Verify RLS works as expected
4. **Use migrations**: Version control your schema
5. **Monitor usage**: Watch API usage in dashboard

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

---

**Your Supabase setup is complete!** Now you can build your database schema and implement authentication.
