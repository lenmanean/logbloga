/**
 * Blog cache invalidation utilities
 * Call these functions when blog posts are created, updated, or deleted
 * 
 * Note: For Next.js path/tag revalidation, use the /api/revalidate endpoint
 * or call revalidatePath/revalidateTag from within a route handler or server action
 */

import { deleteCached, deleteByTag } from '@/lib/cache/redis-cache';

/**
 * Invalidate cache for a specific blog post by slug
 * This only invalidates app cache - Next.js ISR revalidation should be done separately
 */
export async function invalidateBlogPostCache(slug: string): Promise<void> {
  try {
    // Delete specific post cache
    await deleteCached(`blog:post:slug:${slug}`, 'blog');
    
    // Delete all blog posts listing caches (using tags)
    await deleteByTag('blog-posts');
    await deleteByTag('blog');
  } catch (error) {
    console.error('Error invalidating blog post cache:', error);
  }
}

/**
 * Invalidate all blog post caches
 * Use when multiple posts are updated or when you want to clear all blog caches
 * This only invalidates app cache - Next.js ISR revalidation should be done separately
 */
export async function invalidateAllBlogCache(): Promise<void> {
  try {
    // Delete all blog-related caches using tags
    await deleteByTag('blog');
    await deleteByTag('blog-posts');
  } catch (error) {
    console.error('Error invalidating all blog cache:', error);
  }
}

/**
 * Invalidate cache when a blog post is published/updated
 * This should be called after a post is created or updated in the database
 * 
 * For Next.js ISR revalidation, call /api/revalidate with:
 * - path: '/blog' and '/blog/${slug}'
 * - tag: 'blog' and 'blog-posts'
 */
export async function invalidateBlogPostOnUpdate(slug: string, published: boolean): Promise<void> {
  await invalidateBlogPostCache(slug);
  
  // If post was just published, also invalidate listing pages
  if (published) {
    await invalidateAllBlogCache();
  }
}
