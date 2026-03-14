import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#E7E8E3]">
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#3F4245]/10 p-12 w-full max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-[#F64134] flex items-center justify-center mx-auto shadow-lg">
            <span className="text-4xl font-bold text-white">L</span>
          </div>
          <h1 className="text-4xl font-bold text-[#3F4245]">Lore Builder</h1>
        </div>

        <p className="text-[#3F4245]/60 text-lg max-w-md mx-auto">
          Build worlds. Connect events. Tell stories.
        </p>

        <div className="grid grid-cols-3 gap-4 py-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#3F4245]/60">
              Create Worlds
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#3F4245]/60">
              Link Events
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#3F4245]/60">
              Tell Stories
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#F64134] hover:bg-[#d83a2f] py-3 text-base font-bold text-white transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/login"
            className="block w-full rounded-xl border-2 border-[#3F4245]/20 hover:border-[#718E92] bg-white py-3 text-base font-semibold text-[#3F4245] hover:bg-[#E7E8E3] transition-all"
          >
            Login
          </Link>
        </div>

        <p className="text-xs text-[#3F4245]/40 pt-4">
          Organize your lore with visual timelines and character connections
        </p>
      </div>
    </div>
  );
}
