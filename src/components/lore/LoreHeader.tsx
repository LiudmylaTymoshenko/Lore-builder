import { Link } from 'react-router-dom';
import type { Lore } from '../../types';
import { useAppSelector } from '../../app/hooks';
import { ArrowLeft } from 'lucide-react';

export default function LoreHeader({ lore }: { lore: Lore }) {
  const dirty = useAppSelector((s) => s.lore.dirty);

  const exportToJson = () => {
    const filename = `${lore.name}.json`;
    const jsonString = JSON.stringify(lore, null, 2);

    const blob = new Blob([jsonString], {
      type: 'application/json;charset=utf-8;',
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <header className="bg-white border-b-2 border-[#3F4245]/10 shadow-sm">
      <div className="mx-auto px-3 md:px-6 py-5 flex items-end justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#3F4245]/20 text-[#3F4245] font-semibold text-sm hover:bg-[#E7E8E3] transition-all whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#3F4245] truncate">
              {lore.name}
            </h1>
            <p className="text-sm text-[#718E92] font-semibold truncate">
              {lore.type}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-end gap-2 md:gap-6">
          <span
            className={`text-sm font-semibold transition-colors ${
              dirty ? 'text-[#F64134]' : 'text-[#3F4245]/50'
            }`}
          >
            {dirty ? 'Saving…' : 'Saved'}
          </span>
          <button
            onClick={exportToJson}
            className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#3F4245]/20 text-[#3F4245] font-semibold text-sm hover:bg-[#E7E8E3] transition-all whitespace-nowrap"
          >
            Export
          </button>
        </div>
      </div>
    </header>
  );
}
