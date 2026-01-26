import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Logbloga',
  description: 'Our refund policy explains the terms and conditions for returns and refunds.',
};

export default function RefundPolicyPage() {
  const lastUpdated = '2026-01-23';

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      
      <p className="text-muted-foreground mb-8">
        Last updated: {lastUpdated}
      </p>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. Refund Eligibility</h2>
          <p className="mb-4">
            Due to the digital nature of our products, all sales are generally final. However, we 
            understand that exceptional circumstances may arise, and we will review refund requests 
            submitted within <strong>30 days</strong> of the purchase date on a case-by-case basis.
          </p>
          <p className="mb-4">
            Refunds may be considered in the following situations:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The product does not match its description</li>
            <li>The product is defective or non-functional</li>
            <li>Duplicate purchases due to technical errors</li>
            <li>Unauthorized purchase (fraudulent transaction)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Refund Timeframe</h2>
          <p className="mb-4">
            Refund requests must be submitted within <strong>30 days</strong> of the purchase date. 
            Requests submitted after this period will not be considered unless exceptional 
            circumstances apply.
          </p>
          <p className="mb-4">
            Processing times vary by payment method. Credit card refunds typically appear in your 
            account within 5-10 business days after approval, while other payment methods may take 
            longer. We will notify you once your refund has been processed.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. How to Request a Refund</h2>
          <p className="mb-4">
            To request a refund, please contact us at:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Email:</strong> support@logbloga.com</li>
            <li><strong>Subject:</strong> Refund Request - Order #[Order Number]</li>
          </ul>
          <p className="mb-4">
            Please include the following information in your request:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Order number or transaction ID</li>
            <li>Reason for refund request</li>
            <li>Supporting documentation (if applicable)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Refund Process</h2>
          <p className="mb-4">
            Once we receive your refund request:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>We will review your request within <strong>5 business days</strong></li>
            <li>We may contact you for additional information if needed</li>
            <li>If approved, the refund will be processed within <strong>10 business days</strong></li>
            <li>The refund will be issued to the original payment method</li>
          </ol>
          <p className="mb-4">
            Please note that it may take additional time for the refund to appear in your account, 
            depending on your payment provider. In some cases, partial refunds may be issued if only 
            a portion of your purchase qualifies for a refund.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Refund Methods</h2>
          <p className="mb-4">
            Refunds will be processed using the same payment method used for the original purchase. 
            If this is not possible, we will work with you to find an alternative solution.
          </p>
          <p className="mb-4">
            <strong>Timeline Expectations:</strong> After we process your refund, it typically takes 
            5-10 business days for the funds to appear in your account, depending on your payment provider 
            and financial institution. Some payment methods may take longer.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Non-Refundable Items</h2>
          <p className="mb-4">
            The following are not eligible for refunds:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Products downloaded more than 30 days after purchase</li>
            <li>Products that have been used or modified</li>
            <li>Products that have been shared or accessed by unauthorized users</li>
            <li>Refund requests based on failure to achieve stated or implied earnings, revenue, or profit figures</li>
            <li>Refund requests that do not meet our eligibility criteria</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. Chargebacks</h2>
          <p className="mb-4">
            If you initiate a chargeback through your payment provider instead of contacting us 
            directly, we reserve the right to dispute the chargeback and may suspend or terminate 
            your account.
          </p>
          <p className="mb-4">
            We encourage you to contact us first so we can resolve any issues promptly. We work 
            with payment processors to resolve disputes fairly and will provide all necessary 
            documentation to support our position.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">8. Access Revocation</h2>
          <p className="mb-4">
            Upon approval of a refund, access to the purchased product will be revoked, 
            and you will no longer be able to access the product content or downloads.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">9. Earnings and Results</h2>
          <p className="mb-4">
            <strong>No Refund for Business Results:</strong> Refunds will not be granted based on 
            your failure to achieve any stated or implied earnings, revenue, or profit figures 
            displayed on our website. Our products are educational content, templates, and tools. 
            We do not guarantee any level of business success, income, or financial results.
          </p>
          <p className="mb-4">
            Your purchase is made with the understanding that business outcomes vary based on numerous 
            factors including your effort, skill, experience, market conditions, competition, and 
            many other variables beyond our control. Individual results vary significantly, and past 
            results of others do not guarantee your future results.
          </p>
          <p className="mb-4">
            If you are dissatisfied with your business results after using our products, this does 
            not constitute a valid reason for a refund. Refunds are only available for the specific 
            circumstances outlined in Section 1 (Refund Eligibility) of this policy.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="mb-4">
            If you have questions about our refund policy, please contact us at:
          </p>
          <p className="mb-4">
            <strong>Email:</strong> support@logbloga.com<br />
            <strong>Response Time:</strong> We typically respond within 24-48 hours
          </p>
        </section>
      </div>
    </div>
  );
}
