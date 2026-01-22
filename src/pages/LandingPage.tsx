import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-semibold text-gray-900">Lore Builder</h1>

        <p className="text-gray-500 text-sm">
          Build worlds. Connect events. Tell stories.
        </p>

        <div className="space-y-3">
          <Link
            to="/login"
            className="block w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="block w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
