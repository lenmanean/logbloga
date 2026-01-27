import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Amazing Product
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Solve problems. Deliver value. Grow your business.
          </p>
          <Link
            href="/payment"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast</h3>
              <p className="text-gray-600">
                Lightning-fast performance that your users will love.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p className="text-gray-600">
                Your data is safe with enterprise-grade security.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">Simple</h3>
              <p className="text-gray-600">
                Easy to use, easy to love. Get started in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of satisfied customers today.
          </p>
          <Link
            href="/payment"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition inline-block"
          >
            Start Now
          </Link>
        </div>
      </section>
    </main>
  );
}
