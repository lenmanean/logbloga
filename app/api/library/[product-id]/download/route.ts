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

    // Get file from Supabase Storage (bucket: 'digital-products')
    const supabase = await createServiceRoleClient();
    const filePath = `${productId}/${filename}`;
    
    const { data, error } = await supabase.storage
      .from('digital-products')
      .download(filePath);

    if (error || !data) {
      console.error('Error downloading file from storage:', error);
      return NextResponse.json(
        { error: 'File not found or could not be downloaded' },
        { status: 404 }
      );
    }

    // Convert blob to buffer for response
    const buffer = Buffer.from(await data.arrayBuffer());

    // Determine content type based on file extension
    const getContentType = (filename: string): string => {
      const ext = filename.split('.').pop()?.toLowerCase();
      const contentTypes: Record<string, string> = {
        pdf: 'application/pdf',
        zip: 'application/zip',
        rar: 'application/x-rar-compressed',
        '7z': 'application/x-7z-compressed',
        txt: 'text/plain',
        json: 'application/json',
      };
      return contentTypes[ext || ''] || 'application/octet-stream';
    };

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': getContentType(filename),
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
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
