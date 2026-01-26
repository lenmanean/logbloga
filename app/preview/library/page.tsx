import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { LibraryPreviewClient } from './library-preview-client';
import { getAllMockPackages, getAllMockIndividualProducts } from '@/lib/mock-data/preview-library';
import type { ProductWithPurchaseDate } from '@/lib/types/database';

export const metadata = {
  title: 'Preview Library | Logbloga',
  description: 'Visual testing - All packages and individual products with mock data',
};

/**
 * Convert mock package to ProductWithPurchaseDate format for component compatibility
 */
function mockPackageToProductWithPurchaseDate(mockPackage: ReturnType<typeof getAllMockPackages>[0]): ProductWithPurchaseDate {
  const purchaseDate = new Date().toISOString();
  const orderId = `preview-order-${mockPackage.id}`;

  return {
    id: mockPackage.id,
    name: mockPackage.title, // Required field
    title: mockPackage.title,
    description: mockPackage.description,
    category: mockPackage.category,
    price: mockPackage.price,
    original_price: mockPackage.originalPrice,
    featured: true,
    active: true,
    package_image: mockPackage.packageImage,
    images: [mockPackage.packageImage] as any, // Json type - stored as string array
    tagline: mockPackage.tagline,
    duration: 'Self-paced',
    content_hours: mockPackage.contentHours,
    rating: mockPackage.rating,
    review_count: mockPackage.reviewCount,
    slug: mockPackage.slug,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    file_path: null,
    file_size: null,
    image_url: null,
    published: true,
    pricing_justification: null,
    stripe_price_id: null,
    stripe_product_id: null,
    product_type: 'package',
    // Purchase information
    purchasedDate: purchaseDate,
    orderId: orderId,
  };
}

/**
 * Convert mock individual product to ProductWithPurchaseDate format for component compatibility
 */
function mockIndividualProductToProductWithPurchaseDate(mockProduct: ReturnType<typeof getAllMockIndividualProducts>[0]): ProductWithPurchaseDate {
  const purchaseDate = new Date().toISOString();
  const orderId = `preview-order-${mockProduct.id}`;

  return {
    id: mockProduct.id,
    name: mockProduct.title, // Required field
    title: mockProduct.title,
    description: mockProduct.description,
    category: mockProduct.category,
    price: mockProduct.price,
    original_price: mockProduct.originalPrice,
    featured: mockProduct.featured,
    active: true,
    package_image: mockProduct.image || null,
    images: mockProduct.image ? [mockProduct.image] as any : null,
    tagline: null,
    duration: mockProduct.duration,
    content_hours: null,
    rating: null,
    review_count: null,
    slug: mockProduct.slug,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    file_path: null,
    file_size: null,
    image_url: mockProduct.image || null,
    published: true,
    pricing_justification: null,
    stripe_price_id: null,
    stripe_product_id: null,
    product_type: mockProduct.productType,
    // Purchase information
    purchasedDate: purchaseDate,
    orderId: orderId,
  };
}

export default function PreviewLibraryPage() {
  const mockPackages = getAllMockPackages();
  const mockIndividualProducts = getAllMockIndividualProducts();
  
  // Convert both packages and individual products
  const packageProducts = mockPackages.map(mockPackageToProductWithPurchaseDate);
  const individualProductProducts = mockIndividualProducts.map(mockIndividualProductToProductWithPurchaseDate);
  
  // Combine both types of products
  const mockProducts = [...packageProducts, ...individualProductProducts];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Preview Library</h1>
          <p className="text-muted-foreground mt-2">
            Visual testing - All packages and individual products with mock data
          </p>
        </div>

        {mockProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2">No products found</CardTitle>
          <CardDescription className="text-center">
            No mock packages or products available for preview.
          </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <Suspense fallback={
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
                <CardTitle className="text-xl mb-2">Loading preview library...</CardTitle>
              </CardContent>
            </Card>
          }>
            <LibraryPreviewClient products={mockProducts} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
