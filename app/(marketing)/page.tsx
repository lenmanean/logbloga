import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/db/products";
import { getBlogPosts } from "@/lib/db/blog";
import { ProductGrid } from "@/components/products/product-grid";
import { BlogGrid } from "@/components/blog/blog-grid";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const [featuredProducts, recentPosts] = await Promise.all([
    getProducts({ published: true, featured: true, limit: 6 }),
    getBlogPosts({ published: true, limit: 3 }),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Section padding="xl" className="gradient-hero">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-6" style={{ color: '#39f400' }}>
            <TypingAnimation text="logbloga" speed={120} />
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-7 sm:leading-8 text-muted-foreground mx-auto" style={{ maxWidth: '42rem' }}>
            Your destination for digital products, technology insights, AI
            tutorials, and productivity tips. Discover innovative tools and
            resources to accelerate your journey.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap gap-y-4">
            <Button asChild size="lg" variant="buy-now">
              <Link href="/products">
                <span className="inline-flex items-center gap-2">
                  Explore Products <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/blog"><span>Read Blog</span></Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <Section padding="lg">
          <Container>
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold">Featured Products</h2>
                <p className="mt-2 text-muted-foreground">
                  Check out our most popular digital products
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products">
                  <span className="inline-flex items-center gap-2">
                    View All <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
            <ProductGrid products={featuredProducts} />
          </Container>
        </Section>
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <Section variant="default" padding="lg">
          <Container>
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold">Latest from the Blog</h2>
                <p className="mt-2 text-muted-foreground">
                  Stay updated with our latest articles
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/blog">
                  <span className="inline-flex items-center gap-2">
                    View All <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
            <BlogGrid posts={recentPosts} />
          </Container>
        </Section>
      )}
    </div>
  );
}

