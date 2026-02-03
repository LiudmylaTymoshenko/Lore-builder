import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { deleteLore, fetchLores } from '../features/lore/loreSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Trash2 } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-100">
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
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <Link
            to="/lore/new"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
          >
            + Create Lore
          </Link>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Your lores</h2>

          {loading ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center">
              <p className="text-gray-500">Loading lores…</p>
            </div>
          ) : lores.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-8 text-center space-y-3">
              <p className="text-gray-500">You don’t have any lore yet.</p>
              <p className="text-sm text-gray-400">
                Create your first world to start adding events and characters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
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
                    <Trash2
                      onClick={() => handleDelete(lore.id)}
                      className="w-4 h-4 text-red-500 cursor-pointer"
                    />
                  </div>
                  <div className="my-4 p-2 rounded-xl bg-gray-50/70">
                    <h2 className="font-semibold text-lg">{lore.name}</h2>
                    <p className="text-sm text-gray-500 italic">{lore.type}</p>
                  </div>
                  <div className="flex w-full justify-end">
                    <Link
                      to={`/lore/${lore.id}`}
                      className="
                        inline-flex items-center gap-1
                        rounded-lg
                        bg-emerald-600 px-4 py-2
                        text-sm font-medium text-white
                        shadow-sm
                        transition
                        hover:bg-emerald-700
                        active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-emerald-400
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
