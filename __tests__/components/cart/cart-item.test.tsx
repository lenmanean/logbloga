import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartItem } from '@/components/cart/cart-item';
import { createTestCartItem } from '@/__tests__/utils/fixtures/cart';
import { renderWithProviders } from '@/__tests__/utils/test-utils';

const mockRemoveItem = vi.fn();

// Mock useCart hook but keep CartProvider for renderWithProviders
vi.mock('@/contexts/cart-context', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/contexts/cart-context')>();
  return {
    ...actual,
    useCart: () => ({
      removeItem: mockRemoveItem,
      items: [],
      isLoading: false,
      itemCount: 0,
      total: 0,
      addItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      refreshCart: vi.fn(),
    }),
  };
});

describe('CartItem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render cart item with product information', () => {
    const item = createTestCartItem({ quantity: 1 });
    item.product.title = 'Test Product';
    item.product.price = 99.99;

    renderWithProviders(<CartItem item={item} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();
  });

  it('should call removeItem when remove button is clicked', async () => {
    // Mock window.confirm to return true
    window.confirm = vi.fn(() => true);
    
    const user = userEvent.setup();
    const item = createTestCartItem();
    
    renderWithProviders(<CartItem item={item} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);

    expect(mockRemoveItem).toHaveBeenCalledWith(item.id);
  });

  it('should calculate and display line total', () => {
    const item = createTestCartItem({ quantity: 1 });
    item.product.price = 50;

    renderWithProviders(<CartItem item={item} />);

    expect(screen.getByText(/\$50/)).toBeInTheDocument();
  });
});
