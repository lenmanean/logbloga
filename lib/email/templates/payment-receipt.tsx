/**
 * Payment Receipt Email Template
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
import { formatCurrency, formatEmailDate, getOrderTrackingUrl, getInvoiceUrl } from '../utils';
import type { OrderEmailData } from '../types';

interface PaymentReceiptEmailProps {
  data: OrderEmailData;
}

export function PaymentReceiptEmail({ data }: PaymentReceiptEmailProps) {
  const { order } = data;
  const orderTrackingUrl = getOrderTrackingUrl(order.id);
  const invoiceUrl = getInvoiceUrl(order.id);

  return (
    <Html>
      <Head />
      <Preview>Payment Receipt - {order.orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Receipt</Heading>
          <Text style={text}>
            Hi {order.customerName || 'there'},
          </Text>
          <Text style={text}>
            This is a confirmation that your payment has been successfully processed.
          </Text>

          <Section style={receiptSection}>
            <Text style={receiptTitle}>Payment Details</Text>
            <Text style={receiptItem}>
              <strong>Order Number:</strong> {order.orderNumber}
            </Text>
            <Text style={receiptItem}>
              <strong>Payment Date:</strong> {formatEmailDate(order.createdAt)}
            </Text>
            <Text style={receiptItem}>
              <strong>Amount Paid:</strong> {formatCurrency(order.totalAmount, order.currency)}
            </Text>
            <Text style={receiptItem}>
              <strong>Payment Status:</strong> <span style={successText}>Completed</span>
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={actionsSection}>
            <Link href={orderTrackingUrl} style={button}>
              View Order Details
            </Link>
            <Link href={invoiceUrl} style={secondaryButton}>
              Download Invoice
            </Link>
          </Section>

          <Text style={footer}>
            This receipt serves as confirmation of your payment. Please keep this email for your records.
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

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const receiptSection = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '20px 0',
};

const receiptTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 16px',
};

const receiptItem = {
  fontSize: '16px',
  color: '#333',
  margin: '8px 0',
  lineHeight: '24px',
};

const successText = {
  color: '#10b981',
  fontWeight: 'bold',
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

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '40px 0 0',
};
