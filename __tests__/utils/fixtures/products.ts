import type { Product } from '@/lib/types/database';

/**
 * Create a test product
 */
export function createTestProduct(overrides?: Partial<Product>): Product {
  return {
    id: '00000000-0000-0000-0000-000000000010',
    slug: 'test-product',
    title: 'Test Product',
    description: 'This is a test product',
    category: 'web-apps',
    price: 99.99,
    original_price: 149.99,
    duration: '10 hours',
    content_hours: '10',
    package_image: 'https://example.com/image.png',
    images: ['https://example.com/image1.png'],
    tagline: 'A great test product',
    pricing_justification: 'Great value',
    rating: 4.5,
    review_count: 10,
    featured: false,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  } as Product;
}

/**
 * Create multiple test products
 */
export function createTestProducts(count: number = 3): Product[] {
  return Array.from({ length: count }, (_, i) =>
    createTestProduct({
      id: `00000000-0000-0000-0000-${String(i + 10).padStart(12, '0')}`,
      slug: `test-product-${i + 1}`,
      title: `Test Product ${i + 1}`,
      price: (i + 1) * 50,
    })
  );
}
