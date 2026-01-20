# Testing Documentation

This directory contains all tests for the LogBloga e-commerce application.

## Test Structure

```
__tests__/
├── unit/              # Unit tests for utilities, hooks, and functions
├── integration/       # Integration tests for API routes and database
├── components/        # Component tests for React components
├── e2e/              # End-to-end tests using Playwright
├── security/         # Security-focused tests
├── performance/      # Performance tests
└── utils/            # Test utilities, mocks, and fixtures
```

## Running Tests

### All Tests
```bash
npm run test:all
```

### Unit and Integration Tests
```bash
npm run test
```

### With UI
```bash
npm run test:ui
```

### Coverage Report
```bash
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
```

### E2E Tests with UI
```bash
npm run test:e2e:ui
```

## Test Coverage Goals

- Overall code coverage: >80%
- Critical paths: >90%
- Utility functions: >95%
- API routes: >85%
- Components: >75%

## Writing Tests

### Unit Tests
Unit tests should test individual functions in isolation with mocked dependencies.

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { calculateTotal } from '@/lib/checkout/calculations';

describe('calculateTotal', () => {
  it('should calculate total correctly', () => {
    expect(calculateTotal(100, 10, 0)).toBe(90);
  });
});
```

### Integration Tests
Integration tests should test API routes with mocked external services.

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/cart/route';

describe('POST /api/cart', () => {
  it('should add item to cart', async () => {
    // Test implementation
  });
});
```

### Component Tests
Component tests should test React components with user interactions.

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render button', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### E2E Tests
E2E tests should test complete user flows.

Example:
```typescript
import { test, expect } from '@playwright/test';

test('should complete checkout', async ({ page }) => {
  await page.goto('/checkout');
  // Test flow
});
```

## Best Practices

1. **Test naming**: Use descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with clear setup, action, and assertion
3. **Isolation**: Each test should be independent and not rely on other tests
4. **Mocking**: Mock external dependencies (APIs, databases, etc.)
5. **Coverage**: Aim for high coverage but focus on testing critical paths
6. **Maintainability**: Keep tests simple and easy to understand

## Continuous Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests to main/develop branches

Test results and coverage are reported in GitHub Actions.
