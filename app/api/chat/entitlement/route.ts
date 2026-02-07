import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { userHasAnyPackageAccess } from '@/lib/db/access';

/**
 * GET /api/chat/entitlement
 * Returns whether the current user can use the chat assistant (signed in + has at least one package).
 */
export async function GET() {
  try {
    const user = await requireAuth();
    const canUse = await userHasAnyPackageAccess(user.id);
    return NextResponse.json({ canUse });
  } catch (err) {
    if (err instanceof Error && (err as { status?: number }).status === 401) {
      return NextResponse.json(
        { error: 'Sign in to use the assistant.', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    throw err;
  }
}
