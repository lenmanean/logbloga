'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (quantity: number) => void;
  className?: string;
}

export function QuantitySelector({ 
  min = 1, 
  max = 10, 
  defaultValue = 1,
  onChange,
  className 
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(defaultValue);

  const handleDecrease = () => {
    const newQuantity = Math.max(min, quantity - 1);
    setQuantity(newQuantity);
    onChange?.(newQuantity);
  };

  const handleIncrease = () => {
    const newQuantity = Math.min(max, quantity + 1);
    setQuantity(newQuantity);
    onChange?.(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      setQuantity(value);
      onChange?.(value);
    } else if (e.target.value === '') {
      setQuantity(min);
      onChange?.(min);
    }
  };

  const handleBlur = () => {
    if (quantity < min) {
      setQuantity(min);
      onChange?.(min);
    } else if (quantity > max) {
      setQuantity(max);
      onChange?.(max);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label htmlFor="quantity" className="text-sm font-medium text-muted-foreground">
        QTY
      </label>
      <div className="flex items-center border rounded-md">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 md:h-9 md:w-9 rounded-none rounded-l-md touch-manipulation"
          onClick={handleDecrease}
          disabled={quantity <= min}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease quantity</span>
        </Button>
        <Input
          id="quantity"
          type="number"
          min={min}
          max={max}
          value={quantity}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="h-10 w-16 md:h-9 md:w-16 text-center rounded-none border-x-0 border-y border-l-0 border-r-0 focus-visible:ring-0 text-base md:text-sm"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 md:h-9 md:w-9 rounded-none rounded-r-md touch-manipulation"
          onClick={handleIncrease}
          disabled={quantity >= max}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>
    </div>
  );
}

