import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | LogBloga',
  description: 'Terms and conditions for using LogBloga services.',
};

export default function TermsOfServicePage() {
  const lastUpdated = '2024-01-01';

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <p className="text-muted-foreground mb-8">
        Last updated: {lastUpdated}
      </p>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using LogBloga, you accept and agree to be bound by the terms and 
            provision of this agreement. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily use LogBloga for personal, non-commercial use only. 
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on LogBloga</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Products and Services</h2>
          <h3 className="text-xl font-semibold mb-3">3.1 Digital Products</h3>
          <p className="mb-4">
            Our digital products are provided for personal use. License keys are non-transferable 
            and tied to your account. Sharing or reselling license keys is prohibited.
          </p>

          <h3 className="text-xl font-semibold mb-3">3.2 Product Availability</h3>
          <p className="mb-4">
            We reserve the right to modify, suspend, or discontinue any product at any time without 
            notice. We are not liable for any loss resulting from such actions.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
          <p className="mb-4">
            To access certain features, you must create an account. You are responsible for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Payments and Billing</h2>
          <p className="mb-4">
            All payments are processed securely through Stripe. By making a purchase, you agree to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide valid payment information</li>
            <li>Authorize us to charge your payment method</li>
            <li>Pay all charges incurred by your account</li>
          </ul>
          <p className="mb-4">
            Prices are subject to change without notice. Refunds are handled according to our 
            <a href="/legal/refund" className="text-primary underline"> Refund Policy</a>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Prohibited Uses</h2>
          <p className="mb-4">You may not use our services:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
            <li>To collect or track the personal information of others</li>
            <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
          <p className="mb-4">
            All content on LogBloga, including but not limited to text, graphics, logos, images, 
            and software, is the property of LogBloga or its content suppliers and is protected by 
            international copyright laws.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">8. Disclaimer</h2>
          <p className="mb-4">
            The materials on LogBloga are provided on an &quot;as is&quot; basis. LogBloga makes no warranties, 
            expressed or implied, and hereby disclaims and negates all other warranties including, 
            without limitation, implied warranties or conditions of merchantability, fitness for a 
            particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">9. Limitations</h2>
          <p className="mb-4">
            In no event shall LogBloga or its suppliers be liable for any damages (including, without 
            limitation, damages for loss of data or profit, or due to business interruption) arising 
            out of the use or inability to use the materials on LogBloga, even if LogBloga or a 
            LogBloga authorized representative has been notified orally or in writing of the possibility 
            of such damage.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account and access to our services immediately, without 
            prior notice, for any breach of these Terms of Service. Upon termination, your right to 
            use the service will cease immediately.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
          <p className="mb-4">
            These terms shall be governed by and construed in accordance with the laws of [Your 
            Jurisdiction], without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mb-4">
            <strong>Email:</strong> legal@logbloga.com<br />
            <strong>Address:</strong> [Your Business Address]
          </p>
        </section>
      </div>
    </div>
  );
}
