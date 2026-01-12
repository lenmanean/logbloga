import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
                <Link href="/products/ai-to-usd-complete">
                  <Button className="bg-white text-red-500 hover:bg-red-50">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            {/* Right side - Empty for future image */}
            <div className="hidden md:block animate-fade-in-delay-400">
              {/* Image placeholder - will be added later */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
