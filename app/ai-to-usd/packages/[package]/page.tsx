import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ProductImageGallery } from '@/components/ui/product-image-gallery';
import { ProductInfoPanel } from '@/components/ui/product-info-panel';
import { ProductReviewsSection } from '@/components/ui/product-reviews-section';
import { PackagePreviewSection } from '@/components/ui/package-preview-section';
import { WhatsIncluded } from '@/components/ui/whats-included';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getProductBySlug } from '@/lib/db/products';
import { hasProductAccess } from '@/lib/db/access';
import { parsePackageLevels } from '@/lib/db/package-levels';
import { createClient } from '@/lib/supabase/server';
import { PackageProduct } from '@/lib/products';
import { ArrowLeft, CheckCircle, Layers, Settings, Lightbulb, ArrowRight } from 'lucide-react';

// Revalidate every 60s so price/caption updates propagate quickly (avoids stale $0.51 or old placeholder text)
export const revalidate = 60;

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
      .eq('active', true)
      .in('product_type', ['package', 'bundle']);
    
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
    title: `${title} | Logbloga`,
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
    images: ((packageData.images as string[])?.filter(Boolean)?.length ?? 0) > 0
      ? (packageData.images as string[]).filter(Boolean)
      : (packageData.package_image ? [packageData.package_image] : []),
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

  const isBundle = packageData.product_type === 'bundle';
  const PACKAGE_SLUG_ALLOWLIST = ['web-apps', 'social-media', 'agency', 'freelancing'];
  const rawSlugs = (packageData.included_products as string[] | null) || [];
  const includedSlugs = rawSlugs.filter((s) => typeof s === 'string' && PACKAGE_SLUG_ALLOWLIST.includes(s));

  const bundlePackageDescriptions: Record<string, string> = {
    'web-apps': 'Build SaaS and web applications',
    'social-media': 'Monetize social media and automation',
    'agency': 'Scale an AI-powered agency',
    'freelancing': 'Turn AI into freelance income',
  };

  let includedPackages: { slug: string; title: string; description: string }[] = [];
  if (isBundle && includedSlugs.length > 0) {
    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceRoleClient();
    const { data } = await supabase
      .from('products')
      .select('slug, title')
      .in('slug', includedSlugs)
      .eq('active', true);
    includedPackages = (data || []).map((p) => ({
      slug: p.slug,
      title: p.title || p.slug,
      description: bundlePackageDescriptions[p.slug] || '',
    }));
  }

  const productImages =
    (packageProduct.images?.length ?? 0) > 0
      ? packageProduct.images!.filter((src) => src?.trim())
      : packageProduct.packageImage
        ? [packageProduct.packageImage]
        : [];

  let hasAccess = false;
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (user?.id) {
    hasAccess = await hasProductAccess(user.id, packageData.id);
  }

  // Package pages use only this single master-bundle upsell. Do not use UpsellBanner, CrossSellGrid, or BundleOffer here.
  const masterBundle = !isBundle ? await getProductBySlug('master-bundle') : null;
  const masterBundlePrice = masterBundle && (typeof masterBundle.price === 'number' ? masterBundle.price : parseFloat(String(masterBundle.price || 0)));
  const masterBundleImage = masterBundle?.package_image || (masterBundle?.images as string[])?.[0] || masterBundle?.image_url || '/package-master.png';

  // Initial reviews for SSR (approved only, first page)
  const supabaseReviews = await createClient();
  const { data: initialReviewsRows } = await supabaseReviews
    .from('reviews')
    .select('id, rating, content, title, reviewer_display_name, created_at')
    .eq('product_id', packageData.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(10);
  const initialReviews = (initialReviewsRows || []).map((r) => ({
    id: r.id,
    rating: r.rating,
    content: r.content,
    title: r.title,
    reviewer_display_name: r.reviewer_display_name,
    created_at: r.created_at,
  }));

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
          <div id="purchase" className="w-full order-2 lg:order-2">
            <ProductInfoPanel 
              package={packageProduct}
              hasAccess={hasAccess}
            />
          </div>
        </div>

        <Separator className="my-12" />

        {/* Description Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{isBundle ? 'About the Master Bundle' : 'About This Package'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-muted-foreground mb-6">
                {packageProduct.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {isBundle ? (
                  <>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">All Four Packages</p>
                        <p className="text-sm text-muted-foreground">
                          Full access to Web Apps, Social Media, Agency, and Freelancing
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Layers className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">145+ Hours of Content</p>
                        <p className="text-sm text-muted-foreground">
                          Combined structured learning across every monetization path
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">Best Value</p>
                        <p className="text-sm text-muted-foreground">
                          Save 17% versus purchasing each package separately
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                          Progress through Levels 1, 2, and 3 as your skills and revenue grow
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
                        <p className="font-semibold mb-1">Customer Support</p>
                        <p className="text-sm text-muted-foreground">
                          Get support for your package implementation and product questions
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Package content preview (interactive markdown) */}
        <PackagePreviewSection productId={packageData.id} />

        {/* Reviews Section */}
        <div className="mb-12">
          <ProductReviewsSection
            productId={packageData.id}
            initialReviews={initialReviews}
          />
        </div>

        {/* What's Included Section */}
        {isBundle ? (
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">What&apos;s Included</CardTitle>
                <p className="text-muted-foreground">Full access to all four packages in your library</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {includedPackages.map((pkg) => (
                    <Link
                      key={pkg.slug}
                      href={`/ai-to-usd/packages/${pkg.slug}`}
                      className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{pkg.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.description}
                        </p>
                      </div>
                      <ArrowLeft className="h-4 w-4 rotate-180 ml-auto text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mb-12">
            <WhatsIncluded package={packageProduct} />
          </div>
        )}

        {!isBundle && masterBundle && (
          <div className="mb-12">
            <Link href="/ai-to-usd/packages/master-bundle" className="block">
              <Card className="overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-4 md:gap-6 flex-1">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden border border-border bg-muted">
                        <Image
                          src={masterBundleImage}
                          alt={masterBundle.title || 'Master Bundle'}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 96px, 128px"
                        />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-xl md:text-2xl mb-2">Get the Master Bundle</CardTitle>
                        <p className="text-muted-foreground max-w-xl">
                          Get full access to all four packages—Web Apps, Social Media, Agency, and Freelancing. 145+ hours of content, production-ready templates, and implementation guides.
                        </p>
                        {masterBundlePrice != null && !Number.isNaN(masterBundlePrice) && (
                          <p className="mt-2 text-lg font-semibold">${masterBundlePrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-lg font-semibold">View Master Bundle</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        {/* Related Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          {!isBundle && (
            <Link href={`/ai-to-usd/${packageProduct.category}`}>
              <Button variant="outline">
                View {categoryLabels[packageProduct.category] || 'Products'} Products
              </Button>
            </Link>
          )}
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

