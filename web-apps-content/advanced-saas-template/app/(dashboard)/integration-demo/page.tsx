'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function IntegrationDemoPage() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCall() {
    setError(null);
    setData(null);
    setLoading(true);
    try {
      const res = await fetch('/api/integrations/example');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Request failed');
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Integration Example</h1>
      <p className="text-gray-600 mb-4">
        Example of an outgoing API call to a third-party service. Set EXTERNAL_API_URL (and optionally EXTERNAL_API_KEY) in your environment to call a real API.
      </p>
      <button
        onClick={handleCall}
        disabled={loading}
        className="py-2 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Calling…' : 'Call integration'}
      </button>
      {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
      {data !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      <p className="mt-4 text-sm text-gray-600">
        <Link href="/dashboard" className="underline">Back to dashboard</Link>
      </p>
    </div>
  );
}
