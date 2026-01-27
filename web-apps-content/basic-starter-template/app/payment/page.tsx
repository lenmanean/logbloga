'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Complete Your Purchase
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your payment details below
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
}
