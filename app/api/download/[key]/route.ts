import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrderItemByDownloadKey, logDownload, incrementDownloadCount } from "@/lib/db/orders";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get order item by download key
    const orderItem = await getOrderItemByDownloadKey(key, user.id);

    if (!orderItem) {
      return NextResponse.json(
        { error: "Download not found or expired" },
        { status: 404 }
      );
    }

    // Check if download has expired
    if (new Date(orderItem.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Download link has expired" },
        { status: 410 }
      );
    }

    if (!orderItem.product?.file_path) {
      return NextResponse.json(
        { error: "Product file not available" },
        { status: 404 }
      );
    }

    // Generate signed URL for the file (1 hour expiration)
    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage
        .from("digital-products")
        .createSignedUrl(orderItem.product.file_path, 3600); // 1 hour

    if (signedUrlError || !signedUrlData) {
      console.error("Failed to generate signed URL:", signedUrlError);
      return NextResponse.json(
        { error: "Failed to generate download link" },
        { status: 500 }
      );
    }

    // Log download and increment count
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await Promise.all([
      logDownload(orderItem.id, ipAddress, userAgent),
      incrementDownloadCount(orderItem.id),
    ]);

    // Redirect to signed URL
    return NextResponse.redirect(signedUrlData.signedUrl);
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    );
  }
}

