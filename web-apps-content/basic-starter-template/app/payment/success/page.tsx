import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. We've sent a confirmation email.
        </p>
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
