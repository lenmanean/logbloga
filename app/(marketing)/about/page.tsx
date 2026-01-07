import { Metadata } from "next";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about LogBloga and our mission",
};

export default function AboutPage() {
  return (
    <Container variant="content" className="py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">About LogBloga</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground">
            LogBloga is your destination for digital products, technology
            insights, AI tutorials, and productivity tips. We're dedicated to
            helping you discover innovative tools and resources to accelerate
            your journey.
          </p>
          <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
          <p className="text-base leading-7">
            Our mission is to provide high-quality digital products and
            educational content that empowers individuals and businesses to
            leverage technology effectively. We believe in making advanced tools
            and knowledge accessible to everyone.
          </p>
          <h2 className="text-2xl font-semibold mt-8">What We Offer</h2>
          <ul className="list-disc list-outside ml-6 space-y-2 text-base leading-7">
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
    </Container>
  );
}

