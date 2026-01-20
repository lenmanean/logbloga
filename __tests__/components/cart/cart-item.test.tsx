import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartItem } from '@/components/cart/cart-item';
import { createTestCartItem } from '@/__tests__/utils/fixtures/cart';

describe('CartItem Component', () => {
  const mockOnUpdate = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render cart item with product information', () => {
    const item = createTestCartItem({ quantity: 2 });
    item.product.title = 'Test Product';
    item.product.price = 99.99;

    render(
      <CartItem
        item={item}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should display quantity', () => {
    const item = createTestCartItem({ quantity: 3 });
    
    render(
      <CartItem
        item={item}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );

    const quantityInput = screen.getByDisplayValue('3');
    expect(quantityInput).toBeInTheDocument();
  });

  it('should call onUpdate when quantity changes', async () => {
    const user = userEvent.setup();
    const item = createTestCartItem({ quantity: 1 });
    
    render(
      <CartItem
        item={item}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );

    const quantityInput = screen.getByDisplayValue('1');
    await user.clear(quantityInput);
    await user.type(quantityInput, '2');
    await user.tab(); // Trigger blur

    expect(mockOnUpdate).toHaveBeenCalled();
  });

  it('should call onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const item = createTestCartItem();
    
    render(
      <CartItem
        item={item}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith(item.id);
  });

  it('should calculate and display total price', () => {
    const item = createTestCartItem({ quantity: 2 });
    item.product.price = 50;

    render(
      <CartItem
        item={item}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
      />
    );

    // Total should be 2 * 50 = 100
    expect(screen.getByText(/\$100/)).toBeInTheDocument();
  });
});
