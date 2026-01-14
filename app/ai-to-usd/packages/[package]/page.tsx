import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PackageHero } from '@/components/ui/package-hero';
import { WhatsIncluded } from '@/components/ui/whats-included';
import { AddToCartButton } from '@/components/ui/add-to-cart-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { packageProducts } from '@/lib/products';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface PackagePageProps {
  params: {
    package: string;
  };
}

export default function PackagePage({ params }: PackagePageProps) {
  const packageSlug = params.package;
  const packageData = packageProducts.find(pkg => pkg.slug === packageSlug);

  if (!packageData) {
    notFound();
  }

  const categoryLabels: Record<string, string> = {
    'web-apps': 'Web Apps',
    'social-media': 'Social Media',
    'agency': 'Agency',
    'freelancing': 'Freelancing',
  };

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

        {/* Hero Section */}
        <div className="mb-12">
          <PackageHero package={packageData} />
        </div>

        {/* Add to Cart Section - Sticky on mobile, sidebar on desktop */}
        <div className="mb-12">
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-bold">${packageData.price.toLocaleString()}</span>
                    {packageData.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${packageData.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lifetime access • {packageData.contentHours} of content
                  </p>
                </div>
                <AddToCartButton
                  packageId={packageData.id}
                  price={packageData.price}
                  size="lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-12" />

        {/* Description Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About This Package</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-muted-foreground mb-4">
                {packageData.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Self-Paced Learning</p>
                    <p className="text-sm text-muted-foreground">
                      Learn at your own pace with lifetime access
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Production-Ready Resources</p>
                    <p className="text-sm text-muted-foreground">
                      Templates and tools you can use immediately
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Community Support</p>
                    <p className="text-sm text-muted-foreground">
                      Join a community of like-minded professionals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Regular Updates</p>
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
          <WhatsIncluded package={packageData} />
        </div>

        {/* Pricing Justification */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Why This Price?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {packageData.pricingJustification}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Final CTA */}
        <div className="mb-12">
          <Card className="bg-red-500 text-white border-red-600">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Ready to Transform Your Skills?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-red-50">
                Join thousands of students who are already transforming their careers with AI.
              </p>
              <AddToCartButton
                packageId={packageData.id}
                price={packageData.price}
                size="lg"
                className="bg-white text-red-500 hover:bg-red-50"
              />
            </CardContent>
          </Card>
        </div>

        {/* Related Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={`/ai-to-usd/${packageData.category}`}>
            <Button variant="outline">
              View {categoryLabels[packageData.category]} Products
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

