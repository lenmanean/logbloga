import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductImageGallery } from '@/components/ui/product-image-gallery';
import { ProductInfoPanel } from '@/components/ui/product-info-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getProductBySlug } from '@/lib/db/products';
import { convertDbProductToFrontendProduct } from '@/lib/db/products';
import { PackageProduct } from '@/lib/products';
import { ArrowLeft, CheckCircle, FileText, Download } from 'lucide-react';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all active individual products at build time
 */
export async function generateStaticParams() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Supabase environment variables not available during build - static params will be generated on-demand');
      return [];
    }

    const { createServiceRoleClient } = await import('@/lib/supabase/server');
    const supabase = await createServiceRoleClient();
    
    const { data: products, error } = await supabase
      .from('products')
      .select('slug')
      .eq('active', true)
      .neq('product_type', 'package'); // Only individual products
    
    if (error || !products) {
      console.error('Error generating static params:', error);
      return [];
    }
    
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

/**
 * Generate metadata for SEO optimization
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productData = await getProductBySlug(slug);

  if (!productData) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = productData.title || productData.name || 'Product';
  const description = productData.description || `Learn more about ${title}`;

  return {
    title: `${title} | LogBloga`,
    description,
    openGraph: {
      title,
      description: productData.description || undefined,
      images: productData.package_image ? [productData.package_image] : [],
      type: 'website' as const,
    },
  };
}

export default async function IndividualProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Fetch product from database
  const productData = await getProductBySlug(slug);

  if (!productData) {
    notFound();
  }

  // Skip if it's a package (packages have their own route)
  if (productData.product_type === 'package') {
    notFound();
  }

  // Convert database product to PackageProduct format for components
  const frontendProduct = convertDbProductToFrontendProduct(productData);
  
  const product: PackageProduct = {
    ...frontendProduct,
    packageImage: productData.package_image || frontendProduct.image || '',
    images: (productData.images as string[]) || [productData.package_image || frontendProduct.image || ''],
    tagline: productData.tagline || '',
    modules: [],
    resources: [],
    bonusAssets: [],
    levels: undefined,
    pricingJustification: productData.pricing_justification || '',
    contentHours: productData.content_hours || '',
    slug: productData.slug,
    rating: productData.rating ? (typeof productData.rating === 'number' ? productData.rating : parseFloat(String(productData.rating))) : undefined,
    reviewCount: productData.review_count || 0,
  };

  const categoryLabels: Record<string, string> = {
    'web-apps': 'Web Apps',
    'social-media': 'Social Media',
    'agency': 'Agency',
    'freelancing': 'Freelancing',
  };

  const productTypeLabels: Record<string, string> = {
    'tool': 'Tool',
    'template': 'Template',
    'strategy': 'Strategy',
    'course': 'Course',
    'individual': 'Individual Product',
  };

  const productImages = product.images || [product.packageImage];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>

        {/* Main Product Section - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 md:mb-16">
          {/* Left Side - Image Gallery */}
          <div className="w-full order-1 lg:order-1">
            <ProductImageGallery 
              images={productImages}
              alt={product.title}
            />
          </div>

          {/* Right Side - Product Information & Purchase */}
          <div className="w-full order-2 lg:order-2">
            <ProductInfoPanel 
              package={product}
            />
          </div>
        </div>

        <Separator className="my-12" />

        {/* Description Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About This Product</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-muted-foreground mb-6">
                {product.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Instant Access</p>
                    <p className="text-sm text-muted-foreground">
                      Download and use immediately after purchase
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Production-Ready</p>
                    <p className="text-sm text-muted-foreground">
                      Ready-to-use {productTypeLabels[productData.product_type || 'individual']?.toLowerCase() || 'resource'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Lifetime Access</p>
                    <p className="text-sm text-muted-foreground">
                      One-time purchase with lifetime updates
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Regular Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Get access to new versions and improvements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Type Information */}
        {productData.product_type && productData.product_type !== 'individual' && (
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Product Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This is a <strong>{productTypeLabels[productData.product_type] || productData.product_type}</strong> product.
                  {productData.product_type === 'tool' && ' Use it to enhance your workflow and productivity.'}
                  {productData.product_type === 'template' && ' Customize it to fit your specific needs.'}
                  {productData.product_type === 'strategy' && ' Follow the step-by-step guide to achieve your goals.'}
                  {productData.product_type === 'course' && ' Complete the course modules to master the skills.'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Justification */}
        {product.pricingJustification && (
          <div className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Why This Price?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {product.pricingJustification}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Related Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={`/products?category=${product.category}`}>
            <Button variant="outline">
              View {categoryLabels[product.category] || 'Products'} Products
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
