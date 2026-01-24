import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ProductImageGallery } from '@/components/ui/product-image-gallery';
import { ProductInfoPanel } from '@/components/ui/product-info-panel';
import { WhatsIncluded } from '@/components/ui/whats-included';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getProductBySlug, getAllProducts } from '@/lib/db/products';
import { parsePackageLevels } from '@/lib/db/package-levels';
import { PackageProduct } from '@/lib/products';
import { ArrowLeft, CheckCircle, Layers, Settings, Lightbulb } from 'lucide-react';

// Lazy load recommendation components (below fold, non-critical)
const UpsellBanner = dynamic(() => import('@/components/recommendations/upsell-banner').then(mod => ({ default: mod.UpsellBanner })), {
  loading: () => <div className="h-32 animate-pulse bg-muted rounded-lg" />,
});

const CrossSellGrid = dynamic(() => import('@/components/recommendations/cross-sell-grid').then(mod => ({ default: mod.CrossSellGrid })), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
});

const BundleOffer = dynamic(() => import('@/components/recommendations/bundle-offer').then(mod => ({ default: mod.BundleOffer })), {
  loading: () => <div className="h-48 animate-pulse bg-muted rounded-lg" />,
});

// Enable ISR - revalidate every hour
export const revalidate = 3600;

interface PackagePageProps {
  params: Promise<{
    package: string;
  }>;
}

/**
 * Generate static params for all active products at build time
 * This enables static generation with ISR
 */
export async function generateStaticParams() {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Supabase environment variables not available during build - static params will be generated on-demand');
      return [];
    }

    // Use service role client for build-time static generation
    // Regular client requires cookies which aren't available during build
    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceRoleClient();
    
    const { data: products, error } = await supabase
      .from('products')
      .select('slug')
      .eq('active', true);
    
    if (error || !products) {
      console.error('Error generating static params:', error);
      return [];
    }
    
    return products.map((product) => ({
      package: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array on error - pages will be generated on demand
    return [];
  }
}

/**
 * Generate metadata for SEO optimization
 */
export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { package: packageSlug } = await params;
  const packageData = await getProductBySlug(packageSlug);

  if (!packageData) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = packageData.title || packageData.name || 'Product';
  const description = packageData.description || packageData.tagline || `Learn more about ${title}`;

  return {
    title: `${title} | LogBloga`,
    description,
    openGraph: {
      title,
      description: packageData.description || packageData.tagline || undefined,
      images: packageData.package_image ? [packageData.package_image] : [],
      type: 'website' as const,
    },
  };
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { package: packageSlug } = await params;
  
  // Fetch package from database
  const packageData = await getProductBySlug(packageSlug);

  if (!packageData) {
    notFound();
  }

  // Parse levels data if available
  const levels = parsePackageLevels(packageData);

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
    duration: packageData.duration || undefined,
    packageImage: packageData.package_image || '',
    images: (packageData.images as string[]) || [packageData.package_image || ''],
    tagline: packageData.tagline || '',
    levels: levels ?? undefined,
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
            <ProductInfoPanel 
              package={packageProduct}
              packageValue={packageData.package_value ? (typeof packageData.package_value === 'number' ? packageData.package_value : parseFloat(String(packageData.package_value))) : undefined}
            />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
                  <Layers className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Level-Based Progression</p>
                    <p className="text-sm text-muted-foreground">
                      Progress through Levels 1, 2, and 3 as your skills and revenue grow; your package includes all levels, so you can revisit them as your business scales
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Platform Integration Guides</p>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step setup instructions for all recommended platforms
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Creative Decision Frameworks</p>
                    <p className="text-sm text-muted-foreground">
                      Guided exercises to help you make creative decisions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Production-Ready Templates</p>
                    <p className="text-sm text-muted-foreground">
                      Templates, checklists, and tools you can use immediately
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

        {/* Upsell Banner */}
        <div className="mb-12">
          <UpsellBanner productId={packageData.id} />
        </div>

        {/* Cross-sell Recommendations */}
        <div className="mb-12">
          <CrossSellGrid
            productId={packageData.id}
            title="You May Also Like"
            limit={4}
            excludeProductIds={[packageData.id]}
          />
        </div>

        {/* Bundle Offer */}
        <div className="mb-12">
          <BundleOffer
            productId={packageData.id}
            title="Complete Your Collection"
            limit={3}
          />
        </div>


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

