import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasProductAccess } from '@/lib/db/access';
import { getProductById } from '@/lib/db/products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DownloadButton } from '@/components/library/download-button';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Product Access | Logbloga',
  description: 'Access your purchased digital product',
};

interface ProductAccessPageProps {
  params: Promise<{ 'product-id': string }>;
}

export default async function ProductAccessPage({ params }: ProductAccessPageProps) {
  const { 'product-id': productId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin?redirect=/account/library/' + productId);
  }

  // Fetch product
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  // Check if user has access to this product via completed orders
  const hasAccess = await hasProductAccess(user.id, productId);

  if (!hasAccess) {
    // Redirect to product page to purchase
    redirect(`/ai-to-usd/packages/${product.slug || product.id}`);
  }

  const images = product.images as string[] | null | undefined;
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
  const productImage = product.package_image || firstImage || '/placeholder-product.png';

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <Link
            href="/account/library"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            ← Back to Library
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{product.title || product.name || 'Product'}</CardTitle>
                    <CardDescription className="mt-2">
                      {product.description || 'Digital product'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              {productImage && (
                <CardContent>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={productImage}
                      alt={product.title || 'Product'}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.category && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                )}

                {product.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Download Section */}
            <Card>
              <CardHeader>
                <CardTitle>Downloads</CardTitle>
                <CardDescription>
                  Access your product files and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <DownloadButton
                    productId={product.id}
                    filename="product.zip"
                    label="Download Product Files"
                  />
                  <p className="text-xs text-muted-foreground">
                    You have lifetime access to this product
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Purchase Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary">Lifetime Access</Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    You own this product and have lifetime access to all content and updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
