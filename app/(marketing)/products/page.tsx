import { Metadata } from "next";
import { getProducts, getProductCategories } from "@/lib/db/products";
import { ProductGrid } from "@/components/products/product-grid";

export const metadata: Metadata = {
  title: "Products | LogBloga",
  description: "Browse our collection of digital products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const products = await getProducts({
    published: true,
    category: searchParams.category || undefined,
  });
  const categories = await getProductCategories();

  return (
    <div className="container px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Products</h1>
        <p className="text-muted-foreground">
          Discover our collection of digital products
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href="/products"
            className={`px-4 py-2 rounded-md border transition-colors ${
              !searchParams.category
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
          >
            All
          </a>
          {categories.map((category) => (
            <a
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className={`px-4 py-2 rounded-md border transition-colors ${
                searchParams.category === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              {category}
            </a>
          ))}
        </div>
      )}

      <ProductGrid products={products} />
    </div>
  );
}

