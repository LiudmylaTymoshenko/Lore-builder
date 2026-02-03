import { useParams } from 'react-router-dom';
import LoreHeader from '../components/lore/LoreHeader';
import LoreFlow from '../components/flow/LoreFlow';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getLore, setActiveLore } from '../features/lore/loreSlice';

export default function LorePage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((s) => s.lore.loading);
  const lore = useAppSelector((s) => s.lore.current);

  useEffect(() => {
    if (id) {
      dispatch(setActiveLore(id));
      dispatch(getLore(id));
    }
  }, [id, dispatch]);

  if (!id) return <div className="p-8">Lore not found</div>;
  if (isLoading) return <div className="p-8">Loading…</div>;
  if (!lore) return <div className="p-8">Lore not found</div>;

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <LoreHeader lore={lore} />
      <div className="flex flex-1 overflow-hidden">
        <LoreFlow loreId={lore.id} />
      </div>
    </div>
  );
}
