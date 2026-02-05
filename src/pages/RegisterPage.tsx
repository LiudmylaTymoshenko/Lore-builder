import { useState } from 'react';
import { registerThunk } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerThunk({ email, password }));
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/Landing.png')" }}
    >
      <div className="w-full max-w-md bg-[#e2d0e4]/70  rounded-2xl shadow-lg p-8 space-y-6">
        {/* Back */}
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"
        >
          ← Back
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create account
          </h1>
          <p className="text-sm text-gray-500">
            Start building your own lore universe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            className="w-full rounded-lg border border-[#2b192e] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b192e] focus:border-transparent"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            className="w-full rounded-lg border border-[#2b192e] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b192e] focus:border-transparent"
          />

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-[#2b192e] py-2.5 text-sm font-medium text-white hover:bg-[#4d2854] transition"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#2b192e] hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
