/**
 * PUT /api/addresses/[id] - Update address
 * DELETE /api/addresses/[id] - Delete address
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { updateAddress, deleteAddress } from '@/lib/db/addresses';
import type { CreateAddressData } from '@/lib/db/addresses';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const updates: Partial<CreateAddressData> = body;

    const address = await updateAddress(id, user.id, updates);

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update address';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    await deleteAddress(id, user.id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete address';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

