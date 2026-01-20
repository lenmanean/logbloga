import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | LogBloga',
  description: 'Our refund policy explains the terms and conditions for returns and refunds.',
};

export default function RefundPolicyPage() {
  const lastUpdated = '2024-01-01';

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
            on a case-by-case basis.
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
            depending on your payment provider.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Refund Methods</h2>
          <p className="mb-4">
            Refunds will be processed using the same payment method used for the original purchase. 
            If this is not possible, we will work with you to find an alternative solution.
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
            <li>License keys that have been shared or transferred</li>
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
            We encourage you to contact us first so we can resolve any issues promptly.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">8. License Revocation</h2>
          <p className="mb-4">
            Upon approval of a refund, any license keys associated with the purchase will be 
            deactivated, and access to the product will be revoked.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
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
