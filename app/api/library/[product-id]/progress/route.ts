/**
 * GET /api/library/[product-id]/progress
 * POST /api/library/[product-id]/progress
 * Progress tracking for package level components
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { hasProductAccess } from '@/lib/db/access';
import { getProgress, upsertProgress } from '@/lib/db/content-progress';
import { isValidLevelComponent, LEVEL_COMPONENTS } from '@/lib/utils/content';

interface RouteParams {
  params: Promise<{ 'product-id': string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { 'product-id': productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const hasAccess = await hasProductAccess(user.id, productId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'You do not have access to this product. Please purchase it first.' },
        { status: 403 }
      );
    }

    const progress = await getProgress(user.id, productId);

    return NextResponse.json({ progress }, { status: 200 });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      throw err;
    }
    console.error('Error fetching progress:', err);
    const msg = err instanceof Error ? err.message : 'Failed to fetch progress';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { 'product-id': productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const hasAccess = await hasProductAccess(user.id, productId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'You do not have access to this product. Please purchase it first.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { level, component } = body;

    if (typeof level !== 'number' || ![1, 2, 3].includes(level)) {
      return NextResponse.json(
        { error: 'Invalid level. Must be 1, 2, or 3.' },
        { status: 400 }
      );
    }

    if (!component || typeof component !== 'string') {
      return NextResponse.json(
        { error: 'Component is required and must be a string.' },
        { status: 400 }
      );
    }

    if (!isValidLevelComponent(component)) {
      return NextResponse.json(
        {
          error: `Invalid component. Must be one of: ${LEVEL_COMPONENTS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    await upsertProgress(user.id, productId, level as 1 | 2 | 3, component);

    const updatedProgress = await getProgress(user.id, productId);

    return NextResponse.json({ progress: updatedProgress }, { status: 200 });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unauthorized')) {
      throw err;
    }
    console.error('Error recording progress:', err);
    const msg = err instanceof Error ? err.message : 'Failed to record progress';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
