import { useState } from 'react';
import type { Character, ConnectionType, EventNodeType } from '../../types';
import { Pencil, Trash2 } from 'lucide-react';

interface LoreSidebarProps {
  events: EventNodeType[];
  characters: Character[];
  connections: ConnectionType[];
  handleAddEvent: () => void;
  handleUpdateEvent: (id: string, val: string) => void;
  handleDeleteEvent: (id: string) => void;
  handleAddCharacter: () => void;
  handleUpdateCharacter: (id: string, val: string) => void;
  handleDeleteCharacter: (id: string) => void;
}

export default function LoreSidebar({
  events,
  characters,
  connections,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  handleAddCharacter,
  handleUpdateCharacter,
  handleDeleteCharacter,
}: LoreSidebarProps) {
  const [tab, setTab] = useState<'events' | 'characters'>('events');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  return (
    <aside
      className="w-72 bg-white border-r p-4 space-y-4 overflow-y-auto"
      style={{ height: '100vh' }}
    >
      <h2 className="text-lg font-bold">Lore Builder</h2>
      <div className="flex gap-2">
        <button
          onClick={() => setTab('events')}
          className={`flex-1 rounded px-2 py-1 text-sm ${
            tab === 'events' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
          }`}
        >
          Events ({events.length})
        </button>

        <button
          onClick={() => setTab('characters')}
          className={`flex-1 rounded px-2 py-1 text-sm ${
            tab === 'characters' ? 'bg-indigo-600 text-white' : 'bg-gray-100'
          }`}
        >
          Characters ({characters.length})
        </button>
      </div>

      {tab === 'events' && (
        <>
          <button
            onClick={handleAddEvent}
            className="w-full rounded bg-blue-600 py-2 text-sm text-white hover:bg-blue-700"
          >
            + Add Event
          </button>

          <ul className="space-y-2">
            {events.map((e) => (
              <li
                key={e.id}
                className="rounded border px-3 py-2 text-sm bg-white hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-2">
                  {editingId === e.id ? (
                    <textarea
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => {
                        handleUpdateEvent(e.id, editingValue);
                        setEditingId(null);
                      }}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter' && ev.ctrlKey) {
                          handleUpdateEvent(e.id, editingValue);
                          setEditingId(null);
                        }
                        if (ev.key === 'Escape') {
                          setEditingId(null);
                        }
                      }}
                      className="flex-1 border rounded px-2 py-1 text-xs resize-none min-h-[60px]"
                      rows={2}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="flex-1 wrap-break-word whitespace-pre-wrap max-w-47.5"
                      onDoubleClick={() => {
                        setEditingId(e.id);
                        setEditingValue(e.title);
                      }}
                    >
                      {e.title}
                    </span>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingId(e.id);
                        setEditingValue(e.title);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(e.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'characters' && (
        <>
          <button
            onClick={handleAddCharacter}
            className="w-full rounded bg-indigo-600 py-2 text-sm text-white hover:bg-indigo-700"
          >
            + Add Character
          </button>

          <ul className="space-y-2">
            {characters.map((c) => (
              <li
                key={c.id}
                className="rounded border px-3 py-2 text-sm bg-white hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-2">
                  {editingId === c.id ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => {
                        handleUpdateCharacter(c.id, editingValue);
                        setEditingId(null);
                      }}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                          handleUpdateCharacter(c.id, editingValue);
                          setEditingId(null);
                        }
                        if (ev.key === 'Escape') {
                          setEditingId(null);
                        }
                      }}
                      className="flex-1 border rounded px-2 py-1 text-xs"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="flex-1"
                      onDoubleClick={() => {
                        setEditingId(c.id);
                        setEditingValue(c.name);
                      }}
                    >
                      {c.name}
                    </span>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditingValue(c.name);
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCharacter(c.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="border-t pt-4 text-xs text-gray-500">
        <div>Connections: {connections.length}</div>
      </div>
    </aside>
  );
}
