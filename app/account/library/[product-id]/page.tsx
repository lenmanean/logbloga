import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProductLicenses, userHasActiveLicense } from '@/lib/db/licenses';
import { getProductById } from '@/lib/db/products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Download, Lock, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { DownloadButton } from '@/components/library/download-button';

export const metadata = {
  title: 'Product Access | LogBloga',
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

  // Check if user has active license for this product
  const hasAccess = await userHasActiveLicense(user.id, productId);

  if (!hasAccess) {
    // Redirect to product page to purchase
    redirect(`/ai-to-usd/packages/${product.slug || product.id}`);
  }

  // Fetch user's licenses for this product
  const licenses = await getUserProductLicenses(user.id, productId);
  const activeLicense = licenses.find(l => l.status === 'active') || licenses[0];

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
                    <CardTitle className="text-2xl">{product.title || 'Product'}</CardTitle>
                    <CardDescription className="mt-2">
                      {product.description || 'Digital product'}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    Active License
                  </Badge>
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

                {product.difficulty && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                    <Badge variant="outline">{product.difficulty}</Badge>
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
                    Your license provides lifetime access to this product
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - License Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>License Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeLicense && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">License Key</p>
                      <p className="text-sm font-mono break-all">{activeLicense.license_key}</p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        {activeLicense.status}
                      </Badge>
                    </div>

                    {activeLicense.access_granted_at && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Access Granted</p>
                          <p className="text-sm">
                            {format(new Date(activeLicense.access_granted_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </>
                    )}

                    {activeLicense.lifetime_access && (
                      <>
                        <Separator />
                        <div>
                          <Badge variant="secondary">Lifetime Access</Badge>
                        </div>
                      </>
                    )}
                  </>
                )}

                <Separator />

                <Link href="/account/licenses">
                  <Button variant="outline" className="w-full">
                    View All Licenses
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
