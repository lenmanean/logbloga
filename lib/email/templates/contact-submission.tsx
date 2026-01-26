/**
 * Contact Submission Notification Email Template
 * Sent to support team when a new contact form submission is received
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
import { formatEmailDate } from '../utils';
import type { ContactSubmissionData } from '../types';

interface ContactSubmissionEmailProps {
  data: ContactSubmissionData;
}

export function ContactSubmissionEmail({ data }: ContactSubmissionEmailProps) {
  const { name, email, subject, message, ipAddress, submittedAt, submissionId } = data;
  const replyTo = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`;

  return (
    <Html>
      <Head />
      <Preview>New contact form submission: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>
          
          <Section style={infoSection}>
            <Text style={label}>From:</Text>
            <Text style={value}>{name} ({email})</Text>
            
            <Text style={label}>Subject:</Text>
            <Text style={value}>{subject}</Text>
            
            <Text style={label}>Submitted:</Text>
            <Text style={value}>{formatEmailDate(submittedAt)}</Text>
            
            {ipAddress && (
              <>
                <Text style={label}>IP Address:</Text>
                <Text style={value}>{ipAddress}</Text>
              </>
            )}
            
            <Text style={label}>Submission ID:</Text>
            <Text style={value}>{submissionId}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={messageSection}>
            <Heading style={h2}>Message</Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={actionsSection}>
            <Link href={replyTo} style={button}>
              Reply to {name}
            </Link>
          </Section>

          <Text style={footer}>
            This is an automated notification from the LogBloga contact form.
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

const infoSection = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '20px 0',
};

const label = {
  color: '#666',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '8px 0 4px',
};

const value = {
  color: '#333',
  fontSize: '14px',
  margin: '0 0 16px',
  lineHeight: '20px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const messageSection = {
  margin: '20px 0',
};

const messageText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const actionsSection = {
  margin: '30px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#ef4444',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const footer = {
  color: '#666',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '40px 0 0',
  textAlign: 'center' as const,
};
