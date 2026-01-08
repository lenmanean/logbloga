import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/db/products";
import { getBlogPosts } from "@/lib/db/blog";
import { ProductGrid } from "@/components/products/product-grid";
import { BlogGrid } from "@/components/blog/blog-grid";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ArrowRight, ShoppingBag, BookOpen, Sparkles, Code, Rocket, TrendingUp } from "lucide-react";

export default async function HomePage() {
  // Fetch featured products and all recent posts
  const [featuredProducts, allRecentPosts] = await Promise.all([
    getProducts({ published: true, featured: true, limit: 4 }),
    getBlogPosts({ published: true, limit: 10 }), // Get more to filter out DOER posts
  ]);

  // Try to fetch DOER posts by tag first, then fall back to search
  let doerPosts = await getBlogPosts({ published: true, tag: "doer", limit: 3 });
  if (doerPosts.length === 0) {
    // Fall back to search if tag filtering returns no results
    doerPosts = await getBlogPosts({ published: true, search: "DOER", limit: 3 });
  }

  // Filter out DOER posts from general blog posts
  const doerPostIds = new Set(doerPosts.map((post) => post.id));
  const generalPosts = allRecentPosts
    .filter((post) => !doerPostIds.has(post.id))
    .slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Section padding="xl" className="gradient-hero">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-12" style={{ color: '#39f400' }}>
            <TypingAnimation text="log(b)log(a)" speed={120} />
          </h1>
          
          {/* Glassmorphic Panels */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
            <GlassPanel
              title="Shop"
              description="Browse our digital products"
              href="/products"
              icon={<ShoppingBag className="h-8 w-8" />}
              className="flex-1 min-w-[200px]"
            />
            <GlassPanel
              title="Blog"
              description="Read our latest articles"
              href="/blog"
              icon={<BookOpen className="h-8 w-8" />}
              className="flex-1 min-w-[200px]"
            />
          </div>
        </div>
      </Section>

      {/* Value Proposition */}
      <Section padding="md" className="animate-in fade-in duration-500">
        <Container>
          <div className="max-w-4xl mx-auto w-full">
            <div className="bg-background/30 backdrop-blur-lg border border-white/20 rounded-xl p-8 hover:border-[#39f400]/30 transition-all duration-300">
              <p 
                className="text-xl sm:text-2xl leading-relaxed text-center" 
                style={{ color: '#39f400', width: '100%', display: 'block' }}
              >
                Premium digital products & productivity insights
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Quick Categories */}
      <Section padding="lg" className="animate-in fade-in duration-500 delay-100">
        <Container>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
            <p className="text-muted-foreground">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassPanel
              title="AI Products"
              description="AI tools & guides"
              href="/products?category=ai"
              icon={<Sparkles className="h-8 w-8" />}
            />
            <GlassPanel
              title="Development"
              description="Dev tools & resources"
              href="/products?category=development"
              icon={<Code className="h-8 w-8" />}
            />
            <GlassPanel
              title="DOER Posts"
              description="Latest on DOER"
              href="/blog?tag=doer"
              icon={<Rocket className="h-8 w-8" />}
            />
            <GlassPanel
              title="Productivity"
              description="Guides & tips"
              href="/products?category=productivity"
              icon={<TrendingUp className="h-8 w-8" />}
            />
          </div>
        </Container>
      </Section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <Section padding="lg" className="animate-in fade-in duration-500 delay-200">
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

      {/* DOER Blog Section */}
      {doerPosts.length > 0 && (
        <Section variant="muted" padding="lg" className="animate-in fade-in duration-500 delay-300">
          <Container>
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold">Latest on DOER</h2>
                <p className="mt-2 text-muted-foreground">
                  Productivity insights and DOER app updates
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/blog?tag=doer">
                  <span className="inline-flex items-center gap-2">
                    View All DOER Posts <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
            <BlogGrid posts={doerPosts} />
          </Container>
        </Section>
      )}

      {/* Recent Blog Posts */}
      {generalPosts.length > 0 && (
        <Section variant="default" padding="lg" className="animate-in fade-in duration-500 delay-400">
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
            <BlogGrid posts={generalPosts} />
          </Container>
        </Section>
      )}
    </div>
  );
}

