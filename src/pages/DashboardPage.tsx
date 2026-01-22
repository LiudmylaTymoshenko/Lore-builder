import { logout } from '../features/auth/authSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const lores = useAppSelector((s) =>
    s.lore.filter((l) => l.ownerId === user?.id),
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
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
        {/* Create Lore */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <Link
            to="/lore/new"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
          >
            + Create Lore
          </Link>
        </div>

        {/* Lore list */}
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
            <div className="grid grid-cols-3 gap-6">
              {lores.map((lore) => (
                <div
                  key={lore.id}
                  className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition cursor-pointer"
                >
                  <h3 className="font-semibold text-lg">{lore.name}</h3>
                  <p className="text-sm text-gray-500">{lore.type}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
