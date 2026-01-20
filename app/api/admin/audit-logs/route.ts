import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { isAdmin } from '@/lib/admin/permissions';
import { getAuditLogs } from '@/lib/security/audit';
import { validateSearchParams, searchSchema } from '@/lib/security/validation';

/**
 * GET /api/admin/audit-logs
 * Get audit logs (admin only)
 */
export async function GET(request: Request) {
  try {
    const user = await requireAuth();

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Validate and parse search params
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const filters = validateSearchParams(searchParams, searchSchema);

    // Fetch audit logs
    const logs = await getAuditLogs(filters);

    return NextResponse.json({ logs });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
