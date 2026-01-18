import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ui/product-card';
import { ProductCategory, categories } from '@/lib/products';
import { getProductsByCategory, convertDbProductToFrontendProduct } from '@/lib/db/products';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

function getCategoryName(categoryId: ProductCategory): string {
  const category = categories.find(cat => cat.id === categoryId);
  return category?.name || categoryId;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params;
  const typedCategoryId = categoryId as ProductCategory;
  
  // Validate category
  const validCategories: ProductCategory[] = ['web-apps', 'social-media', 'agency', 'freelancing'];
  if (!validCategories.includes(typedCategoryId)) {
    notFound();
  }

  // Fetch products from database by category
  const dbProducts = await getProductsByCategory(typedCategoryId);
  
  // Convert database products to frontend Product format
  const categoryProducts = dbProducts.map(convertDbProductToFrontendProduct);

  const categoryName = getCategoryName(typedCategoryId);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover all {categoryName.toLowerCase()} products designed to help you transform your skills and start earning.
          </p>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

