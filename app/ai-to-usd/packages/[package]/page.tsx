import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductImageGallery } from '@/components/ui/product-image-gallery';
import { ProductInfoPanel } from '@/components/ui/product-info-panel';
import { WhatsIncluded } from '@/components/ui/whats-included';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getProductBySlug } from '@/lib/db/products';
import { PackageProduct } from '@/lib/products';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface PackagePageProps {
  params: Promise<{
    package: string;
  }>;
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { package: packageSlug } = await params;
  
  // Fetch package from database
  const packageData = await getProductBySlug(packageSlug);

  if (!packageData) {
    notFound();
  }

  // Convert database product to PackageProduct format expected by components
  const packageProduct: PackageProduct = {
    id: packageData.id,
    title: packageData.title || packageData.name || 'Untitled Product',
    description: packageData.description || '',
    category: (packageData.category || 'web-apps') as PackageProduct['category'],
    price: typeof packageData.price === 'number' ? packageData.price : parseFloat(String(packageData.price || 0)),
    originalPrice: packageData.original_price ? (typeof packageData.original_price === 'number' ? packageData.original_price : parseFloat(String(packageData.original_price))) : undefined,
    featured: packageData.featured || false,
    image: packageData.package_image || (packageData.images as any)?.[0] || packageData.image_url || undefined,
    difficulty: (packageData.difficulty as PackageProduct['difficulty']) || undefined,
    duration: packageData.duration || undefined,
    packageImage: packageData.package_image || '',
    images: (packageData.images as string[]) || [packageData.package_image || ''],
    tagline: packageData.tagline || '',
    modules: (packageData.modules as any) || [],
    resources: (packageData.resources as any) || [],
    bonusAssets: (packageData.bonus_assets as any) || [],
    pricingJustification: packageData.pricing_justification || '',
    contentHours: packageData.content_hours || '',
    slug: packageData.slug,
    rating: packageData.rating ? (typeof packageData.rating === 'number' ? packageData.rating : parseFloat(String(packageData.rating))) : undefined,
    reviewCount: packageData.review_count || 0,
  };

  const categoryLabels: Record<string, string> = {
    'web-apps': 'Web Apps',
    'social-media': 'Social Media',
    'agency': 'Agency',
    'freelancing': 'Freelancing',
  };

  const productImages = packageProduct.images || [packageProduct.packageImage];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/ai-to-usd">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Packages
            </Button>
          </Link>
        </div>

        {/* Main Product Section - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 md:mb-16">
          {/* Left Side - Image Gallery */}
          <div className="w-full order-1 lg:order-1">
            <ProductImageGallery 
              images={productImages}
              alt={packageProduct.title}
            />
          </div>

          {/* Right Side - Product Information & Purchase */}
          <div className="w-full order-2 lg:order-2">
            <ProductInfoPanel package={packageProduct} />
          </div>
        </div>

        <Separator className="my-12" />

        {/* Description Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About This Package</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-muted-foreground mb-6">
                {packageProduct.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Self-Paced Learning</p>
                    <p className="text-sm text-muted-foreground">
                      Learn at your own pace with lifetime access
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Production-Ready Resources</p>
                    <p className="text-sm text-muted-foreground">
                      Templates and tools you can use immediately
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Community Support</p>
                    <p className="text-sm text-muted-foreground">
                      Join a community of like-minded professionals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Regular Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Get access to new content and updates
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What's Included Section */}
        <div className="mb-12">
          <WhatsIncluded package={packageProduct} />
        </div>

        {/* Pricing Justification */}
        {packageProduct.pricingJustification && (
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Why This Price?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {packageProduct.pricingJustification}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

            {/* Related Links */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href={`/ai-to-usd/${packageProduct.category}`}>
                <Button variant="outline">
                  View {categoryLabels[packageProduct.category] || 'Products'} Products
                </Button>
              </Link>
          <Link href="/ai-to-usd">
            <Button variant="outline">
              View All Packages
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

