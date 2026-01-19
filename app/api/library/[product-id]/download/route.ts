/**
 * GET /api/library/[product-id]/download
 * Secure download endpoint for digital products
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { userHasActiveLicense } from '@/lib/db/licenses';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ 'product-id': string }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const user = await requireAuth();
    const { 'product-id': productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get filename from query string
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Verify user has active license for this product
    const hasAccess = await userHasActiveLicense(user.id, productId);

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'You do not have access to this product. Please purchase a license.' },
        { status: 403 }
      );
    }

    // For now, return a placeholder response
    // In production, this would:
    // 1. Get file from Supabase Storage (bucket: 'products')
    // 2. Generate signed URL or stream file
    // 3. Track download history (optional)
    
    // TODO: Implement actual file download from Supabase Storage
    // Example:
    // const supabase = createServiceRoleClient();
    // const { data, error } = await supabase.storage
    //   .from('products')
    //   .download(`${productId}/${filename}`);
    
    // For now, return error indicating feature not implemented
    return NextResponse.json(
      { error: 'Download feature is not yet implemented. Files will be available soon.' },
      { status: 501 }
    );

    // When implemented, return file like this:
    /*
    if (error || !data) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Convert blob to buffer for response
    const buffer = Buffer.from(await data.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
    */
  } catch (error) {
    console.error('Error downloading file:', error);

    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to download file';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
