/**
 * GET /api/addresses - Get user's addresses
 * POST /api/addresses - Create new address
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getUserAddresses, createAddress } from '@/lib/db/addresses';
import type { CreateAddressData } from '@/lib/db/addresses';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const addresses = await getUserAddresses(user.id);

    return NextResponse.json({
      addresses,
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch addresses';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const addressData: CreateAddressData = body;

    const address = await createAddress(user.id, addressData);

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error('Error creating address:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create address';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

