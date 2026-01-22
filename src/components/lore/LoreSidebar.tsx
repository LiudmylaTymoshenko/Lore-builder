import { useState } from 'react';
import { addEvent } from '../../features/events/eventsSlice';
import { addCharacter } from '../../features/characters/charactersSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

export default function LoreSidebar({ loreId }: { loreId: string }) {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'events' | 'characters'>('events');

  const events = useAppSelector((s) =>
    s.events.filter((e) => e.loreId === loreId),
  );

  const characters = useAppSelector((s) =>
    s.characters.filter((c) => c.loreId === loreId),
  );

  return (
    <aside className="w-72 bg-white border-r p-4 space-y-4 overflow-y-auto">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('events')}
          className={`flex-1 rounded px-2 py-1 text-sm ${
            tab === 'events' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
          }`}
        >
          Events
        </button>

        <button
          onClick={() => setTab('characters')}
          className={`flex-1 rounded px-2 py-1 text-sm ${
            tab === 'characters' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
          }`}
        >
          Characters
        </button>
      </div>

      {/* EVENTS */}
      {tab === 'events' && (
        <>
          <button
            onClick={() => dispatch(addEvent(loreId, 'New event'))}
            className="w-full rounded bg-indigo-600 py-1.5 text-sm text-white"
          >
            + Add event
          </button>

          <ul className="space-y-2">
            {events.map((e) => (
              <li
                key={e.id}
                className="rounded border px-3 py-2 text-sm bg-white"
              >
                {e.title}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* CHARACTERS */}
      {tab === 'characters' && (
        <>
          <button
            onClick={() => dispatch(addCharacter(loreId, 'New character'))}
            className="w-full rounded bg-indigo-600 py-1.5 text-sm text-white"
          >
            + Add character
          </button>

          <ul className="space-y-2">
            {characters.map((c) => (
              <li
                key={c.id}
                className="rounded border px-3 py-2 text-sm bg-white"
              >
                {c.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
