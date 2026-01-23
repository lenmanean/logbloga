import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | LogBloga',
  description: 'Learn about how we use cookies and similar technologies on LogBloga.',
};

export default function CookiePolicyPage() {
  const lastUpdated = '2026-01-23';

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      
      <p className="text-muted-foreground mb-8">
        Last updated: {lastUpdated}
      </p>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
          <p className="mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you 
            visit a website. They are widely used to make websites work more efficiently and provide 
            information to the website owners.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p className="mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Remember your preferences and settings</li>
            <li>Keep you logged in to your account</li>
            <li>Store items in your shopping cart</li>
            <li>Understand how you use our website</li>
            <li>Improve our website and services</li>
            <li>Provide personalized content and advertisements (with your consent)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
          
          <h3 className="text-xl font-semibold mb-3">3.1 Essential Cookies</h3>
          <p className="mb-4">
            These cookies are necessary for the website to function properly. They enable basic 
            functions like page navigation, accessing secure areas, and shopping cart functionality. 
            These cookies cannot be disabled.
          </p>
          <p className="mb-4">
            <strong>Examples:</strong> Authentication cookies, session cookies, security cookies
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Analytics Cookies</h3>
          <p className="mb-4">
            These cookies help us understand how visitors interact with our website by collecting 
            and reporting information anonymously. This helps us improve our website&apos;s performance.
          </p>
          <p className="mb-4">
            <strong>Examples:</strong> Google Analytics cookies, performance tracking cookies
          </p>
          <p className="mb-4">
            <em>You can opt out of these cookies through our cookie consent banner.</em>
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Marketing Cookies</h3>
          <p className="mb-4">
            These cookies are used to track visitors across websites to display relevant 
            advertisements. They may also be used to limit the number of times you see an ad and 
            measure the effectiveness of advertising campaigns.
          </p>
          <p className="mb-4">
            <strong>Examples:</strong> Advertising cookies, social media cookies, retargeting cookies
          </p>
          <p className="mb-4">
            <em>You can opt out of these cookies through our cookie consent banner.</em>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
          <p className="mb-4">
            In addition to our own cookies, we may also use various third-party cookies to report 
            usage statistics, deliver advertisements, and more. These include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Stripe:</strong> Payment processing cookies</li>
            <li><strong>Supabase:</strong> Authentication and database cookies</li>
            <li><strong>Google Analytics:</strong> Website analytics (if consented)</li>
            <li><strong>Resend:</strong> Email service cookies</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
          <p className="mb-4">
            You can control and manage cookies in several ways:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Cookie Consent Banner:</strong> Use our cookie consent banner to choose which cookies to accept</li>
            <li><strong>Account Settings:</strong> Update your cookie preferences in your account settings</li>
            <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies. However, blocking essential cookies may impact website functionality.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Cookie Duration</h2>
          <p className="mb-4">
            We use both session cookies and persistent cookies:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
            <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until you delete them</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
          <p className="mb-4">
            We may update this Cookie Policy from time to time to reflect changes in our practices 
            or for other operational, legal, or regulatory reasons. We will notify you of any 
            material changes by posting the new policy on this page.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p className="mb-4">
            If you have questions about our use of cookies, please contact us at:
          </p>
          <p className="mb-4">
            <strong>Email:</strong> support@logbloga.com (for general inquiries)<br />
            <strong>Privacy Inquiries:</strong> privacy@logbloga.com<br />
            <strong>Response Time:</strong> We typically respond within 24-48 hours during business days
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            <em>Note: Business address will be provided upon request or when available.</em>
          </p>
        </section>
      </div>
    </div>
  );
}
