/**
 * Order Status Update Email Template
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
import { getOrderTrackingUrl } from '../utils';
import type { OrderStatusUpdateEmailData } from '../types';

interface OrderStatusUpdateEmailProps {
  data: OrderStatusUpdateEmailData;
}

const statusMessages: Record<string, string> = {
  pending: 'Your order is pending and awaiting payment confirmation.',
  processing: 'Your order is being processed and will be completed soon.',
  completed: 'Your order has been completed successfully!',
  cancelled: 'Your order has been cancelled.',
  refunded: 'Your order has been refunded.',
};

export function OrderStatusUpdateEmail({ data }: OrderStatusUpdateEmailProps) {
  const { order, previousStatus } = data;
  const orderTrackingUrl = getOrderTrackingUrl(order.id);
  const statusMessage = statusMessages[order.status] || 'Your order status has been updated.';

  return (
    <Html>
      <Head />
      <Preview>Order Status Update - {order.orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Status Update</Heading>
          <Text style={text}>
            Hi {order.customerName || 'there'},
          </Text>
          <Text style={text}>
            We have an update on your order.
          </Text>

          <Section style={statusSection}>
            <Text style={statusTitle}>Order #{order.orderNumber}</Text>
            {previousStatus && (
              <Text style={statusChange}>
                Status changed from <strong>{previousStatus}</strong> to <strong>{order.status}</strong>
              </Text>
            )}
            {!previousStatus && (
              <Text style={statusChange}>
                Current status: <strong>{order.status}</strong>
              </Text>
            )}
            <Text style={statusMessageText}>{statusMessage}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={actionsSection}>
            <Link href={orderTrackingUrl} style={button}>
              View Order Details
            </Link>
          </Section>

          <Text style={footer}>
            If you have any questions about your order, please don't hesitate to contact us.
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

const statusSection = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '20px 0',
};

const statusTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 12px',
};

const statusChange = {
  fontSize: '16px',
  color: '#666',
  margin: '8px 0',
  lineHeight: '24px',
};

const statusMessageText = {
  fontSize: '16px',
  color: '#333',
  margin: '12px 0 0',
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

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '40px 0 0',
};
