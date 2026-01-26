import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | LogBloga',
  description: 'Terms and conditions for using LogBloga services.',
};

export default function TermsOfServicePage() {
  const lastUpdated = '2026-01-23';

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
            By accessing and using LogBloga, creating an account, or making a purchase, you explicitly 
            accept and agree to be bound by the terms and provisions of this agreement. Your acceptance 
            is indicated by checking the required checkbox during account creation or checkout. If you do 
            not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Use Rights</h2>
          <p className="mb-4">
            When you purchase a digital product from LogBloga, you receive lifetime access to that product. 
            You may use the products for personal and commercial purposes, including creating your own 
            templates, content, and business materials based on our products. However, you are subject to 
            the following restrictions:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>You may not resell or redistribute the products themselves</li>
            <li>You may not share your account or product access with others</li>
            <li>You may not attempt to reverse engineer any software contained in our products</li>
            <li>You may not remove any copyright or other proprietary notations from the materials</li>
            <li>You may not transfer product access to another person</li>
            <li>You may not use our products to create competing services that directly replicate our offerings</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Products and Services</h2>
          <h3 className="text-xl font-semibold mb-3">3.1 Digital Products</h3>
          <p className="mb-4">
            Our digital products are provided with lifetime access upon purchase. Product access is 
            tied to your account and is non-transferable. Sharing your account or product access is prohibited.
          </p>

          <h3 className="text-xl font-semibold mb-3">3.2 Product Availability</h3>
          <p className="mb-4">
            We reserve the right to modify, suspend, or discontinue any product at any time with reasonable 
            notice when possible. However, we are not liable for any loss resulting from such actions. 
            If you have already purchased a product, you will retain access to the version available at 
            the time of your purchase.
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
            <li>Pay in the currency displayed at checkout (USD)</li>
            <li>Understand that payment processing fees may apply and are non-refundable</li>
          </ul>
          <p className="mb-4">
            Prices are subject to change without notice. If a payment fails, we may attempt to process 
            it again or contact you to update your payment method. Refunds are handled according to our 
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
          <p className="mb-4">
            <strong>Business and Earnings Disclaimer:</strong> LogBloga makes no representations, warranties, 
            or guarantees regarding any level of business success, income, revenue, or profit that you may 
            achieve by using our products or services. Any revenue, profit, or earnings figures displayed 
            on our website are illustrative examples only and do not represent actual results you will achieve.
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
          <p className="mb-4">
            <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, LogBloga 
            shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
            or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of 
            data, use, goodwill, or other intangible losses. Our total liability for any claims arising 
            from or related to your use of our services shall not exceed the amount you paid to us in the 
            twelve (12) months preceding the claim.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account and access to our services immediately, without 
            prior notice, for any breach of these Terms of Service. Upon termination, your right to 
            use the service will cease immediately.
          </p>
          <p className="mb-4">
            <strong>User-Initiated Termination:</strong> You may terminate your account at any time by 
            contacting us at support@logbloga.com or using the account deletion feature in your account 
            settings. Upon termination, you will lose access to all purchased products and account data, 
            subject to our data retention policies.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law and Dispute Resolution</h2>
          <p className="mb-4">
            These terms shall be governed by and construed in accordance with the laws of Washington State, 
            United States, without regard to its conflict of law provisions.
          </p>
          <p className="mb-4">
            <strong>Dispute Resolution:</strong> Any disputes arising from or relating to these Terms or 
            your use of our services shall be resolved exclusively in the state and federal courts located 
            in Washington State. You consent to the personal jurisdiction of such courts. If you are 
            located outside the United States, you agree that any disputes will be resolved in accordance 
            with Washington State law.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mb-4">
            <strong>Email:</strong> support@logbloga.com (for all inquiries, including legal matters)<br />
            <strong>Response Time:</strong> We typically respond within 24-48 hours during business days
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            <em>Note: Business address will be provided upon request or when available.</em>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">13. Earnings and Results Disclaimer</h2>
          <p className="mb-4">
            <strong>No Guarantee of Income:</strong> LogBloga makes no representations, warranties, or 
            guarantees regarding any level of income, revenue, or profit that you may achieve by using 
            our products or services. Your success depends on numerous factors including your effort, 
            skill, experience, market conditions, competition, and many other variables beyond our control.
          </p>
          <p className="mb-4">
            <strong>Illustrative Figures Only:</strong> Any revenue, profit, or earnings figures displayed 
            on our website (including but not limited to &quot;Expected Revenue,&quot; &quot;Expected Profit,&quot; 
            or similar language) are illustrative examples only. These figures are based on hypothetical 
            scenarios, industry averages, or theoretical business models. They do not represent actual 
            results you will achieve, and are not a promise, guarantee, or prediction of your future earnings.
          </p>
          <p className="mb-4">
            <strong>Your Results Will Vary:</strong> Your actual results will depend on numerous factors 
            including but not limited to: your effort, skill, experience, market conditions, competition, 
            economic factors, and many other variables beyond our control. Past results of others do not 
            guarantee your future results. Individual results vary significantly.
          </p>
          <p className="mb-4">
            <strong>No Refund for Results:</strong> Refunds will not be granted based on your failure to 
            achieve any stated or implied earnings, revenue, or profit figures. You acknowledge that you 
            are purchasing educational content, templates, and tools, not a guarantee of business success 
            or income. Refunds are only available as specified in our Refund Policy.
          </p>
          <p className="mb-4">
            <strong>Assumption of Risk:</strong> By purchasing our products, you acknowledge that you 
            understand and accept the risks associated with starting or operating a business, and that 
            you are solely responsible for your business decisions and outcomes. You agree that LogBloga 
            shall not be liable for any business losses, lost profits, or other damages resulting from 
            your use of our products.
          </p>
        </section>
      </div>
    </div>
  );
}
