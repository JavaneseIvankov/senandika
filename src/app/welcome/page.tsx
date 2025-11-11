import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="mx-auto max-w-3xl text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AI Reflective Journal
          </h1>
          <p className="text-xl text-gray-600">
            Your personal AI companion for mindful reflection and self-discovery
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-6 sm:grid-cols-3 mt-12">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Memory</h3>
            <p className="text-sm text-gray-600">
              The AI remembers your past conversations and provides contextual
              responses
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2">Streaming Chat</h3>
            <p className="text-sm text-gray-600">
              Real-time AI responses that understand and empathize with your
              feelings
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Session Management
            </h3>
            <p className="text-sm text-gray-600">
              Organize your reflections into meaningful journaling sessions
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </Link>
        </div>

        {/* Benefits */}
        <div className="mt-16 space-y-4 text-left max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Why Use AI Reflective Journal?
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <p className="text-gray-700">
                <strong>Private & Secure:</strong> Your thoughts are protected
                with secure authentication
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <p className="text-gray-700">
                <strong>Contextual Understanding:</strong> AI remembers your
                past conversations using advanced RAG technology
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <p className="text-gray-700">
                <strong>Always Available:</strong> Your AI companion is ready
                24/7 to listen and reflect with you
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <p className="text-gray-700">
                <strong>Personal Growth:</strong> Track patterns, gain insights,
                and develop self-awareness over time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
