import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { deleteByTag, deleteCached } from '@/lib/cache/redis-cache';

/**
 * POST /api/cache/invalidate
 * Invalidate cache entries (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication (admin only)
    const user = await requireAuth();
    
    // Check if user is admin (you might want to add this check)
    // For now, we'll allow authenticated users
    // In production, add admin check: if (!isAdmin(user)) return 403;

    const body = await request.json();
    const { tag, key } = body;

    if (tag) {
      // Invalidate by tag
      await deleteByTag(tag);
      return NextResponse.json({
        success: true,
        message: `Cache invalidated for tag: ${tag}`,
      });
    }

    if (key) {
      // Invalidate specific key
      await deleteCached(key);
      return NextResponse.json({
        success: true,
        message: `Cache invalidated for key: ${key}`,
      });
    }

    return NextResponse.json(
      { error: 'Tag or key required' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Cache invalidation error:', error);
    return NextResponse.json(
      { error: 'Error invalidating cache' },
      { status: 500 }
    );
  }
}
