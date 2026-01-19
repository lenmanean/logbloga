/**
 * POST /api/licenses/validate
 * Validate a license key
 */

import { NextResponse } from 'next/server';
import { getLicenseByKey } from '@/lib/db/licenses';
import { validateLicenseKeyFormat } from '@/lib/licenses/generator';
import type { LicenseStatus } from '@/lib/types/database';

interface ValidateLicenseRequest {
  licenseKey: string;
  productId?: string;
}

export async function POST(request: Request) {
  try {
    const body: ValidateLicenseRequest = await request.json();
    const { licenseKey, productId } = body;

    if (!licenseKey) {
      return NextResponse.json(
        { error: 'License key is required' },
        { status: 400 }
      );
    }

    // Validate format first
    if (!validateLicenseKeyFormat(licenseKey)) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid license key format',
      });
    }

    // Fetch license from database
    const license = await getLicenseByKey(licenseKey);

    if (!license) {
      return NextResponse.json({
        valid: false,
        error: 'License not found',
      });
    }

    // Check if license is active
    if (license.status !== 'active') {
      return NextResponse.json({
        valid: false,
        license: {
          id: license.id,
          status: license.status as LicenseStatus,
          productId: license.product_id,
          expiresAt: license.expires_at,
          lifetimeAccess: license.lifetime_access,
        },
        error: `License is ${license.status}`,
      });
    }

    // Check expiration if not lifetime access
    if (!license.lifetime_access && license.expires_at) {
      const expiresAt = new Date(license.expires_at);
      const now = new Date();

      if (expiresAt <= now) {
        return NextResponse.json({
          valid: false,
          license: {
            id: license.id,
            status: license.status as LicenseStatus,
            productId: license.product_id,
            expiresAt: license.expires_at,
            lifetimeAccess: license.lifetime_access,
          },
          error: 'License has expired',
        });
      }
    }

    // Optionally verify product match
    if (productId && license.product_id !== productId) {
      return NextResponse.json({
        valid: false,
        error: 'License is not valid for this product',
      });
    }

    // License is valid
    return NextResponse.json({
      valid: true,
      license: {
        id: license.id,
        status: license.status as LicenseStatus,
        productId: license.product_id,
        expiresAt: license.expires_at,
        lifetimeAccess: license.lifetime_access,
      },
    });
  } catch (error) {
    console.error('Error validating license:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to validate license';

    return NextResponse.json(
      { valid: false, error: errorMessage },
      { status: 500 }
    );
  }
}
