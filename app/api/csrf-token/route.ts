import { NextResponse } from 'next/server';
import { getCsrfTokenForClient } from '@/lib/security/csrf';

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

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
