import { Link } from 'react-router-dom';
import type { Lore } from '../../types';
import { useAppSelector } from '../../app/hooks';
import { ArrowLeft } from 'lucide-react';

export default function LoreHeader({ lore }: { lore: Lore }) {
  const dirty = useAppSelector((s) => s.lore.dirty);
  return (
    <header className="relative flex items-center justify-between px-6 py-4 shadow-xl overflow-hidden bg-[#2b192e]/95 backdrop-blur-md border-b-2 border-white/20">
      <div className="flex w-full items-center gap-4 relative z-10">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 border-2 border-white/30 text-white font-medium transition-all text-sm whitespace-nowrap shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        <div className="w-full flex justify-between items-end">
          <div>
            <h1 className="text-xl font-bold text-white">
              {lore.name}
            </h1>
            <p className="text-base text-white/80 font-medium italic">{lore.type}</p>
          </div>

          <p className="text-sm text-white/70 italic font-semibold">
            {dirty ? 'Saving...' : 'Saved'}
          </p>
        </div>
      </div>
    </header>
  );
}