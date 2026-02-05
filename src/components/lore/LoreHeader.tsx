import { Link } from 'react-router-dom';
import type { Lore } from '../../types';
import { useAppSelector } from '../../app/hooks';

export default function LoreHeader({ lore }: { lore: Lore }) {
  const dirty = useAppSelector((s) => s.lore.dirty);
  return (
    <header className="relative flex items-center justify-between px-6 py-4 shadow overflow-hidden bg-white">
      <div className="flex w-full items-center gap-4 relative z-10">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 whitespace-nowrap hover:underline"
        >
          ← Dashboard
        </Link>

        <div className="w-full flex justify-between items-end">
          <div>
            <h1 className="text-lg font-semibold">{lore.name}</h1>
            <p className="text-sm text-gray-500">{lore.type}</p>
          </div>

          <p className="text-sm text-gray-500 italic">
            {dirty ? 'Saving...' : 'Saved'}
          </p>
        </div>
      </div>
    </header>
  );
}
