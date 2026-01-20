/**
 * Blog database operations
 * Provides type-safe functions for querying blog posts from Supabase
 */

import { createClient } from '@/lib/supabase/server';
import type { BlogPost } from '@/lib/types/database';
import type { BlogQueryOptions } from './blog/types';

/**
 * Get all blog posts
 * By default, only returns published posts (RLS handles this for public access)
 */
export async function getAllBlogPosts(options?: BlogQueryOptions): Promise<BlogPost[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('blog_posts')
    .select('*');

  // Filter by published status (default: true for public, can be false for admin)
  if (options?.published !== undefined) {
    query = query.eq('published', options.published);
  } else {
    // Default to published posts for public access
    query = query.eq('published', true);
  }

  // Filter by tags (if any tag matches)
  // Note: Supabase JS client doesn't have direct array overlap support
  // We'll filter after fetching for tag matching
  // For now, fetch all and filter client-side if tags are provided

  // Filter by author
  if (options?.author) {
    query = query.eq('author', options.author);
  }

  // Search in title, excerpt, and content
  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%,content.ilike.%${options.search}%`);
  }

  // Ordering
  if (options?.orderBy) {
    query = query.order(options.orderBy, { 
      ascending: options.orderDirection !== 'desc' 
    });
  } else {
    // Default: order by published_at (most recent first), fallback to created_at
    query = query.order('published_at', { ascending: false, nullsFirst: false });
  }

  // Pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset !== undefined) {
    const limit = options.limit || 10;
    query = query.range(options.offset, options.offset + limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error(`Failed to fetch blog posts: ${error.message}`);
  }

  let posts = data || [];

  // Filter by tags client-side (check if any tag in options.tags exists in post.tags)
  if (options?.tags && options.tags.length > 0 && posts.length > 0) {
    posts = posts.filter(post => {
      if (!post.tags || post.tags.length === 0) return false;
      // Check if any of the provided tags exists in the post's tags
      return options.tags!.some(tag => post.tags!.includes(tag));
    });
  }

  return posts;
}

/**
 * Get all blog posts with caching
 * Uses Redis cache with 15-minute TTL
 */
export async function getAllBlogPostsCached(options?: BlogQueryOptions): Promise<BlogPost[]> {
  const { getCachedOrFetch } = await import('@/lib/cache/redis-cache');
  
  // Generate cache key from options
  const cacheKey = `blog:posts:${JSON.stringify(options || {})}`;
  
  return getCachedOrFetch(
    cacheKey,
    () => getAllBlogPosts(options),
    {
      ttl: 900, // 15 minutes
      tags: ['blog', 'blog-posts'],
    },
    'blog'
  );
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching blog post:', error);
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }

  return data;
}

/**
 * Get a single blog post by slug with caching
 * Uses Redis cache with 15-minute TTL
 */
export async function getBlogPostBySlugCached(slug: string): Promise<BlogPost | null> {
  const { getCachedOrFetch } = await import('@/lib/cache/redis-cache');
  
  return getCachedOrFetch(
    `blog:post:slug:${slug}`,
    () => getBlogPostBySlug(slug),
    {
      ttl: 900, // 15 minutes
      tags: ['blog', 'blog-posts', `blog-post:${slug}`],
    },
    'blog'
  );
}

/**
 * Get a single blog post by ID
 * Can be used by admins to fetch unpublished posts
 */
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching blog post:', error);
    throw new Error(`Failed to fetch blog post: ${error.message}`);
  }

  return data;
}

/**
 * Search blog posts
 */
export async function searchBlogPosts(searchTerm: string, limit = 10): Promise<BlogPost[]> {
  return getAllBlogPosts({ search: searchTerm, limit, published: true });
}

/**
 * Get blog posts by tag
 */
export async function getBlogPostsByTag(tag: string, limit?: number): Promise<BlogPost[]> {
  return getAllBlogPosts({ tags: [tag], limit, published: true });
}

/**
 * Get recent blog posts
 */
export async function getRecentBlogPosts(limit: number = 5): Promise<BlogPost[]> {
  return getAllBlogPosts({ 
    limit, 
    published: true,
    orderBy: 'published_at',
    orderDirection: 'desc'
  });
}
