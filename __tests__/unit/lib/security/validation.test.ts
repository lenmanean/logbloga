import { describe, it, expect } from 'vitest';
import {
  paginationSchema,
  uuidSchema,
  emailSchema,
  passwordSchema,
  productCreateSchema,
  orderCreateSchema,
  profileUpdateSchema,
} from '@/lib/security/validation';

describe('Validation Schemas', () => {
  describe('paginationSchema', () => {
    it('should validate valid pagination', () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 10 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('should set defaults', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('should reject invalid page', () => {
      const result = paginationSchema.safeParse({ page: 0 });
      expect(result.success).toBe(false);
    });

    it('should reject limit over 100', () => {
      const result = paginationSchema.safeParse({ limit: 101 });
      expect(result.success).toBe(false);
    });
  });

  describe('uuidSchema', () => {
    it('should validate valid UUID', () => {
      const result = uuidSchema.safeParse('00000000-0000-0000-0000-000000000001');
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const result = uuidSchema.safeParse('not-a-uuid');
      expect(result.success).toBe(false);
    });
  });

  describe('emailSchema', () => {
    it('should validate valid email', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test@example.com');
      }
    });

    it('should lowercase and trim email', () => {
      const result = emailSchema.safeParse('  TEST@EXAMPLE.COM  ');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test@example.com');
      }
    });

    it('should reject invalid email', () => {
      const result = emailSchema.safeParse('not-an-email');
      expect(result.success).toBe(false);
    });
  });

  describe('passwordSchema', () => {
    it('should validate strong password', () => {
      const result = passwordSchema.safeParse('Password123!');
      expect(result.success).toBe(true);
    });

    it('should reject short password', () => {
      const result = passwordSchema.safeParse('Pass1!');
      expect(result.success).toBe(false);
    });

    it('should reject password without uppercase', () => {
      const result = passwordSchema.safeParse('password123!');
      expect(result.success).toBe(false);
    });

    it('should reject password without lowercase', () => {
      const result = passwordSchema.safeParse('PASSWORD123!');
      expect(result.success).toBe(false);
    });

    it('should reject password without number', () => {
      const result = passwordSchema.safeParse('Password!');
      expect(result.success).toBe(false);
    });

    it('should reject password without special character', () => {
      const result = passwordSchema.safeParse('Password123');
      expect(result.success).toBe(false);
    });
  });

  describe('productCreateSchema', () => {
    it('should validate valid product', () => {
      const product = {
        slug: 'test-product',
        title: 'Test Product',
        category: 'web-apps',
        price: 99.99,
      };
      const result = productCreateSchema.safeParse(product);
      expect(result.success).toBe(true);
    });

    it('should reject invalid slug', () => {
      const product = {
        slug: 'Test Product', // Invalid: contains spaces and uppercase
        title: 'Test Product',
        category: 'web-apps',
        price: 99.99,
      };
      const result = productCreateSchema.safeParse(product);
      expect(result.success).toBe(false);
    });

    it('should reject negative price', () => {
      const product = {
        slug: 'test-product',
        title: 'Test Product',
        category: 'web-apps',
        price: -10,
      };
      const result = productCreateSchema.safeParse(product);
      expect(result.success).toBe(false);
    });
  });

  describe('orderCreateSchema', () => {
    it('should validate valid order', () => {
      const order = {
        items: [
          {
            product_id: '00000000-0000-0000-0000-000000000001',
            quantity: 1,
          },
        ],
        customer_email: 'test@example.com',
        customer_name: 'Test User',
      };
      const result = orderCreateSchema.safeParse(order);
      expect(result.success).toBe(true);
    });

    it('should reject empty items array', () => {
      const order = {
        items: [],
        customer_email: 'test@example.com',
        customer_name: 'Test User',
      };
      const result = orderCreateSchema.safeParse(order);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const order = {
        items: [
          {
            product_id: '00000000-0000-0000-0000-000000000001',
            quantity: 1,
          },
        ],
        customer_email: 'invalid-email',
        customer_name: 'Test User',
      };
      const result = orderCreateSchema.safeParse(order);
      expect(result.success).toBe(false);
    });
  });

  describe('profileUpdateSchema', () => {
    it('should validate valid profile update', () => {
      const profile = {
        full_name: 'John Doe',
        avatar_url: 'https://example.com/avatar.jpg',
      };
      const result = profileUpdateSchema.safeParse(profile);
      expect(result.success).toBe(true);
    });

    it('should allow partial updates', () => {
      const profile = {
        full_name: 'John Doe',
      };
      const result = profileUpdateSchema.safeParse(profile);
      expect(result.success).toBe(true);
    });

    it('should reject invalid URL', () => {
      const profile = {
        avatar_url: 'not-a-url',
      };
      const result = profileUpdateSchema.safeParse(profile);
      expect(result.success).toBe(false);
    });
  });
});
