import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartItem } from '@/components/cart/cart-item';
import { createTestCartItem } from '@/__tests__/utils/fixtures/cart';
import { renderWithProviders } from '@/__tests__/utils/test-utils';

const mockUpdateQuantity = vi.fn();
const mockRemoveItem = vi.fn();

// Mock useCart hook but keep CartProvider for renderWithProviders
vi.mock('@/contexts/cart-context', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/contexts/cart-context')>();
  return {
    ...actual,
    useCart: () => ({
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      items: [],
      isLoading: false,
      itemCount: 0,
      total: 0,
      addItem: vi.fn(),
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
    const item = createTestCartItem({ quantity: 2 });
    item.product.title = 'Test Product';
    item.product.price = 99.99;

    renderWithProviders(<CartItem item={item} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();
  });

  it('should display quantity', () => {
    const item = createTestCartItem({ quantity: 3 });
    
    renderWithProviders(<CartItem item={item} />);

    const quantityInput = screen.getByDisplayValue('3');
    expect(quantityInput).toBeInTheDocument();
  });

  it('should call updateQuantity when quantity changes', async () => {
    const user = userEvent.setup();
    const item = createTestCartItem({ quantity: 1 });

    renderWithProviders(<CartItem item={item} />);

    const increaseButton = screen.getByRole('button', { name: /increase quantity/i });
    await user.click(increaseButton);

    expect(mockUpdateQuantity).toHaveBeenCalledWith(item.id, 2);
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

  it('should calculate and display total price', () => {
    const item = createTestCartItem({ quantity: 2 });
    item.product.price = 50;

    renderWithProviders(<CartItem item={item} />);

    // Total should be 2 * 50 = 100
    expect(screen.getByText(/\$100/)).toBeInTheDocument();
  });
});
