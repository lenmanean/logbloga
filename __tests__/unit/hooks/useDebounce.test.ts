import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Still initial (debounced)

    // Fast-forward time - no need for waitFor with fake timers
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('should cancel previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'value1', delay: 500 },
      }
    );

    expect(result.current).toBe('value1');

    // Rapid changes
    act(() => {
      rerender({ value: 'value2', delay: 500 });
      vi.advanceTimersByTime(200);
    });
    
    act(() => {
      rerender({ value: 'value3', delay: 500 });
      vi.advanceTimersByTime(200);
    });
    
    act(() => {
      rerender({ value: 'value4', delay: 500 });
    });

    // Should still be initial value (not updated yet)
    expect(result.current).toBe('value1');

    // Fast-forward to after delay from last change
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('value4');
  });

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 200 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('updated');
  });
});
