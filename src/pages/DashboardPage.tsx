import { addLore } from '../features/lore/loreSlice';
import { useState } from 'react';
import { logout } from '../features/auth/authSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const lores = useAppSelector((s) =>
    s.lore.filter((l) => l.ownerId === user?.id),
  );

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const handleCreate = () => {
    if (!name || !type || !user) return;

    dispatch(
      addLore({
        name,
        type,
        ownerId: user.id,
      }),
    );

    setName('');
    setType('');
  };

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
          <h2 className="text-lg font-semibold">Create new lore</h2>

          <div className="flex gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lore name"
              className="flex-1 rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Type (Fantasy, Sci-Fi, etc)"
              className="flex-1 rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <button
              onClick={handleCreate}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>
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
