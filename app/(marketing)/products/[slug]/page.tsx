import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/db/products";
import { ProductHero } from "@/components/products/product-hero";
import { ProductDetailSticky } from "@/components/products/product-detail-sticky";
import { ProductGrid } from "@/components/products/product-grid";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | LogBloga",
    };
  }

  return {
    title: `${product.name} | LogBloga`,
    description: product.description || undefined,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.image_url ? [product.image_url] : [],
      type: "product",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, exclude current product)
  const relatedProducts = await getProducts({
    published: true,
    category: product.category || undefined,
    limit: 4,
  }).then((products) =>
    products.filter((p) => p.id !== product.id).slice(0, 3)
  );

  return (
    <>
      <Container variant="product" className="py-12">
        <ProductHero product={product} />
      </Container>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Section variant="muted" padding="lg">
          <Container variant="product">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Related Products</h2>
              <p className="text-muted-foreground">
                You might also like these products
              </p>
            </div>
            <ProductGrid products={relatedProducts} />
          </Container>
        </Section>
      )}

      {/* Sticky Buy Button */}
      <ProductDetailSticky product={product} />
    </>
  );
}

