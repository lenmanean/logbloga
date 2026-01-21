/**
 * License Delivery Email Template
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';
import { formatEmailDate, getLibraryUrl, getProductUrl } from '../utils';
import type { LicenseEmailData } from '../types';

interface LicenseDeliveryEmailProps {
  data: LicenseEmailData;
}

export function LicenseDeliveryEmail({ data }: LicenseDeliveryEmailProps) {
  const { order, licenses } = data;
  const libraryUrl = getLibraryUrl();

  return (
    <Html>
      <Head />
      <Preview>Your License Keys - Order {order.orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your License Keys</Heading>
          <Text style={text}>
            Hi {order.customerName || 'there'},
          </Text>
          <Text style={text}>
            Thank you for your purchase! Your license keys are ready. You can access your products and download them from your library.
          </Text>

          <Section style={licensesSection}>
            <Heading style={h2}>Your Licenses</Heading>
            {licenses.map((license, index) => {
              const productUrl = getProductUrl(license.productSlug);
              return (
                <Section key={license.id} style={licenseCard}>
                  <Text style={productName}>{license.productName}</Text>
                  <Section style={licenseKeySection}>
                    <Text style={licenseKeyLabel}>License Key:</Text>
                    <Text style={licenseKey}>{license.licenseKey}</Text>
                  </Section>
                  <Link href={productUrl} style={productLink}>
                    View Product →
                  </Link>
                </Section>
              );
            })}
          </Section>

          {/* Doer Coupon Section */}
          {data.doerCouponCode && (
            <>
              <Hr style={hr} />
              <Section style={doerCouponSection}>
                <Heading style={h2}>🎉 Bonus: 6 Months Free Doer Pro</Heading>
                <Text style={text}>
                  As a thank you for purchasing a package, you've received a bonus coupon for 6 months of free Pro subscription on Doer.com!
                </Text>
                <Section style={couponCodeSection}>
                  <Text style={couponCodeLabel}>Your Coupon Code:</Text>
                  <Text style={couponCode}>{data.doerCouponCode}</Text>
                </Section>
                <Text style={couponInstructions}>
                  <strong>How to redeem:</strong>
                </Text>
                <Text style={couponInstructions}>
                  1. Visit <Link href="https://doer.com/checkout" style={link}>doer.com/checkout</Link>
                </Text>
                <Text style={couponInstructions}>
                  2. Apply the coupon code at checkout
                </Text>
                <Text style={couponInstructions}>
                  3. Enter your payment method (required for post-trial billing)
                </Text>
                <Text style={couponInstructions}>
                  4. Enjoy 6 months free Pro subscription!
                </Text>
                {data.doerCouponExpiresAt && (
                  <Text style={couponExpiry}>
                    Valid until: {new Date(data.doerCouponExpiresAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                )}
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Section style={actionsSection}>
            <Link href={libraryUrl} style={button}>
              Access Your Library
            </Link>
          </Section>

          <Section style={infoSection}>
            <Heading style={h3}>What's Next?</Heading>
            <Text style={infoText}>
              • Access your products from your library
            </Text>
            <Text style={infoText}>
              • Download your digital products
            </Text>
            <Text style={infoText}>
              • Use your license keys to activate your products
            </Text>
          </Section>

          <Text style={footer}>
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const h3 = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const licensesSection = {
  margin: '30px 0',
};

const licenseCard = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '16px 0',
  border: '1px solid #e6ebf1',
};

const productName = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 16px',
};

const licenseKeySection = {
  backgroundColor: '#ffffff',
  padding: '16px',
  borderRadius: '4px',
  margin: '12px 0',
  border: '1px solid #e6ebf1',
};

const licenseKeyLabel = {
  fontSize: '12px',
  color: '#666',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const licenseKey = {
  fontSize: '16px',
  fontFamily: 'monospace',
  color: '#000',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '1px',
};

const productLink = {
  color: '#000',
  fontSize: '14px',
  textDecoration: 'none',
  marginTop: '12px',
  display: 'inline-block',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const actionsSection = {
  margin: '30px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 8px 8px 0',
};

const infoSection = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '30px 0',
};

const infoText = {
  fontSize: '14px',
  color: '#666',
  margin: '8px 0',
  lineHeight: '24px',
};

const doerCouponSection = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #0ea5e9',
  borderRadius: '8px',
  padding: '20px',
  margin: '30px 0',
};

const couponCodeSection = {
  backgroundColor: '#ffffff',
  border: '1px solid #0ea5e9',
  borderRadius: '4px',
  padding: '16px',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const couponCodeLabel = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const couponCode = {
  fontSize: '24px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  color: '#0ea5e9',
  margin: '0',
  textAlign: 'center' as const,
};

const couponInstructions = {
  fontSize: '14px',
  color: '#333',
  lineHeight: '20px',
  margin: '8px 0',
};

const couponExpiry = {
  fontSize: '12px',
  color: '#666',
  margin: '12px 0 0',
  fontStyle: 'italic',
};

const link = {
  color: '#0ea5e9',
  textDecoration: 'underline',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '40px 0 0',
};
