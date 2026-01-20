import { NextResponse } from 'next/server';
import { getCsrfTokenForClient } from '@/lib/security/csrf';
import { cachedResponse, cachePresets } from '@/lib/api/cache-headers';

/**
 * GET /api/csrf-token
 * Get CSRF token for client-side use
 */
export async function GET() {
  try {
    const token = await getCsrfTokenForClient();

    if (!token) {
      return NextResponse.json(
        { error: 'Failed to generate CSRF token' },
        { status: 500 }
      );
    }

    // CSRF tokens should not be cached
    return cachedResponse({ token }, cachePresets.noCache());
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
