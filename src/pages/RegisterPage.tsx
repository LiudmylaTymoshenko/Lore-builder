import { useState } from 'react';
import { registerThunk } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    dispatch(registerThunk({ email, password }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#E7E8E3]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border-2 border-[#3F4245]/10 p-8 space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#3F4245]/60 hover:text-[#3F4245] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#F64134] flex items-center justify-center">
              <span className="text-2xl font-bold text-white">L</span>
            </div>
            <h1 className="text-3xl font-bold text-[#3F4245]">
              Create account
            </h1>
          </div>
          <p className="text-[#3F4245]/60">
            Start building your own lore universe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#3F4245] mb-2">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
              required
              className="w-full rounded-lg border-2 border-[#3F4245]/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#718E92] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#3F4245] mb-2">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
              className="w-full rounded-lg border-2 border-[#3F4245]/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#718E92] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#3F4245] mb-2">
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
              className="w-full rounded-lg border-2 border-[#3F4245]/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#718E92] focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-[#F64134] hover:bg-[#d83a2f] py-3 text-sm font-bold text-white transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] mt-6"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-[#3F4245]/60">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#718E92] hover:text-[#5a7074] font-semibold transition-colors cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
