# Blog Cache Invalidation

## Overview
When blog posts are created, updated, or deleted in the database, you need to invalidate both Redis cache and Next.js ISR cache.

## Redis Cache Invalidation

Use the functions in `lib/db/blog/cache.ts`:

```typescript
import { invalidateBlogPostCache, invalidateAllBlogCache } from '@/lib/db/blog/cache';

// Invalidate a specific post
await invalidateBlogPostCache('my-blog-post-slug');

// Invalidate all blog caches
await invalidateAllBlogCache();
```

## Next.js ISR Revalidation

For Next.js ISR (Incremental Static Regeneration) revalidation, call the `/api/revalidate` endpoint:

```bash
# Revalidate specific blog post
curl -X POST https://your-domain.com/api/revalidate \
  -H "x-revalidate-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"path": "/blog/my-post-slug"}'

# Revalidate blog listing
curl -X POST https://your-domain.com/api/revalidate \
  -H "x-revalidate-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"path": "/blog"}'

# Revalidate by cache tag
curl -X POST https://your-domain.com/api/revalidate \
  -H "x-revalidate-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"tag": "blog"}'
```

## Complete Cache Invalidation Example

When a blog post is published or updated:

1. Invalidate Redis cache
2. Revalidate Next.js ISR paths

```typescript
import { invalidateBlogPostCache } from '@/lib/db/blog/cache';

// After updating a blog post in database
await invalidateBlogPostCache(post.slug);

// Then call revalidation API (or use webhook/trigger)
// This should be done via database trigger, webhook, or admin action
```

## Database Triggers (Optional)

You can set up a database trigger to automatically invalidate cache when posts are updated:

```sql
-- This would need to call an external API/webhook
-- Or use Supabase Edge Functions
```

For now, cache invalidation should be done manually when posts are updated via the database.
