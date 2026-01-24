import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';
import { getMockPackageBySlug } from '@/lib/mock-data/preview-library';
import { PackageLevelContent } from './package-level-content';

export const metadata = {
  title: 'Preview Package | LogBloga',
  description: 'Visual testing - Package content with mock data',
};

interface PackagePreviewPageProps {
  params: Promise<{ 'package-slug': string }>;
}

export default async function PackagePreviewPage({ params }: PackagePreviewPageProps) {
  const { 'package-slug': packageSlug } = await params;
  const mockPackage = getMockPackageBySlug(packageSlug);

  if (!mockPackage) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <Link
            href="/preview/library"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            ← Back to Preview Library
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{mockPackage.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {mockPackage.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    Preview Mode
                  </Badge>
                </div>
              </CardHeader>
              {mockPackage.packageImage && (
                <CardContent>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={mockPackage.packageImage}
                      alt={mockPackage.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge variant="secondary">{mockPackage.category}</Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Content Hours</p>
                  <p className="text-sm">{mockPackage.contentHours}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tagline</p>
                  <p className="text-sm italic">{mockPackage.tagline}</p>
                </div>
              </CardContent>
            </Card>

            {/* Package Levels Content */}
            <PackageLevelContent package={mockPackage} />
          </div>

          {/* Sidebar - Package Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Package Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">${mockPackage.price.toLocaleString()}</span>
                    {mockPackage.originalPrice && (
                      <>
                        <span className="text-sm text-muted-foreground line-through">
                          ${mockPackage.originalPrice.toLocaleString()}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Save ${(mockPackage.originalPrice - mockPackage.price).toLocaleString()}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rating</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{mockPackage.rating} ⭐</span>
                    <span className="text-xs text-muted-foreground">
                      ({mockPackage.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Package Includes:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>3 Implementation Levels</li>
                    <li>Implementation Plans</li>
                    <li>Platform Setup Guides</li>
                    <li>Creative Decision Frameworks</li>
                    <li>Templates & Checklists</li>
                    <li>6 Months Free DOER Pro</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
