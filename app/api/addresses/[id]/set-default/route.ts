/**
 * POST /api/addresses/[id]/set-default
 * Set address as default for billing or shipping
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { setDefaultAddress } from '@/lib/db/addresses';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { type } = body;

    if (!type || (type !== 'billing' && type !== 'shipping')) {
      return NextResponse.json(
        { error: 'Type must be "billing" or "shipping"' },
        { status: 400 }
      );
    }

    const address = await setDefaultAddress(id, user.id, type);

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to set default address';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

