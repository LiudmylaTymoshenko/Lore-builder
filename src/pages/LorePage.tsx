import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import LoreHeader from '../components/lore/LoreHeader';
import LoreFlow from '../components/flow/LoreFlow';

export default function LorePage() {
  const { id } = useParams();

  const lore = useSelector((s: RootState) =>
    s.lore.items.find((l) => l.id === id),
  );

  if (!id || !lore) {
    return <div className="p-8">Lore not found</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <LoreHeader lore={lore} />

      <div className="flex flex-1 overflow-hidden">
        {/* <LoreSidebar loreId={lore.id} /> */}
        <LoreFlow loreId={lore.id} />
      </div>
    </div>
  );
}
