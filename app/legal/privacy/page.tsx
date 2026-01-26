import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Logbloga',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = '2026-01-23';

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <p className="text-muted-foreground mb-8">
        Last updated: {lastUpdated}
      </p>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            At Logbloga, we respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we collect, use, and safeguard your information when you 
            use our website and services.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
          <p className="mb-4">
            We may collect the following personal information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name and email address</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Account preferences and settings</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Usage Information</h3>
          <p className="mb-4">
            We automatically collect certain information when you visit our website:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>IP address and browser type</li>
            <li>Pages visited and time spent on pages</li>
            <li>Device information</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use your information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>To provide and maintain our services</li>
            <li>To process your orders and payments</li>
            <li>To communicate with you about your account and orders</li>
            <li>To send you marketing communications (with your consent)</li>
            <li>To improve our website and services</li>
            <li>To detect and prevent fraud</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Service Providers:</strong> Third-party services that help us operate our business (e.g., payment processors, email services)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights (GDPR)</h2>
          <p className="mb-4">If you are located in the European Economic Area (EEA), you have the following rights:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your data</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
            <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact us at privacy@logbloga.com or use the tools in your account settings.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
          <p className="mb-4">
            We use cookies and similar technologies to enhance your experience. For more information, 
            please see our <a href="/legal/cookies" className="text-primary underline">Cookie Policy</a>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal data 
            against unauthorized access, alteration, disclosure, or destruction. However, no method of 
            transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
          <p className="mb-4">
            We retain your personal data for as long as necessary to fulfill the purposes outlined in 
            this policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
          <p className="mb-4">
            Our services are not intended for children under the age of 13. We do not knowingly collect 
            personal information from children under 13.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify you of any changes by 
            posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this privacy policy, please contact us at:
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
