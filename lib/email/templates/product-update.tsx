/**
 * Product Update Email Template
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
import { getProductUrl } from '../utils';
import type { ProductUpdateEmailData } from '../types';

interface ProductUpdateEmailProps {
  data: ProductUpdateEmailData;
}

export function ProductUpdateEmail({ data }: ProductUpdateEmailProps) {
  const { user, product } = data;
  const productUrl = getProductUrl(product.slug);

  return (
    <Html>
      <Head />
      <Preview>Product Update - {product.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Product Update</Heading>
          <Text style={text}>
            Hi {user.name || 'there'},
          </Text>
          <Text style={text}>
            We have an important update about a product you own or are interested in.
          </Text>

          <Section style={productSection}>
            <Text style={productName}>{product.name}</Text>
            {product.description && (
              <Text style={productDescription}>{product.description}</Text>
            )}
          </Section>

          <Hr style={hr} />

          <Section style={actionsSection}>
            <Link href={productUrl} style={button}>
              View Product
            </Link>
          </Section>

          <Text style={footer}>
            Thank you for being a valued customer!
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

const productSection = {
  backgroundColor: '#f6f9fc',
  padding: '20px',
  borderRadius: '4px',
  margin: '20px 0',
};

const productName = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 12px',
};

const productDescription = {
  fontSize: '14px',
  color: '#666',
  lineHeight: '24px',
  margin: '0',
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
