/**
 * Order status timeline component
 * Visual timeline showing order status progression
 */

import { format } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';
import { getOrderStatusTimeline } from '@/lib/orders/status';
import type { Order } from '@/lib/types/database';
import { cn } from '@/lib/utils';

interface OrderStatusTimelineProps {
  order: Order;
  className?: string;
}

export function OrderStatusTimeline({
  order,
  className,
}: OrderStatusTimelineProps) {
  const timeline = getOrderStatusTimeline(order);

  if (timeline.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-sm font-semibold">Order Status</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        {/* Timeline items */}
        <div className="space-y-6">
          {timeline.map((entry, index) => {
            const isLast = index === timeline.length - 1;
            const isCompleted = entry.isCurrent || !isLast;

            return (
              <div key={`${entry.status}-${index}`} className="relative flex items-start gap-4">
                {/* Status icon */}
                <div className="relative z-10 flex-shrink-0">
                  {isCompleted ? (
                    <div className="rounded-full bg-primary p-1">
                      <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="rounded-full bg-muted p-1">
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Status content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className={cn(
                        'text-sm font-medium',
                        isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {entry.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(entry.timestamp, 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {entry.isCurrent && (
                      <span className="text-xs text-muted-foreground">Current</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

