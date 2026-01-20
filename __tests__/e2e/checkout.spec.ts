import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete checkout process', async ({ page }) => {
    // Navigate to product page
    await page.goto('/ai-to-usd/packages/test-product');

    // Add to cart
    await page.click('button:has-text("Add to Cart")');

    // Go to cart
    await page.goto('/cart');

    // Verify item in cart
    await expect(page.locator('text=Test Product')).toBeVisible();

    // Proceed to checkout
    await page.click('button:has-text("Checkout")');

    // Fill customer information
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="name"]', 'Test User');

    // Continue to payment
    await page.click('button:has-text("Continue")');

    // Should show payment form or redirect to Stripe
    await expect(page).toHaveURL(/checkout|stripe/);
  });

  test('should apply discount code', async ({ page }) => {
    await page.goto('/checkout');

    // Enter discount code
    const discountInput = page.locator('input[placeholder*="discount" i], input[name*="discount" i]');
    if (await discountInput.isVisible()) {
      await discountInput.fill('SAVE10');
      await page.click('button:has-text("Apply")');

      // Should show discount applied
      await expect(page.locator('text=Discount')).toBeVisible();
    }
  });
});
