import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - AI to USD */}
      <section className="bg-red-500 text-white mt-[58px] mb-[58px] py-[41px] px-[33px] animate-fade-in relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="bg-animated-orb bg-animated-orb-1"></div>
          <div className="bg-animated-orb bg-animated-orb-2"></div>
          <div className="bg-animated-orb bg-animated-orb-3"></div>
          <div className="bg-animated-shape bg-animated-shape-1"></div>
          <div className="bg-animated-shape bg-animated-shape-2"></div>
          <div className="bg-animated-shape bg-animated-shape-3"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
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
    </main>
  );
}
