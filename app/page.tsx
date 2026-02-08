import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '@/components/ui/category-card';
import { categories } from '@/lib/products';
import { Sparkles, DollarSign, BookOpen, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - AI to USD */}
      <section className="bg-red-500 text-white mt-[58px] mb-[58px] py-[41px] px-[33px] animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-delay-100">
                AI to USD
              </h1>
              <p className="text-xl md:text-2xl text-red-50 leading-relaxed animate-fade-in-delay-200">
                Discover our comprehensive collection of AI to USD products. Transform your skills, unlock new opportunities, and start your journey to earning with artificial intelligence.
              </p>
              <div className="animate-fade-in-delay-300">
                <Button className="bg-white text-red-500 hover:bg-red-50" asChild>
                  <span>Learn More</span>
                </Button>
              </div>
            </div>
            {/* Right side - Product packages image */}
            <div className="hidden md:flex items-center justify-center animate-fade-in-delay-400">
              <Image
                src="/productpackages.png"
                alt="AI to USD product packages - Social Media, Web Apps, and Agency"
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
      <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-delay-100">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Our Packages
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover comprehensive packages tailored to your goals, whether you're building web apps, growing your social media, scaling an agency, or advancing your freelancing career.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const delayClass = index === 0 ? 'animate-fade-in-delay-200' : 
                                index === 1 ? 'animate-fade-in-delay-300' :
                                index === 2 ? 'animate-fade-in-delay-400' : 'animate-fade-in-delay-500';
              return (
                <div key={category.id} className={delayClass}>
                  <CategoryCard category={category} disableLink />
                </div>
              );
            })}
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
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to transform your skills and start earning with artificial intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4 animate-fade-in-delay-200">
              <div className="inline-flex p-4 rounded-full bg-red-500/10">
                <Sparkles className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold">Transform Your Skills</h3>
              <p className="text-muted-foreground">
                Learn cutting-edge AI techniques with step-by-step guidance and real-world examples.
              </p>
            </div>
            <div className="text-center space-y-4 animate-fade-in-delay-300">
              <div className="inline-flex p-4 rounded-full bg-red-500/10">
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold">Start Earning</h3>
              <p className="text-muted-foreground">
                Monetize your new capabilities with proven strategies and business models.
              </p>
            </div>
            <div className="text-center space-y-4 animate-fade-in-delay-400">
              <div className="inline-flex p-4 rounded-full bg-red-500/10">
                <BookOpen className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold">Comprehensive Resources</h3>
              <p className="text-muted-foreground">
                Access everything you need in one place - templates, tools, and tutorials.
              </p>
            </div>
            <div className="text-center space-y-4 animate-fade-in-delay-500">
              <div className="inline-flex p-4 rounded-full bg-red-500/10">
                <Users className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold">Expert Support</h3>
              <p className="text-muted-foreground">
                Get help when you need it from our community and expert team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
