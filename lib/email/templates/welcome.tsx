/**
 * Welcome Email Template
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
} from '@react-email/components';
import * as React from 'react';
import { getAppUrl } from '../client';
import type { WelcomeEmailData } from '../types';

interface WelcomeEmailProps {
  data: WelcomeEmailData;
}

export function WelcomeEmail({ data }: WelcomeEmailProps) {
  const { user } = data;
  const appUrl = getAppUrl();
  const dashboardUrl = `${appUrl}/account`;
  const libraryUrl = `${appUrl}/account/library`;

  return (
    <Html>
      <Head />
      <Preview>Welcome to LogBloga!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to LogBloga!</Heading>
          <Text style={text}>
            Hi {user.name || 'there'},
          </Text>
          <Text style={text}>
            We're thrilled to have you join our community! LogBloga is your destination for digital products, technology insights, and productivity tools.
          </Text>

          <Section style={featuresSection}>
            <Heading style={h2}>What You Can Do</Heading>
            <Text style={featureItem}>
              ✓ Browse our collection of digital products
            </Text>
            <Text style={featureItem}>
              ✓ Access your purchased products from your library
            </Text>
            <Text style={featureItem}>
              ✓ Manage your licenses and downloads
            </Text>
            <Text style={featureItem}>
              ✓ Track your orders and invoices
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={actionsSection}>
            <Link href={dashboardUrl} style={button}>
              Go to Dashboard
            </Link>
            <Link href={libraryUrl} style={secondaryButton}>
              View Library
            </Link>
          </Section>

          <Section style={helpSection}>
            <Heading style={h3}>Need Help?</Heading>
            <Text style={helpText}>
              If you have any questions, our support team is here to help. Just reply to this email or visit our help center.
            </Text>
          </Section>

          <Text style={footer}>
            Thank you for choosing LogBloga. We're excited to have you on board!
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

const featuresSection = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '20px 0',
};

const featureItem = {
  fontSize: '14px',
  color: '#666',
  margin: '8px 0',
  lineHeight: '24px',
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

const secondaryButton = {
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 8px 8px 0',
  border: '1px solid #e6ebf1',
};

const helpSection = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '30px 0',
};

const helpText = {
  fontSize: '14px',
  color: '#666',
  lineHeight: '24px',
  margin: '0',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '40px 0 0',
};
