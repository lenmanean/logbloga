export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - AI to USD Complete */}
      <section className="bg-red-500 text-white py-20 px-4 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                AI to USD Complete
              </h1>
              <p className="text-xl md:text-2xl text-red-50 leading-relaxed">
                Get access to all AI to USD products in one comprehensive bundle. Everything you need to transform your skills and start earning, all in one place.
              </p>
            </div>
            {/* Right side - Empty for future image */}
            <div className="hidden md:block">
              {/* Image placeholder - will be added later */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
