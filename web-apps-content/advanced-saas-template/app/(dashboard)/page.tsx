import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        This template demonstrates multi-tenant architecture, AI integration, and a third-party integration example.
      </p>
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard/ai-demo" className="text-blue-600 hover:underline">
            AI example
          </Link>
          — Call the AI API with a prompt.
        </li>
        <li>
          <Link href="/dashboard/integration-demo" className="text-blue-600 hover:underline">
            Integration example
          </Link>
          — Outgoing API call pattern.
        </li>
      </ul>
    </div>
  );
}
