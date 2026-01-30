/**
 * POST /api/packages/[package-id]/grant-access
 * DISABLED: This was a development endpoint to grant immediate access without payment.
 * In production, all package access is granted via Stripe checkout and order completion.
 */

import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ 'package-id': string }>;
}

export async function POST(
  _request: Request,
  { params }: RouteParams
) {
  // Endpoint disabled for production - return 404
  await params; // consume params to avoid unused var
  return NextResponse.json(
    { error: 'Not found' },
    { status: 404 }
  );
}
