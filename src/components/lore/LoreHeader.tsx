import { Link } from 'react-router-dom';
import type { Lore } from '../../features/lore/loreSlice';

export default function LoreHeader({ lore }: { lore: Lore }) {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:underline">
          ← Dashboard
        </Link>

        <div>
          <h1 className="text-lg font-semibold">{lore.name}</h1>
          <p className="text-sm text-gray-500">{lore.type}</p>
        </div>
      </div>
    </header>
  );
}
