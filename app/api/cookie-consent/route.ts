import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { saveCookieConsent, type CookieConsentPreferences } from '@/lib/security/cookie-consent';
import { validateRequestBody } from '@/lib/security/validation';
import { z } from 'zod';

const cookieConsentSchema = z.object({
  essential: z.boolean().default(true),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false),
});

/**
 * GET /api/cookie-consent
 * Get cookie consent preferences for authenticated user
 */
export async function GET() {
  try {
    const user = await requireAuth();
    const { getCookieConsent } = await import('@/lib/security/cookie-consent');
    const preferences = await getCookieConsent(user.id);

    return NextResponse.json({ preferences });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Error fetching cookie consent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cookie-consent
 * Save cookie consent preferences
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const preferences = await validateRequestBody(request, cookieConsentSchema);
    
    await saveCookieConsent(user.id, preferences as CookieConsentPreferences);

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes('Validation error')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Error saving cookie consent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
