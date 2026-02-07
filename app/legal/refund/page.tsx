import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Logbloga',
  description: 'Our refund policy for digital products: all sales are final except where required by applicable law.',
};

export default function RefundPolicyPage() {
  const lastUpdated = '2026-02-07';

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      
      <p className="text-muted-foreground mb-8">
        Last updated: {lastUpdated}
      </p>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. No Refunds — All Sales Final</h2>
          <p className="mb-4">
            <strong>All sales of digital products and intellectual property are final.</strong> No refunds 
            are offered except where required by applicable law. By purchasing from Logbloga, you 
            acknowledge and agree to this policy.
          </p>
          <p className="mb-4">
            <strong>Digital products</strong> include, but are not limited to: downloadable content (e.g., 
            PDFs, templates, guides), access to courses or learning materials, software, tools, and any 
            other intellectual property or digital goods provided by Logbloga. These products cannot 
            be returned or physically surrendered; once access is granted or content is delivered, the 
            sale is complete.
          </p>
          <p className="mb-4">
            <strong>Dissatisfaction, change of mind, or failure to achieve any results does not entitle 
            you to a refund.</strong> Refunds are only available as set out in Section 2 below.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Exception: Where Required by Law</h2>
          <p className="mb-4">
            Refunds may be provided only where <strong>applicable law</strong> in your jurisdiction 
            requires it. For example, some jurisdictions grant non-excludable rights such as a 
            statutory cooling-off period, rights in relation to defective digital content, or other 
            mandatory consumer protections (e.g., in the EU/EEA, UK, Australia, or elsewhere).
          </p>
          <p className="mb-4">
            If you believe you have a legally required right to a refund, please contact us at 
            support@logbloga.com with your <strong>order number</strong>, <strong>jurisdiction 
            (country/region)</strong>, and a brief explanation. We will review your request in light 
            of the applicable law. We do not guarantee any particular outcome; eligibility depends 
            on the law that applies to you. Any timeframe for legally required refunds (e.g., 14-day 
            rights where applicable) is determined by that law, not by a general satisfaction period.
          </p>
          <p className="mb-4">
            At our sole discretion, we may also address exceptional situations such as duplicate 
            charges or confirmed fraudulent or unauthorized use of your payment method. Such 
            resolution is not a guarantee and does not create a contractual right to a refund in 
            other circumstances.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. How to Contact Us About Refunds</h2>
          <p className="mb-4">
            For any refund-related inquiry (including where required by law), contact us at:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Email:</strong> support@logbloga.com</li>
            <li><strong>Subject:</strong> Refund Request - Order #[Order Number]</li>
          </ul>
          <p className="mb-4">
            Please include your order number or transaction ID, your country/region, and the basis 
            for your request (e.g., reference to applicable law or duplicate charge).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Refund Process (Where Applicable)</h2>
          <p className="mb-4">
            If a refund is granted (e.g., where required by law or at our discretion in exceptional 
            cases), we will process it to the original payment method. Processing times vary by 
            payment provider; credit card refunds often appear within 5–10 business days. We will 
            notify you when the refund has been processed. Upon refund, access to the relevant 
            product may be revoked.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Non-Refundable Circumstances</h2>
          <p className="mb-4">
            The following do <strong>not</strong> entitle you to a refund, except where applicable 
            law provides otherwise:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Dissatisfaction with the product or change of mind</li>
            <li>Failure to achieve any stated or implied earnings, revenue, or profit figures</li>
            <li>Having downloaded, used, or modified the product</li>
            <li>Having shared access or allowed others to use the product</li>
            <li>Any reason that is not a legally required right in your jurisdiction</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Chargebacks</h2>
          <p className="mb-4">
            If you initiate a chargeback through your payment provider instead of contacting us 
            first, we reserve the right to dispute the chargeback and may suspend or terminate 
            your account. We encourage you to contact us so we can address any issue in accordance 
            with this policy and applicable law.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. Access Revocation</h2>
          <p className="mb-4">
            If a refund is approved, access to the purchased product will be revoked, and you will 
            no longer be able to access the product content or downloads.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">8. Earnings and Results</h2>
          <p className="mb-4">
            <strong>No Refund for Business Results:</strong> Refunds will not be granted based on 
            your failure to achieve any stated or implied earnings, revenue, or profit figures 
            displayed on our website. Our products are educational content, templates, and tools. 
            We do not guarantee any level of business success, income, or financial results.
          </p>
          <p className="mb-4">
            Your purchase is made with the understanding that business outcomes vary based on 
            numerous factors including your effort, skill, experience, market conditions, and 
            other variables beyond our control. Individual results vary; past results of others do 
            not guarantee your future results. Dissatisfaction with your business results does not 
            constitute a valid reason for a refund under this policy.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this refund policy, please contact us at:
          </p>
          <p className="mb-4">
            <strong>Email:</strong> support@logbloga.com<br />
            <strong>Response Time:</strong> We typically respond within 24–48 hours during business days.
          </p>
        </section>
      </div>
    </div>
  );
}
