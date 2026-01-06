import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about LogBloga and our mission",
};

export default function AboutPage() {
  return (
    <div className="container px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">About LogBloga</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-muted-foreground">
            LogBloga is your destination for digital products, technology
            insights, AI tutorials, and productivity tips. We're dedicated to
            helping you discover innovative tools and resources to accelerate
            your journey.
          </p>
          <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
          <p>
            Our mission is to provide high-quality digital products and
            educational content that empowers individuals and businesses to
            leverage technology effectively. We believe in making advanced tools
            and knowledge accessible to everyone.
          </p>
          <h2 className="text-2xl font-semibold mt-8">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Digital Products:</strong> Premium guides, templates, and
              tools to help you succeed
            </li>
            <li>
              <strong>Technology Blog:</strong> Stay updated with the latest
              technology trends and insights
            </li>
            <li>
              <strong>AI & Productivity:</strong> Learn about AI tools and
              strategies to boost your productivity
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

