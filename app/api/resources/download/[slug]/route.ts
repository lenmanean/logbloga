/**
 * GET /api/resources/download/[slug]
 * Authenticated download endpoint for tools and templates
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { getToolBySlug } from '@/lib/resources/tools';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Require authentication
    const user = await requireAuth();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Tool slug is required' },
        { status: 400 }
      );
    }

    // Get tool by slug
    const tool = getToolBySlug(slug);

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }

    // Verify authentication requirement
    if (tool.requiresAuth && !user) {
      return NextResponse.json(
        { error: 'Authentication required to download this resource' },
        { status: 401 }
      );
    }

    // Get file from Supabase Storage
    const supabase = await createServiceRoleClient();
    const filePath = tool.filePath;
    
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

    // Determine content type based on file type
    const getContentType = (fileType: string): string => {
      const contentTypes: Record<string, string> = {
        'application/json': 'application/json',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip': 'application/zip',
        'application/pdf': 'application/pdf',
        'text/plain': 'text/plain',
      };
      return contentTypes[fileType] || 'application/octet-stream';
    };

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': getContentType(tool.fileType),
        'Content-Disposition': `attachment; filename="${tool.fileName}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading resource:', error);

    if (error instanceof Error && error.message.includes('redirect')) {
      throw error; // Re-throw redirect errors
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to download resource';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
