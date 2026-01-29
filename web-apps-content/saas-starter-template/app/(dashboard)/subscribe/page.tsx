'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data.error ?? 'Failed to create checkout session');
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold mb-4">Subscribe</h1>
      <p className="text-gray-600 mb-6">
        Choose a plan and complete checkout with Stripe.
      </p>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full py-2 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Redirecting…' : 'Go to checkout'}
      </button>
      <p className="mt-4 text-sm text-gray-600">
        <Link href="/dashboard" className="underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
