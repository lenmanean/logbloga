import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { LibraryPreviewClient } from './library-preview-client';
import { getAllMockPackages } from '@/lib/mock-data/preview-library';
import type { LicenseWithProduct } from '@/lib/types/database';

export const metadata = {
  title: 'Preview Library | LogBloga',
  description: 'Visual testing - All packages with mock data',
};

/**
 * Convert mock package to LicenseWithProduct format for component compatibility
 */
function mockPackageToLicenseWithProduct(mockPackage: ReturnType<typeof getAllMockPackages>[0]): LicenseWithProduct {
  return {
    id: `license-${mockPackage.id}`,
    user_id: 'preview-user',
    product_id: mockPackage.id,
    license_key: `PREVIEW-${mockPackage.id.toUpperCase()}`,
    status: 'active',
    access_granted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    lifetime_access: false,
    expires_at: null,
    product: {
      id: mockPackage.id,
      title: mockPackage.title,
      description: mockPackage.description,
      category: mockPackage.category,
      price: mockPackage.price,
      original_price: mockPackage.originalPrice,
      featured: true,
      active: true,
      package_image: mockPackage.packageImage,
      images: [mockPackage.packageImage],
      tagline: mockPackage.tagline,
      difficulty: mockPackage.difficulty,
      duration: 'Self-paced',
      content_hours: mockPackage.contentHours,
      rating: mockPackage.rating,
      review_count: mockPackage.reviewCount,
      slug: mockPackage.slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };
}

export default function PreviewLibraryPage() {
  const mockPackages = getAllMockPackages();
  const mockLicenses = mockPackages.map(mockPackageToLicenseWithProduct);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Preview Library</h1>
          <p className="text-muted-foreground mt-2">
            Visual testing - All packages with mock data
          </p>
        </div>

        {mockLicenses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">No packages found</CardTitle>
              <CardDescription className="text-center">
                No mock packages available for preview.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <LibraryPreviewClient licenses={mockLicenses} />
        )}
      </div>
    </main>
  );
}
