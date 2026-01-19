'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Trash2, CheckCircle2, XCircle, Download } from 'lucide-react';

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ElementType;
  variant?: 'default' | 'destructive';
  onClick: (selectedIds: string[]) => void | Promise<void>;
}

interface BulkActionsProps {
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onClearSelection: () => void;
  totalItems: number;
  actions: BulkAction[];
  isLoading?: boolean;
}

export function BulkActions({
  selectedIds,
  onSelectAll,
  onClearSelection,
  totalItems,
  actions,
  isLoading = false,
}: BulkActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const allSelected = selectedIds.length === totalItems && totalItems > 0;
  const someSelected = selectedIds.length > 0 && selectedIds.length < totalItems;

  const handleAction = async (action: BulkAction) => {
    if (selectedIds.length === 0) return;

    setIsProcessing(true);
    try {
      await action.onClick(selectedIds);
      onClearSelection();
    } catch (error) {
      console.error('Error executing bulk action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all"
          checked={allSelected}
          onCheckedChange={(checked) => onSelectAll(checked === true)}
          ref={(el) => {
            if (el) {
              (el as any).indeterminate = someSelected;
            }
          }}
        />
        <Label htmlFor="select-all" className="text-sm font-medium">
          {selectedIds.length > 0
            ? `${selectedIds.length} selected`
            : 'Select all'}
        </Label>
        {selectedIds.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={isProcessing}
          >
            Clear
          </Button>
        )}
      </div>

      {selectedIds.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isProcessing}>
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Actions ({selectedIds.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actions.map((action) => {
              const Icon = action.icon || MoreHorizontal;
              return (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => handleAction(action)}
                  className={action.variant === 'destructive' ? 'text-destructive' : ''}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

