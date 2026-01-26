/**
 * Contact Confirmation Email Template
 * Auto-reply sent to user after they submit the contact form
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
import type { ContactConfirmationData } from '../types';

interface ContactConfirmationEmailProps {
  data: ContactConfirmationData;
}

export function ContactConfirmationEmail({ data }: ContactConfirmationEmailProps) {
  const { name, email, subject } = data;
  const appUrl = getAppUrl();
  const supportEmail = 'support@logbloga.com';

  return (
    <Html>
      <Head />
      <Preview>We received your message - Logbloga</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>We Received Your Message</Heading>
          
          <Text style={text}>
            Hi {name},
          </Text>
          
          <Text style={text}>
            Thank you for contacting Logbloga! We've received your message regarding <strong>"{subject}"</strong> and will get back to you as soon as possible.
          </Text>

          <Section style={infoSection}>
            <Text style={infoText}>
              <strong>What happens next?</strong>
            </Text>
            <Text style={infoText}>
              Our support team typically responds within <strong>24-48 hours</strong> during business days (Monday-Friday). We'll reply directly to this email address ({email}).
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={helpSection}>
            <Heading style={h2}>Need Immediate Assistance?</Heading>
            <Text style={helpText}>
              If your inquiry is urgent, please email us directly at{' '}
              <Link href={`mailto:${supportEmail}`} style={link}>
                {supportEmail}
              </Link>
              {' '}or check out our{' '}
              <Link href={`${appUrl}/resources/faq`} style={link}>
                FAQ page
              </Link>
              {' '}for quick answers to common questions.
            </Text>
          </Section>

          <Section style={resourcesSection}>
            <Heading style={h2}>Helpful Resources</Heading>
            <Text style={resourceItem}>
              • <Link href={`${appUrl}/resources/faq`} style={link}>Frequently Asked Questions</Link>
            </Text>
            <Text style={resourceItem}>
              • <Link href={`${appUrl}/resources/guides`} style={link}>Guides & Tutorials</Link>
            </Text>
            <Text style={resourceItem}>
              • <Link href={`${appUrl}/resources/community`} style={link}>Community Forum</Link>
            </Text>
          </Section>

          <Text style={footer}>
            Thank you for reaching out. We appreciate your patience and look forward to helping you!
          </Text>
          
          <Text style={footerSmall}>
            This is an automated confirmation email. Please do not reply to this message.
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

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const infoSection = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '20px 0',
};

const infoText = {
  fontSize: '14px',
  color: '#666',
  lineHeight: '24px',
  margin: '8px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const helpSection = {
  margin: '20px 0',
};

const helpText = {
  fontSize: '14px',
  color: '#666',
  lineHeight: '24px',
  margin: '0',
};

const resourcesSection = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '20px 0',
};

const resourceItem = {
  fontSize: '14px',
  color: '#666',
  margin: '8px 0',
  lineHeight: '24px',
};

const link = {
  color: '#ef4444',
  textDecoration: 'underline',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '40px 0 0',
  textAlign: 'center' as const,
};

const footerSmall = {
  color: '#999',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '10px 0 0',
  textAlign: 'center' as const,
};
