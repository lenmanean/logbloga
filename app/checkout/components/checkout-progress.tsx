'use client';

import React from 'react';
import { useCheckout } from '@/contexts/checkout-context';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { number: 1, label: 'Cart Review' },
  { number: 2, label: 'Customer Info' },
  { number: 3, label: 'Order Review' },
] as const;

export function CheckoutProgress() {
  const { currentStep, setCurrentStep, validateStep } = useCheckout();

  const handleStepClick = (stepNumber: (typeof steps)[number]['number']) => {
    const canGoBack = stepNumber <= currentStep;
    const isNextStep = stepNumber === currentStep + 1;
    const canGoForwardToStep2 = isNextStep && stepNumber === 2 && validateStep(1);
    const canGoForwardToStep3 = isNextStep && stepNumber === 3 && validateStep(3);
    const canGoForward = canGoForwardToStep2 || canGoForwardToStep3;
    if (canGoBack || canGoForward) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isLast = index === steps.length - 1;
          const canGoBack = step.number <= currentStep;
          const isNextStep = step.number === currentStep + 1;
          const canGoForward =
            isNextStep &&
            (step.number === 2 ? validateStep(1) : validateStep(step.number));
          const canNavigate = canGoBack || canGoForward;

          return (
            <React.Fragment key={step.number}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => handleStepClick(step.number)}
                  disabled={!canNavigate}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                    canNavigate && 'cursor-pointer hover:opacity-90',
                    !canNavigate && 'cursor-default',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isActive && !isCompleted && 'border-primary bg-primary/10 text-primary',
                    !isActive && !isCompleted && 'border-muted-foreground/30 bg-background text-muted-foreground'
                  )}
                  aria-label={`Go to step ${step.number}: ${step.label}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </button>
                <span
                  className={cn(
                    'mt-2 text-sm font-medium',
                    isActive && 'text-foreground',
                    !isActive && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 transition-colors',
                    isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

