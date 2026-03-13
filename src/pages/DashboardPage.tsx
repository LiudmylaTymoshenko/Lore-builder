import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { deleteLore, fetchLores, importLore } from '../features/lore/loreSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Trash2, Plus } from 'lucide-react';
import { LoreSpinner } from '../components/lore/LoreSpinner';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((s) => s.auth.user);
  const lores = useAppSelector((s) => s.lore.items ?? []);
  const loading = useAppSelector((s) => s.lore.loading);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (lores.length === 0) {
      dispatch(fetchLores());
    }
  }, [dispatch, lores.length]);

  const handleDelete = (id: string) => {
    dispatch(deleteLore(id));
  };

  const handleImportLore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedLore = JSON.parse(text);

      if (!importedLore.name || !importedLore.type) {
        throw new Error('Invalid lore file');
      }

      const payload = {
        ...importedLore,
        id: undefined,
      };
      dispatch(importLore(payload))
        .unwrap()
        .then((createdLore) => {
          navigate(`/lore/${createdLore.id}`);
        });
    } catch (err) {
      console.error(err);
      alert('Failed to import lore file');
    } finally {
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E7E8E3]">
        <LoreSpinner text="Synthesizing lores…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E7E8E3]">
      <header className="bg-white border-b-2 border-[#3F4245]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#F64134] flex items-center justify-center">
              <span className="text-xl font-bold text-white">L</span>
            </div>
            <h1 className="text-2xl font-bold text-[#3F4245]">Lore Builder</h1>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#3F4245]/60 text-sm">{user?.email}</span>
            <button
              onClick={() => dispatch(logout())}
              className="text-[#F64134] hover:text-[#3F4245] transition-colors cursor-pointer font-semibold text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl text-center md:text-left font-bold text-[#3F4245] mb-2">
              Your Lores
            </h2>
            <p className="text-[#3F4245]/60">
              Manage your worlds, events, and characters
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#F64134] hover:bg-[#d83a2f] text-white cursor-pointer px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Import from JSON
            </button>

            <input
              type="file"
              accept="application/json"
              ref={fileInputRef}
              onChange={handleImportLore}
              className="hidden"
            />
            <Link
              to="/lore/new"
              className="inline-flex items-center justify-center w-full md:w-fit gap-2 px-6 py-3 bg-[#F64134] hover:bg-[#d83a2f] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Create Lore
            </Link>
          </div>
        </div>

        <section>
          {lores.length === 0 ? (
            <div className="bg-white border-2 border-[#3F4245]/10 rounded-2xl p-16 text-center shadow-sm">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#B4BCAF]/20 border-2 border-[#718E92] flex items-center justify-center mx-auto">
                  <Plus className="w-10 h-10 text-[#718E92]" />
                </div>
                <h3 className="text-2xl font-bold text-[#3F4245]">
                  No lores yet
                </h3>
                <p className="text-[#3F4245]/60">
                  Create your first world to start building your lore with
                  events and characters.
                </p>
                <Link
                  to="/lore/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#718E92] hover:bg-[#5a7074] text-white rounded-xl font-bold transition-all shadow-lg mt-4"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Lore
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lores.map((lore) => (
                <div
                  key={lore.id}
                  className="group bg-white border-2 border-[#3F4245]/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg"
                >
                  {lore.imageUrl && (
                    <div className="relative h-48 overflow-hidden bg-[#C8C7C3]">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundImage: `url(${lore.imageUrl})` }}
                      />
                    </div>
                  )}

                  <div className="p-5 space-y-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(lore.id)}
                        className="p-2 cursor-pointer rounded-lg bg-[#E7E8E3] hover:bg-[#F64134]/10 border border-[#3F4245]/10 hover:border-[#F64134]/30 transition-all group/delete"
                      >
                        <Trash2 className="w-4 h-4 text-[#3F4245]/60 group-hover/delete:text-[#F64134] transition-colors" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-[#3F4245]">
                        {lore.name}
                      </h3>
                      <p className="text-sm text-[#718E92] font-semibold">
                        {lore.type}
                      </p>

                      {lore.sources && lore.sources.length > 0 && (
                        <div className="pt-2 space-y-1 border-t border-[#3F4245]/10">
                          {lore.sources.map((source, idx) => (
                            <p key={idx} className="text-xs text-[#3F4245]/60">
                              • {source.title}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/lore/${lore.id}`}
                      className="block w-full py-3 text-center bg-[#F64134] hover:bg-[#b93229] rounded-xl text-white font-bold transition-all shadow-md hover:shadow-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
