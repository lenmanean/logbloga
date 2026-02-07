import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Logbloga',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = '2026-02-07';

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
          <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Legal Basis (EEA/UK)</h3>
          <p className="mb-4">
            Where applicable law requires a legal basis for processing, we rely on: <strong>performance 
            of a contract</strong> (e.g., providing services you requested); <strong>consent</strong> 
            (e.g., marketing, optional cookies); <strong>legitimate interests</strong> (e.g., improving 
            our services, fraud prevention, analytics); and <strong>legal obligation</strong> (e.g., 
            tax, compliance).
          </p>
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
          <h2 className="text-2xl font-semibold mb-4">5. International Transfers</h2>
          <p className="mb-4">
            Your data may be processed in the United States or other countries where our service 
            providers operate. If you are located in the EEA, UK, or another jurisdiction with 
            restrictions on international transfers, we use appropriate safeguards where required 
            (such as adequacy decisions, standard contractual clauses, or other approved mechanisms) 
            to protect your personal data.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights (GDPR — EEA/UK)</h2>
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
          <p className="mb-4">
            You also have the right to lodge a complaint with a supervisory authority in your 
            country of residence if you believe our processing of your personal data violates 
            applicable law.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. California Privacy Rights (CCPA/CPRA)</h2>
          <p className="mb-4">
            If you are a California resident, you have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Right to Know:</strong> You may request disclosure of the categories and specific pieces of personal information we have collected about you, the categories of sources, purposes of collection, and categories of third parties with whom we share it.</li>
            <li><strong>Right to Delete:</strong> You may request deletion of your personal information, subject to certain exceptions.</li>
            <li><strong>Right to Correct:</strong> You may request correction of inaccurate personal information.</li>
            <li><strong>Right to Opt Out of Sale or Sharing:</strong> Logbloga <strong>does not sell</strong> your personal information. We do not sell or share your personal information for cross-context behavioral advertising as defined under the CCPA/CPRA.</li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights.</li>
          </ul>
          <p className="mb-4">
            To submit a request under the CCPA/CPRA, contact us at privacy@logbloga.com with 
            &quot;CCPA Request&quot; in the subject line and include your name, email, and the right(s) you 
            wish to exercise. We will verify your identity and respond as required by law.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
          <p className="mb-4">
            We use cookies and similar technologies to enhance your experience. For more information, 
            please see our <a href="/legal/cookies" className="text-primary underline">Cookie Policy</a>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal data 
            against unauthorized access, alteration, disclosure, or destruction. However, no method of 
            transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">10. Data Retention</h2>
          <p className="mb-4">
            We retain your personal data for as long as necessary to fulfill the purposes outlined in 
            this policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">11. Children&apos;s Privacy</h2>
          <p className="mb-4">
            Our services are not intended for children under the age of 13. We do not knowingly collect 
            personal information from children under 13.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">12. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify you of any changes by 
            posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
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
