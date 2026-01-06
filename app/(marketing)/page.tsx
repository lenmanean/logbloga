import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/db/products";
import { getBlogPosts } from "@/lib/db/blog";
import { ProductGrid } from "@/components/products/product-grid";
import { BlogGrid } from "@/components/blog/blog-grid";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ArrowRight, ShoppingBag, Book, Sparkles, TrendingUp, Shield } from "lucide-react";

export default async function HomePage() {
  const [featuredProducts, recentPosts] = await Promise.all([
    getProducts({ published: true, featured: true, limit: 6 }),
    getBlogPosts({ published: true, limit: 3 }),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Section padding="xl" className="gradient-hero">
        <Container className="text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-6">
              Welcome to{" "}
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-brand-accent">
                LogBloga
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
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
                <Link href="/blog">Read Blog</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section variant="muted" padding="lg">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center group">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Digital Products</h3>
              <p className="text-muted-foreground">
                Premium digital products including guides, templates, and tools
                to help you succeed.
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Tech Blog</h3>
              <p className="text-muted-foreground">
                Stay updated with the latest technology trends, AI insights, and
                productivity tips.
              </p>
            </div>
            <div className="text-center group">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI & Productivity</h3>
              <p className="text-muted-foreground">
                Learn about AI tools, automation, and strategies to boost your
                productivity.
              </p>
            </div>
          </div>
        </Container>
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
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductGrid products={featuredProducts} />
          </Container>
        </Section>
      )}

      {/* Trust Indicators */}
      <Section variant="muted" padding="md">
        <Container>
          <div className="grid gap-6 md:grid-cols-3 text-center">
            <div>
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold mb-1">Secure Payments</h4>
              <p className="text-sm text-muted-foreground">
                Powered by Stripe
              </p>
            </div>
            <div>
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold mb-1">Instant Access</h4>
              <p className="text-sm text-muted-foreground">
                Download immediately after purchase
              </p>
            </div>
            <div>
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-semibold mb-1">Quality Content</h4>
              <p className="text-sm text-muted-foreground">
                Curated by experts
              </p>
            </div>
          </div>
        </Container>
      </Section>

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
                  View All <ArrowRight className="ml-2 h-4 w-4" />
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

