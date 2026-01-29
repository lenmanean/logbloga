'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AIDemoPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setResult(data.result ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-4">AI Example</h1>
      <p className="text-gray-600 mb-4">
        Call the OpenAI API with a prompt. Set OPENAI_API_KEY in your environment.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Summarize SaaS in one sentence"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Calling…' : 'Submit'}
        </button>
      </form>
      {result !== null && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm font-medium text-gray-700 mb-1">Result</p>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{result}</p>
        </div>
      )}
      <p className="mt-4 text-sm text-gray-600">
        <Link href="/dashboard" className="underline">Back to dashboard</Link>
      </p>
    </div>
  );
}
