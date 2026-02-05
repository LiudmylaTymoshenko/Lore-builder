import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { deleteLore, fetchLores } from '../features/lore/loreSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Trash2 } from 'lucide-react';
import { LoreSpinner } from '../components/lore/LoreSpinner';

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((s) => s.auth.user);
  const lores = useAppSelector((s) => s.lore.items ?? []);
  const loading = useAppSelector((s) => s.lore.loading);

  useEffect(() => {
    if (lores.length === 0) {
      dispatch(fetchLores());
    }
  }, [dispatch, lores.length]);

  const handleDelete = (id: string) => {
    dispatch(deleteLore(id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f2f2]">
        <LoreSpinner text="Synthesizing lores…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2b192e]">
      <div
        className="fixed inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/Dashboard.png')" }}
      />

      <div className="relative z-10">
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10 shadow-xl">
          <div className="px-6 py-4 min-h-18 flex items-center justify-between box-border">
            <h1 className="text-xl font-bold text-white">Lore Builder</h1>

            <div className="flex items-center gap-6 text-sm">
              <span className="text-white/80">{user?.email}</span>
              <button
                onClick={() => dispatch(logout())}
                className="text-red-500/80 cursor-pointer hover:text-white transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto px-6 py-12">
          <div className="flex justify-end mb-8">
            <Link
              to="/lore/new"
              className="px-8 py-4 bg-[#7f5d86] hover:bg-[#2b192e] text-white rounded-xl font-bold text-base transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(107,63,112,0.5)] hover:scale-105"
            >
              + Create Lore
            </Link>
          </div>
          <section>
            {lores.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-12 text-center shadow-2xl">
                <p className="text-white text-xl mb-2 font-semibold">
                  You don't have any lore yet.
                </p>
                <p className="text-white/70 text-base">
                  Create your first world to start adding events and characters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lores.map((lore) => (
                  <div
                    key={lore.id}
                    className="group bg-white/15 backdrop-blur-lg border-2 border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                  >
                    {lore.imageUrl && (
                      <div className="relative h-40 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                          style={{ backgroundImage: `url(${lore.imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#2b192e]/30 to-[#2b192e]" />
                      </div>
                    )}

                    <div className="p-4 space-y-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(lore.id)}
                          className="p-2.5 cursor-pointer rounded-full bg-white/15 hover:bg-red-500/30 border-2 border-white/20 hover:border-red-400/60 transition-all group/delete shadow-lg"
                        >
                          <Trash2 className="w-5 h-5 text-white/80 group-hover/delete:text-red-300 transition-colors" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-white drop-shadow-md">
                          {lore.name}
                        </h3>
                        <p className="text-base text-white/80 font-semibold italic">
                          {lore.type}
                        </p>

                        {lore.sources && lore.sources.length > 0 && (
                          <div className="pt-2 space-y-1">
                            {lore.sources.map((source, idx) => (
                              <p
                                key={idx}
                                className="text-sm text-white/60 italic"
                              >
                                • {source.title}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/lore/${lore.id}`}
                        className="block w-full py-3 text-center bg-[#2b192e] hover:bg-[#7f5d86] rounded-xl text-white font-bold text-base transition-all shadow-lg hover:shadow-xl"
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
    </div>
  );
}
