/**
 * DOER Pro 6-month coupon email (sent separately from payment receipt)
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
} from '@react-email/components';
import * as React from 'react';
import type { DoerCouponEmailData } from '../types';

interface DoerCouponEmailProps {
  data: DoerCouponEmailData;
}

export function DoerCouponEmail({ data }: DoerCouponEmailProps) {
  const { doerCouponCode, doerCouponExpiresAt, orderNumber } = data;
  const subjectOrder = orderNumber ? ` – Order ${orderNumber}` : '';

  return (
    <Html>
      <Head />
      <Preview>Your DOER Pro 6-month coupon{subjectOrder}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bonus: 6 Months Free DOER Pro</Heading>
          <Text style={text}>
            As a thank you for purchasing a package, you&apos;ve received a bonus coupon for 6 months of free Pro subscription on usedoer.com!
          </Text>
          <Section style={couponCodeSection}>
            <Text style={couponCodeLabel}>Your Coupon Code:</Text>
            <Text style={couponCode}>{doerCouponCode}</Text>
          </Section>
          <Text style={couponInstructions}>
            <strong>How to redeem:</strong>
          </Text>
          <Text style={couponInstructions}>
            1. Visit <Link href="https://usedoer.com/checkout?plan=pro&cycle=monthly" style={link}>usedoer.com/checkout</Link> (Pro Monthly or choose Pro Annual)
          </Text>
          <Text style={couponInstructions}>
            2. Enter your code in the Promo Code field at checkout
          </Text>
          <Text style={couponInstructions}>
            3. Enter your payment method (required for post-trial billing)
          </Text>
          <Text style={couponInstructions}>
            4. Enjoy 6 months free Pro subscription!
          </Text>
          {doerCouponExpiresAt && (
            <Text style={couponExpiry}>
              Valid until: {new Date(doerCouponExpiresAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  maxWidth: '560px',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
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
