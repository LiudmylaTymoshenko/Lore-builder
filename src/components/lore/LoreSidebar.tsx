import { useState } from 'react';
import type {
  Character,
  ConnectionType,
  EventNodeType,
  Lore,
} from '../../types';
import { Pencil, Trash2, MapPin } from 'lucide-react';

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
  handleLocateEvent: (id: string, position: { x: number; y: number }) => void;
  activeLore?: Lore;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
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
  handleLocateEvent,
  activeLore,
  isSidebarOpen,
  setIsSidebarOpen,
}: LoreSidebarProps) {
  const [tab, setTab] = useState<'events' | 'characters'>('events');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const ITEMS_PER_PAGE = 5;

  const [eventsPage, setEventsPage] = useState(1);
  const [charactersPage, setCharactersPage] = useState(1);

  const handleTabChange = (nextTab: 'events' | 'characters') => {
    setTab(nextTab);
    if (nextTab === 'events') setEventsPage(1);
    if (nextTab === 'characters') setCharactersPage(1);
  };

  const pagedEvents = events.slice(
    (eventsPage - 1) * ITEMS_PER_PAGE,
    eventsPage * ITEMS_PER_PAGE,
  );

  const pagedCharacters = characters.slice(
    (charactersPage - 1) * ITEMS_PER_PAGE,
    charactersPage * ITEMS_PER_PAGE,
  );

  const eventsTotalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const charactersTotalPages = Math.ceil(characters.length / ITEMS_PER_PAGE);

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed w-8 top-25 left-5 z-998 lg:hidden bg-white p-2 rounded shadow"
      >
        ☰
      </button>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-998 lg:hidden"
        />
      )}
      <aside
        className={`w-72 bg-white border-r p-4 space-y-4 overflow-y-auto h-screen
    lg:relative lg:translate-x-0
    fixed top-0 left-0 z-999
    transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          height: '100vh',
        }}
      >
        <h2 className="text-lg font-bold">Lore Builder</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange('events')}
            className={`flex-1 cursor-pointer rounded px-2 py-1 text-sm ${
              tab === 'events' ? 'bg-[#50006c] text-white' : 'bg-gray-100'
            }`}
          >
            Events ({events.length})
          </button>

          <button
            onClick={() => handleTabChange('characters')}
            className={`flex-1 cursor-pointer rounded px-2 py-1 text-sm ${
              tab === 'characters' ? 'bg-[#50006c] text-white' : 'bg-gray-100'
            }`}
          >
            Characters ({characters.length})
          </button>
        </div>

        {tab === 'events' && (
          <>
            <button
              onClick={handleAddEvent}
              className="w-full cursor-pointer rounded bg-[#50006c] py-2 text-sm text-white hover:bg-[#6c0293]"
            >
              + Add Event
            </button>

            <ul className="space-y-2">
              {pagedEvents.map((e) => (
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
                        className="flex-1 border rounded px-2 py-1 text-xs resize-none min-h-15"
                        rows={2}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="flex-1 wrap-break-word whitespace-pre-wrap max-w-44"
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
                        onClick={() =>
                          handleLocateEvent(e.id, {
                            x: e.position.x,
                            y: e.position.y,
                          })
                        }
                        className="text-[#432548] cursor-pointer hover:text-[#190f1b]"
                        title="Edit"
                      >
                        <MapPin size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(e.id);
                          setEditingValue(e.title);
                        }}
                        className="text-[#2b192e] cursor-pointer hover:text-[#190f1b]"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(e.id)}
                        className="text-red-600 cursor-pointer hover:text-red-800"
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
              className="w-full cursor-pointer rounded bg-[#50006c] py-2 text-sm text-white hover:bg-[#6c0293]"
            >
              + Add Character
            </button>

            <ul className="space-y-2">
              {pagedCharacters.map((c) => (
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
                        className="text-[#2b192e]  cursor-pointer hover:text-[#190f1b]"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCharacter(c.id)}
                        className="text-red-600 cursor-pointer hover:text-red-800"
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

        {tab === 'events' && eventsTotalPages > 1 && (
          <div className="flex items-center justify-between text-xs pt-2">
            <button
              disabled={eventsPage === 1}
              onClick={() => setEventsPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 rounded border hover:bg-[#aa83b8] cursor-pointer disabled:opacity-40"
            >
              ← Prev
            </button>

            <span>
              Page {eventsPage} / {eventsTotalPages}
            </span>

            <button
              disabled={eventsPage === eventsTotalPages}
              onClick={() =>
                setEventsPage((p) => Math.min(eventsTotalPages, p + 1))
              }
              className="px-2 py-1 rounded border hover:bg-[#aa83b8] cursor-pointer disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}

        {tab === 'characters' && charactersTotalPages > 1 && (
          <div className="flex items-center justify-between text-xs pt-2">
            <button
              disabled={charactersPage === 1}
              onClick={() => setCharactersPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 rounded border hover:bg-[#aa83b8] cursor-pointer disabled:opacity-40"
            >
              ← Prev
            </button>

            <span>
              Page {charactersPage} / {charactersTotalPages}
            </span>

            <button
              disabled={charactersPage === charactersTotalPages}
              onClick={() =>
                setCharactersPage((p) => Math.min(charactersTotalPages, p + 1))
              }
              className="px-2 py-1 rounded border hover:bg-[#aa83b8] cursor-pointer disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}

        <div className="border-t pt-4 text-xs text-gray-500">
          <div>Connections: {connections.length}</div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 'auto',
          }}
        >
          <img
            src={String(activeLore?.imageUrl)}
            alt="Lore"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '40%',
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 1), transparent)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </aside>
    </>
  );
}
