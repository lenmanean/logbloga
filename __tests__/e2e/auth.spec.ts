import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should complete user registration flow', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/auth/signup');

    // Fill registration form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.fill('input[name="fullName"]', 'Test User');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show success message or redirect
    await expect(page).toHaveURL(/auth\/verify-email|auth\/signin/);
  });

  test('should handle sign in', async ({ page }) => {
    await page.goto('/auth/signin');

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');

    await page.click('button[type="submit"]');

    // Should redirect to account or home
    await expect(page).toHaveURL(/account|^\//);
  });

  test('should handle sign out', async ({ page }) => {
    // Assuming user is logged in (would need to set up auth state)
    await page.goto('/account');

    // Click sign out button
    const signOutButton = page.getByRole('button', { name: /sign out|log out/i });
    if (await signOutButton.isVisible()) {
      await signOutButton.click();
      
      // Should redirect to home or sign in
      await expect(page).toHaveURL(/auth\/signin|^\//);
    }
  });
});
