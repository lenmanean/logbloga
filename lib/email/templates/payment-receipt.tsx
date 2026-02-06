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
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';
import { formatCurrency, formatEmailDate, getOrderTrackingUrl, getInvoiceUrl, getLibraryUrl } from '../utils';
import type { OrderEmailData } from '../types';

interface PaymentReceiptEmailProps {
  data: OrderEmailData;
}

export function PaymentReceiptEmail({ data }: PaymentReceiptEmailProps) {
  const { order, items } = data;
  const orderTrackingUrl = getOrderTrackingUrl(order.id);
  const invoiceUrl = getInvoiceUrl(order.id);
  const libraryUrl = getLibraryUrl();

  return (
    <Html>
      <Head />
      <Preview>Thank you for your purchase! Receipt and digital products - {order.orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Your Purchase!</Heading>
          <Text style={text}>
            Hi {order.customerName || 'there'},
          </Text>
          <Text style={text}>
            Thank you for your purchase! Your payment has been successfully processed and your digital products are now available.
          </Text>

          <Section style={orderDetails}>
            <Text style={orderNumber}>Order #{order.orderNumber}</Text>
            <Text style={orderDate}>Purchased on {formatEmailDate(order.createdAt)}</Text>
          </Section>

          <Section style={itemsSection}>
            <Heading style={h2}>Order Items</Heading>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemName}>
                  <Text style={itemText}>{item.productName}</Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={itemText}>{formatCurrency(item.total, order.currency)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={totalsSection}>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Subtotal:</Text>
              </Column>
              <Column style={totalValue}>
                <Text style={totalText}>{formatCurrency(order.subtotal, order.currency)}</Text>
              </Column>
            </Row>
            {(order.discountAmount ?? 0) > 0 && (
              <Row style={totalRow}>
                <Column>
                  <Text style={totalLabel}>Discount:</Text>
                </Column>
                <Column style={totalValue}>
                  <Text style={totalText}>-{formatCurrency(order.discountAmount ?? 0, order.currency)}</Text>
                </Column>
              </Row>
            )}
            {(order.taxAmount ?? 0) > 0 && (
              <Row style={totalRow}>
                <Column>
                  <Text style={totalLabel}>Tax:</Text>
                </Column>
                <Column style={totalValue}>
                  <Text style={totalText}>{formatCurrency(order.taxAmount ?? 0, order.currency)}</Text>
                </Column>
              </Row>
            )}
            <Row style={{ ...totalRow, ...finalTotalRow }}>
              <Column>
                <Text style={finalTotalLabel}>Total:</Text>
              </Column>
              <Column style={totalValue}>
                <Text style={finalTotalText}>{formatCurrency(order.totalAmount, order.currency)}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={actionsSection}>
            <Link href={libraryUrl} style={button}>
              Access Your Digital Products
            </Link>
            <Link href={orderTrackingUrl} style={secondaryButton}>
              View Order Details
            </Link>
            <Link href={invoiceUrl} style={secondaryButton}>
              Download Invoice
            </Link>
          </Section>

          <Text style={footer}>
            This receipt serves as confirmation of your payment. Your digital products are available in your account library. Please keep this email for your records.
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

const orderDetails = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '20px 0',
};

const orderNumber = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 8px',
};

const orderDate = {
  fontSize: '14px',
  color: '#666',
  margin: '0',
};

const itemsSection = {
  margin: '30px 0',
};

const itemRow = {
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #e6ebf1',
};

const itemName = {
  width: '70%',
};

const itemPrice = {
  width: '30%',
  textAlign: 'right' as const,
};

const itemText = {
  fontSize: '16px',
  color: '#333',
  margin: '0',
};

const totalsSection = {
  margin: '30px 0',
  paddingTop: '20px',
  borderTop: '2px solid #e6ebf1',
};

const totalRow = {
  marginBottom: '8px',
};

const totalLabel = {
  fontSize: '16px',
  color: '#666',
  margin: '0',
};

const totalValue = {
  textAlign: 'right' as const,
};

const totalText = {
  fontSize: '16px',
  color: '#333',
  margin: '0',
  fontWeight: '500',
};

const finalTotalRow = {
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '2px solid #e6ebf1',
};

const finalTotalLabel = {
  fontSize: '18px',
  color: '#333',
  margin: '0',
  fontWeight: 'bold',
};

const finalTotalText = {
  fontSize: '18px',
  color: '#333',
  margin: '0',
  fontWeight: 'bold',
};

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '40px 0 0',
};
