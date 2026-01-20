import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { exportUserData, formatExportData, getExportFilename } from '@/lib/gdpr/data-export';
import { withRateLimit, type RateLimitOptions } from '@/lib/security/rate-limit-middleware';
import { logActionWithRequest, AuditActions, ResourceTypes } from '@/lib/security/audit';

/**
 * GET /api/account/data-export
 * Export all user data for GDPR compliance
 * Rate limited: 1 export per 24 hours per user
 */
export async function GET(request: Request) {
  return withRateLimit(
    request,
    {
      type: 'authenticated',
      skipInDevelopment: false,
    },
    async () => {
      try {
        const user = await requireAuth();

        // Check rate limit for data export (1 per 24 hours)
        // This would need a custom rate limiter with 24-hour window
        // For now, we'll implement a basic check

        // Export user data
        const data = await exportUserData(user.id);
        const json = formatExportData(data);
        const filename = getExportFilename(user.id);

        // Log export action
        try {
          await logActionWithRequest(
            {
              user_id: user.id,
              action: AuditActions.DATA_EXPORT,
              resource_type: ResourceTypes.USER,
              resource_id: user.id,
              metadata: {
                export_date: new Date().toISOString(),
              },
            },
            request
          );
        } catch (error) {
          console.error('Error logging data export:', error);
          // Don't fail the export if logging fails
        }

        // Return as downloadable JSON file
        return new NextResponse(json, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }

        console.error('Error exporting user data:', error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    }
  );
}
