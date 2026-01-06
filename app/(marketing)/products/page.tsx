import { Metadata } from "next";
import { getProducts, getProductCategories } from "@/lib/db/products";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { Container } from "@/components/layout/container";
import { Suspense } from "react";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";

export const metadata: Metadata = {
  title: "Products | LogBloga",
  description: "Browse our collection of digital products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({
      published: true,
      category: params.category || undefined,
      search: params.search || undefined,
      maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
      sort: params.sort || "newest",
    }),
    getProductCategories(),
  ]);

  return (
    <Container variant="product" className="py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Products</h1>
        <p className="text-muted-foreground">
          Discover our collection of digital products
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block">
          <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded" /><div className="h-32 bg-muted rounded" /></div>}>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        {/* Products Grid */}
        <div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No products found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
                </div>
                <ProductGrid products={products} />
              </>
            )}
          </Suspense>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden mt-8">
        <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded" /></div>}>
          <ProductFilters categories={categories} />
        </Suspense>
      </div>
    </Container>
  );
}

