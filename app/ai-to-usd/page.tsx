import Link from 'next/link';
import Image from 'next/image';
import { CompatibleWithCarousel } from '@/components/ai-to-usd/compatible-with-carousel';
import { categories } from '@/lib/products';
import { caseStudies } from '@/lib/resources/case-studies';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Layers, FileText, TrendingUp, Users, BookOpen } from 'lucide-react';

export default function AiToUsdPage() {
  // Get DOER case study (only real case study)
  const doerCaseStudy = caseStudies.find(study => study.slug === 'doer-ai-goal-achievement-platform');

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Compatible with platform carousel */}
        <CompatibleWithCarousel />

        {/* Hero / What is AI to USD */}
        <section className="mb-12 text-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              AI to USD systems: applied workflows for monetization paths
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Structured packages with applied workflows, templates, and guides for social media, client services, web apps, and freelancing.
            </p>
          </div>
        </section>

        {/* Explore Our Packages */}
        <div id="explore-packages" className="mb-10 md:mb-16 text-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Choose your monetization path
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One package or all four. Each package targets a monetization path: social media, client services, web apps, freelancing.
            </p>
          </div>
          <Link href="/ai-to-usd/packages/master-bundle" className="mb-6 md:mb-8 block">
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-6 text-center">
              <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 flex-shrink-0 mx-auto md:mx-0 rounded-lg overflow-hidden">
                <Image
                  src="/package-master.png"
                  alt="Master Bundle - All four AI to USD packages"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 64px, (max-width: 1024px) 96px, 128px"
                />
              </div>
              <div>
                <Badge className="mb-2 bg-amber-500/20 text-amber-800 dark:bg-amber-400/20 dark:text-amber-200 border-amber-500/30">Best Value</Badge>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-amber-900 dark:text-amber-100">
                  Master Bundle: All levels. One purchase.
                </h3>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                  All four packages. 145+ hours, templates and guides. One purchase.
                </p>
                <span className="inline-flex items-center justify-center gap-1 text-base md:text-lg font-semibold text-amber-700 dark:text-amber-300 mt-2">
                  View Master Bundle
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </span>
              </div>
            </div>
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={category.href} className="block text-center group">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-base text-muted-foreground">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Choose AI to USD */}
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

        {/* Case Studies Showcase Section */}
        {doerCaseStudy && (
          <section className="mb-16 text-center">
            {doerCaseStudy.featuredImage && (
              <div className="flex justify-center mb-4">
                <Image
                  src={doerCaseStudy.featuredImage}
                  alt={doerCaseStudy.company ?? doerCaseStudy.title}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Real-world application
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Example: applied workflows in action. A production-ready app built with these systems.
            </p>
            <Badge variant="outline" className="mb-4">
              {doerCaseStudy.category}
            </Badge>
            <h3 className="text-xl font-semibold mb-2">{doerCaseStudy.title}</h3>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-6">
              {doerCaseStudy.description}
            </p>
            {doerCaseStudy.outcome && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Key Achievement</p>
                <p className="text-base text-muted-foreground max-w-xl mx-auto">
                  {doerCaseStudy.outcome}
                </p>
              </div>
            )}
            {doerCaseStudy.results && doerCaseStudy.results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 justify-items-center">
                {doerCaseStudy.results.map((result, index) => (
                  <div key={index} className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">{result.metric}</p>
                    <p className="text-base font-semibold">{result.value}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/resources/case-studies/${doerCaseStudy.slug}`}>
                <Button variant="default">
                  Read Full Story
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <a href="https://usedoer.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  Visit DOER
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </div>
          </section>
        )}

        {/* Testimonials placeholder */}
        <section className="mb-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Testimonials
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Coming soon.
          </p>
        </section>

        {/* Call-to-Action Section */}
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
      </div>
    </main>
  );
}
