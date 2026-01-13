'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '@/components/ui/category-card';
import { ProductCard } from '@/components/ui/product-card';
import { categories, sampleProducts } from '@/lib/products';
import { Sparkles, DollarSign, BookOpen, Users, ArrowRight, CheckCircle2, Star, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const scrollToCategories = () => {
    const element = document.getElementById('categories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - AI to USD */}
      <section className="bg-red-500 text-white mt-[58px] mb-[58px] py-[41px] px-[33px] animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-delay-100">
                Turn AI Skills Into Profitable Income Tracks
              </h1>
              <div className="space-y-4 animate-fade-in-delay-200">
                <p className="text-xl md:text-2xl text-red-50 leading-relaxed">
                  Built for <strong>freelancers</strong>, <strong>agency founders</strong>, and <strong>content creators</strong> who want to monetize AI expertise.
                </p>
                <p className="text-lg md:text-xl text-red-50/90 leading-relaxed">
                  Transform your skills, unlock new opportunities, and start your journey to earning with artificial intelligence.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-300">
                <Button 
                  onClick={scrollToCategories}
                  className="bg-white text-red-500 hover:bg-red-50 text-lg px-8 py-6 min-h-[48px]"
                  size="lg"
                >
                  Browse Premium Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/products">
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 min-h-[48px]"
                    size="lg"
                  >
                    View All Products
                  </Button>
                </Link>
              </div>
            </div>
            {/* Right side - Product packages image */}
            <div className="hidden md:flex items-center justify-center animate-fade-in-delay-400">
              <Image
                src="/productpackages.png"
                alt="AI professionals earning with AI skills - dashboards showing successful projects and income from AI-powered services"
                width={600}
                height={800}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section id="categories" className="py-16 md:py-24 px-4 md:px-6 bg-background scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-delay-100">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Explore Our Categories
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover products tailored to your goals, whether you're building web apps, growing your social media, scaling an agency, or advancing your freelancing career.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const delayClass = index === 0 ? 'animate-fade-in-delay-200' : 
                                index === 1 ? 'animate-fade-in-delay-300' :
                                index === 2 ? 'animate-fade-in-delay-400' : 'animate-fade-in-delay-500';
              return (
                <div key={category.id} className={delayClass}>
                  <CategoryCard category={category} />
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12 animate-fade-in-delay-500">
            <Link href="/products">
              <Button size="lg" className="min-h-[48px] px-8">
                See All Offers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-delay-100">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Our most popular products designed to help you succeed. Start your journey with these top-rated resources.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProducts
              .filter(product => product.featured)
              .map((product, index) => {
                const delayClass = index === 0 ? 'animate-fade-in-delay-200' : 
                                  index === 1 ? 'animate-fade-in-delay-300' :
                                  index === 2 ? 'animate-fade-in-delay-400' : 'animate-fade-in-delay-500';
                return (
                  <div key={product.id} className={delayClass}>
                    <ProductCard product={product} />
                  </div>
                );
              })}
          </div>
          <div className="text-center mt-12 animate-fade-in-delay-500">
            <Link href="/products">
              <Button size="lg" variant="outline" className="min-h-[48px] px-8">
                Learn More About All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-delay-100">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Join Thousands of Successful Learners
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Real results from freelancers, agency owners, and creators who transformed their careers with AI.
            </p>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-2 animate-fade-in-delay-200">
              <div className="text-4xl md:text-5xl font-bold text-red-500">10,000+</div>
              <div className="text-lg text-muted-foreground">Happy Learners</div>
            </div>
            <div className="text-center space-y-2 animate-fade-in-delay-300">
              <div className="text-4xl md:text-5xl font-bold text-red-500">$2M+</div>
              <div className="text-lg text-muted-foreground">Earned by Students</div>
            </div>
            <div className="text-center space-y-2 animate-fade-in-delay-400">
              <div className="text-4xl md:text-5xl font-bold text-red-500">95%</div>
              <div className="text-lg text-muted-foreground">Success Rate</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border rounded-lg space-y-4 animate-fade-in-delay-200">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">
                "This platform transformed my freelance career. I went from struggling to find clients to landing $5K+ projects using AI tools I learned here."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-500 font-semibold">JS</span>
                </div>
                <div>
                  <div className="font-semibold">John Smith</div>
                  <div className="text-sm text-muted-foreground">Freelancer</div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-card border rounded-lg space-y-4 animate-fade-in-delay-300">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">
                "Scaling my agency was impossible until I discovered these AI automation strategies. Revenue increased 3x in just 6 months."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-500 font-semibold">MJ</span>
                </div>
                <div>
                  <div className="font-semibold">Maria Johnson</div>
                  <div className="text-sm text-muted-foreground">Agency Founder</div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-card border rounded-lg space-y-4 animate-fade-in-delay-400">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">
                "As a content creator, these AI tools helped me 10x my productivity. Now I create better content faster and earn more than ever."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <span className="text-red-500 font-semibold">DR</span>
                </div>
                <div>
                  <div className="font-semibold">David Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Content Creator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-delay-100">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What Makes Us Different
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlike other AI courses that leave you with theory, we provide actionable paths to real income.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg border space-y-4 animate-fade-in-delay-200">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-red-500" />
                Lifetime Updates
              </h3>
              <p className="text-muted-foreground">
                Get all future updates and new content at no extra cost. As AI evolves, your resources evolve with it.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border space-y-4 animate-fade-in-delay-300">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Users className="h-6 w-6 text-red-500" />
                Expert Community Access
              </h3>
              <p className="text-muted-foreground">
                Join a thriving community of successful freelancers and agency owners. Get answers, share wins, and network with peers.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border space-y-4 animate-fade-in-delay-400">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-red-500" />
                Proven Business Models
              </h3>
              <p className="text-muted-foreground">
                We don't just teach AI tools—we show you exact business models that have generated real revenue for our students.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border space-y-4 animate-fade-in-delay-500">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-red-500" />
                One-on-One Coaching Available
              </h3>
              <p className="text-muted-foreground">
                Accelerate your success with optional expert coaching sessions. Get personalized guidance on your specific goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits/Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-delay-100">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose AI to USD
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Everything you need to transform your skills and start earning with artificial intelligence.
            </p>
          </div>
          
          {/* Audience-Specific Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-muted p-6 rounded-lg animate-fade-in-delay-200">
              <h3 className="text-xl font-semibold mb-4">For Freelancers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Stand out</strong> from competitors with cutting-edge AI skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Charge premium rates</strong> for AI-powered services</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Build portfolios</strong> that attract high-paying clients</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted p-6 rounded-lg animate-fade-in-delay-300">
              <h3 className="text-xl font-semibold mb-4">For Agencies</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Scale operations</strong> with AI-powered automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Deliver more value</strong> to clients with AI tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Increase margins</strong> while maintaining quality</span>
                </li>
              </ul>
            </div>
            <div className="bg-muted p-6 rounded-lg animate-fade-in-delay-400">
              <h3 className="text-xl font-semibold mb-4">For Creators</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>10x productivity</strong> with AI content generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Grow audience</strong> with AI-powered social media strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Monetize expertise</strong> by teaching AI skills to others</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Core Benefits in Bullet Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4 animate-fade-in-delay-200">
              <div className="inline-flex p-4 rounded-full bg-red-500/10">
                <Sparkles className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold">Transform Your Skills</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li>• <strong>Cutting-edge AI techniques</strong> with step-by-step guidance</li>
                <li>• <strong>Real-world examples</strong> and case studies</li>
                <li>• <strong>Hands-on projects</strong> to build your portfolio</li>
              </ul>
            </div>
            <div className="text-center space-y-4 animate-fade-in-delay-300">
              <div className="inline-flex p-4 rounded-full bg-red-500/10">
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold">Start Earning</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li>• <strong>Proven monetization strategies</strong> that work</li>
                <li>• <strong>Business models</strong> tested by successful students</li>
                <li>• <strong>Income track templates</strong> you can copy</li>
              </ul>
            </div>
            <div className="text-center space-y-4 animate-fade-in-delay-400">
              <div className="inline-flex p-4 rounded-full bg-red-500/10">
                <BookOpen className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold">Comprehensive Resources</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li>• <strong>Templates, tools, and tutorials</strong> in one place</li>
                <li>• <strong>Regular updates</strong> as AI technology evolves</li>
                <li>• <strong>Complete learning paths</strong> for each career track</li>
              </ul>
            </div>
            <div className="text-center space-y-4 animate-fade-in-delay-500">
              <div className="inline-flex p-4 rounded-full bg-red-500/10">
                <Users className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold">Expert Support</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li>• <strong>Active community</strong> for questions and networking</li>
                <li>• <strong>Expert team</strong> available when you need help</li>
                <li>• <strong>Coaching sessions</strong> to accelerate your success</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-12 animate-fade-in-delay-500">
            <Button 
              onClick={scrollToCategories}
              size="lg" 
              className="min-h-[48px] px-8 bg-red-500 hover:bg-red-600"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
