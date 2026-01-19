/**
 * Abandoned Cart Email Template
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
import { formatCurrency, getProductUrl } from '../utils';
import type { AbandonedCartEmailData } from '../types';

interface AbandonedCartEmailProps {
  data: AbandonedCartEmailData;
}

export function AbandonedCartEmail({ data }: AbandonedCartEmailProps) {
  const { user, cartItems, discountCode } = data;
  const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Html>
      <Head />
      <Preview>Complete your purchase - Items waiting in your cart</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Don't forget your items!</Heading>
          <Text style={text}>
            Hi {user.name || 'there'},
          </Text>
          <Text style={text}>
            We noticed you left some items in your cart. Complete your purchase now before they're gone!
          </Text>

          <Section style={itemsSection}>
            <Heading style={h2}>Items in Your Cart</Heading>
            {cartItems.map((item, index) => {
              const productUrl = getProductUrl(item.productSlug);
              return (
                <Row key={index} style={itemRow}>
                  <Column style={itemName}>
                    <Link href={productUrl} style={productLink}>
                      <Text style={itemText}>{item.productName}</Text>
                    </Link>
                    <Text style={itemQuantity}>Quantity: {item.quantity}</Text>
                  </Column>
                  <Column style={itemPrice}>
                    <Text style={itemText}>{formatCurrency(item.price * item.quantity)}</Text>
                  </Column>
                </Row>
              );
            })}
          </Section>

          <Section style={totalSection}>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Total:</Text>
              </Column>
              <Column style={totalValue}>
                <Text style={totalText}>{formatCurrency(total)}</Text>
              </Column>
            </Row>
          </Section>

          {discountCode && (
            <Section style={discountSection}>
              <Text style={discountText}>
                Use code <strong>{discountCode}</strong> for a special discount!
              </Text>
            </Section>
          )}

          <Hr style={hr} />

          <Section style={actionsSection}>
            <Link href={checkoutUrl} style={button}>
              Complete Your Purchase
            </Link>
          </Section>

          <Text style={footer}>
            These items are reserved for a limited time. Complete your purchase to secure them!
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

const itemQuantity = {
  fontSize: '14px',
  color: '#666',
  margin: '4px 0 0',
};

const productLink = {
  color: '#000',
  textDecoration: 'none',
};

const totalSection = {
  margin: '30px 0',
  paddingTop: '20px',
  borderTop: '2px solid #e6ebf1',
};

const totalRow = {
  marginBottom: '8px',
};

const totalLabel = {
  fontSize: '18px',
  color: '#333',
  margin: '0',
  fontWeight: 'bold',
};

const totalValue = {
  textAlign: 'right' as const,
};

const totalText = {
  fontSize: '18px',
  color: '#333',
  margin: '0',
  fontWeight: 'bold',
};

const discountSection = {
  backgroundColor: '#f0fdf4',
  padding: '16px',
  borderRadius: '4px',
  margin: '20px 0',
  border: '1px solid #86efac',
};

const discountText = {
  fontSize: '16px',
  color: '#166534',
  margin: '0',
  textAlign: 'center' as const,
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
