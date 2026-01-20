/**
 * GET /api/blog
 * Public read-only API for blog posts
 * Supports pagination, filtering, and search
 */

import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/db/blog';
import type { BlogQueryOptions } from '@/lib/db/blog/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined;
    const published = searchParams.get('published') !== null 
      ? searchParams.get('published') === 'true' 
      : true; // Default to published posts
    const search = searchParams.get('search') || undefined;
    const author = searchParams.get('author') || undefined;
    const tags = searchParams.getAll('tags[]').length > 0 
      ? searchParams.getAll('tags[]') 
      : undefined;
    const orderBy = searchParams.get('orderBy') || undefined;
    const orderDirection = (searchParams.get('orderDirection') as 'asc' | 'desc') || undefined;

    // Validate parameters
    if (limit !== undefined && (limit < 1 || limit > 100)) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (offset !== undefined && offset < 0) {
      return NextResponse.json(
        { error: 'Offset must be non-negative' },
        { status: 400 }
      );
    }

    // Build query options
    const options: BlogQueryOptions = {
      published,
      limit,
      offset,
      search,
      author,
      tags,
      orderBy,
      orderDirection,
    };

    // Fetch posts
    const posts = await getAllBlogPosts(options);

    // Get total count for pagination
    const totalOptions: BlogQueryOptions = {
      ...options,
      limit: undefined,
      offset: undefined,
    };
    const allPosts = await getAllBlogPosts(totalOptions);
    const total = allPosts.length;
    const hasMore = limit && offset !== undefined 
      ? offset + posts.length < total 
      : false;

    // Return response with cache headers
    return NextResponse.json(
      {
        posts,
        total,
        hasMore,
        limit: limit || posts.length,
        offset: offset || 0,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('Error in blog API route:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blog posts';
    
    return NextResponse.json(
      { error: errorMessage, posts: [], total: 0, hasMore: false },
      { status: 500 }
    );
  }
}
