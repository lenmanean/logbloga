'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setLoading(false);
      return;
    }

    // Create payment intent on server
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 2000 }), // $20.00 in cents - adjust as needed
    });

    if (!response.ok) {
      setError('Failed to create payment intent');
      setLoading(false);
      return;
    }

    const { clientSecret } = await response.json();

    const { error: confirmError } = await stripe.confirmPayment({
      clientSecret,
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <PaymentElement />
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
