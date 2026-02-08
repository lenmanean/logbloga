import Link from 'next/link';
import Image from 'next/image';
import { CompatibleWithCarousel } from '@/components/ai-to-usd/compatible-with-carousel';
import { DoerPromoBanner } from '@/components/ai-to-usd/doer-promo-banner';
import { ScrollFadeIn } from '@/components/ai-to-usd/scroll-fade-in';
import { TestimonialCard } from '@/components/ai-to-usd/testimonial-card';
import { CategoryCard } from '@/components/ui/category-card';
import { MasterBundleCard } from '@/components/ui/master-bundle-card';
import { categories } from '@/lib/products';
import { TESTIMONIALS } from '@/lib/ai-to-usd/testimonials';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Layers, FileText, TrendingUp, Users, BookOpen } from 'lucide-react';

export default function AiToUsdPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <ScrollFadeIn>
          <DoerPromoBanner />
        </ScrollFadeIn>

        {/* Hero */}
        <ScrollFadeIn>
        <section className="mb-12 text-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              AI to USD
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Applied workflows for monetization paths. Structured packages with templates and guides for social media, client services, web apps, and freelancing.
            </p>
          </div>
        </section>
        </ScrollFadeIn>

        {/* Choose your monetization path */}
        <ScrollFadeIn>
        <div id="explore-packages" className="mb-10 md:mb-16 text-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Choose your monetization path
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One package or all four. Each package targets a monetization path.
            </p>
          </div>
          <MasterBundleCard href="/ai-to-usd/packages/master-bundle" className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
              <div className="flex items-center gap-3 md:gap-6 flex-1">
                <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src="/package-master.png"
                    alt="Master Bundle - All four AI to USD packages"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 64px, (max-width: 1024px) 96px, 128px"
                  />
                </div>
                <div className="min-w-0">
                  <Badge className="mb-2 bg-amber-500/20 text-amber-800 dark:bg-amber-400/20 dark:text-amber-200 border-amber-500/30">Best Value</Badge>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-amber-900 dark:text-amber-100">
                    Master Bundle: All levels. One purchase.
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                    All four packages. 145+ hours, templates and guides. One purchase.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-base md:text-lg font-semibold text-amber-700 dark:text-amber-300">View Master Bundle</span>
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </MasterBundleCard>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
        </ScrollFadeIn>

        {/* Testimonials */}
        <ScrollFadeIn>
        <section className="mb-16 text-center">
          <p className="text-sm text-muted-foreground mb-2">Testimonials</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Don&apos;t take our word for it
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
        </section>
        </ScrollFadeIn>

        {/* Why these systems work */}
        <ScrollFadeIn>
        <section className="mb-16 text-center">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Why these systems work
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Built for people who execute, not just learn.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-3">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Monetization Paths</h3>
              <p className="text-base text-muted-foreground max-w-sm mx-auto">
                Each package maps to a monetization path: social media, agency services, web apps, freelancing.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-3">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Resources</h3>
              <p className="text-base text-muted-foreground max-w-sm mx-auto">
                Templates, guides, and frameworks you can use Monday morning.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Approach</h3>
              <p className="text-base text-muted-foreground max-w-sm mx-auto">
                Use the tools that scale. Automate, ship faster, earn more.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Clear Monetization Pathways</h3>
              <p className="text-base text-muted-foreground max-w-sm mx-auto">
                Modules map to real monetization paths—affiliates, services, digital products—without guarantees.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Implementation Support</h3>
              <p className="text-base text-muted-foreground max-w-sm mx-auto">
                Platform setup, integrations, and best practices so you actually ship.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Self-Paced Learning</h3>
              <p className="text-base text-muted-foreground max-w-sm mx-auto">
                Lifetime access. Learn at your pace, revisit as you grow.
              </p>
            </div>
          </div>
        </section>
        </ScrollFadeIn>

        {/* Compatible with */}
        <ScrollFadeIn>
        <CompatibleWithCarousel />
        </ScrollFadeIn>

        {/* Call-to-Action */}
        <ScrollFadeIn>
        <section className="py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to apply AI to USD systems?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the monetization path that fits. Apply the systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#explore-packages">
              <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                Explore Packages
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline">
                Learn More
                <BookOpen className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
        </ScrollFadeIn>
      </div>
    </main>
  );
}
