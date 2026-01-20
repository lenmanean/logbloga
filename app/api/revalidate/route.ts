import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * POST /api/revalidate
 * On-demand revalidation endpoint for ISR
 * Requires secret token for security
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const secret = request.headers.get('x-revalidate-secret');
    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { path, tag } = body;

    if (path) {
      // Revalidate specific path
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now(),
      });
    }

    if (tag) {
      // Revalidate by cache tag
      revalidateTag(tag);
      return NextResponse.json({
        revalidated: true,
        tag,
        now: Date.now(),
      });
    }

    return NextResponse.json(
      { error: 'Path or tag required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    );
  }
}
