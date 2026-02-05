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
        <LoreSpinner text='Synthesizing lores…' />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f2f2]">
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-semibold">Lore Builder</h1>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">{user?.email}</span>
          <button
            onClick={() => dispatch(logout())}
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-8 max-w-6xl mx-auto space-y-8">
        <Link
          to="/lore/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2b192e] px-4 py-2 text-white hover:bg-[#543859] transition"
        >
          + Create Lore
        </Link>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Your lores</h2>

          {lores.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center space-y-3">
              <p className="text-gray-500">You don’t have any lore yet.</p>
              <p className="text-sm text-gray-400">
                Create your first world to start adding events and characters.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {lores.map((lore) => (
                <div
                  key={lore.id}
                  className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
                  style={
                    lore.imageUrl
                      ? { backgroundImage: `url(${lore.imageUrl})` }
                      : undefined
                  }
                >
                  <div className="flex w-full justify-end">
                    <div className=" rounded-full bg-gray-50/70 p-1">
                      <Trash2
                        onClick={() => handleDelete(lore.id)}
                        className="w-4 h-4 text-red-500 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="my-4 p-2 rounded-xl bg-gray-50/70">
                    <h2 className="font-semibold text-lg">{lore.name}</h2>
                    <p className="text-sm text-gray-500 italic">{lore.type}</p>
                    {lore.sources?.map((source) => (
                      <p className="text-sm text-gray-500 italic text-end">
                        {source.title}
                      </p>
                    ))}
                  </div>
                  <div className="flex w-full justify-end">
                    <Link
                      to={`/lore/${lore.id}`}
                      className="
                        inline-flex items-center gap-1
                        rounded-lg
                        bg-[#50006c] px-4 py-2
                        text-sm font-medium text-white
                        shadow-sm
                        transition
                        hover:bg-[#6c0293]
                        active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-[#9700ce]
                        "
                    >
                      Details
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
