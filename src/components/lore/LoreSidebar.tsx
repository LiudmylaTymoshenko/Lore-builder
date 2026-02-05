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
        className="fixed w-14 top-25 left-2 z-998 lg:hidden bg-[#1e1120]/45 backdrop-blur-md border-2 border-white/20 p-2 rounded-lg shadow-xl text-white"
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
        className={`w-72 bg-[#1e1120] backdrop-blur-md border-r-2 border-white/10 p-4 space-y-4 overflow-y-auto h-screen
    lg:relative lg:translate-x-0
    fixed top-0 left-0 z-999
    transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          height: '100vh',
        }}
      >
        <h2 className="text-xl font-bold text-white">Lore Builder</h2>

        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange('events')}
            className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              tab === 'events'
                ? 'bg-[#6b3f70] text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            Events ({events.length})
          </button>

          <button
            onClick={() => handleTabChange('characters')}
            className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              tab === 'characters'
                ? 'bg-[#6b3f70] text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            Characters ({characters.length})
          </button>
        </div>

        {tab === 'events' && (
          <>
            <button
              onClick={handleAddEvent}
              className="w-full cursor-pointer rounded-lg bg-[#6b3f70] hover:bg-[#8b5a8f] py-2.5 text-sm font-bold text-white transition-all shadow-lg"
            >
              + Add Event
            </button>

            <ul className="space-y-2">
              {pagedEvents.map((e) => (
                <li
                  key={e.id}
                  className="rounded-lg border-2 border-white/10 px-3 py-2.5 text-sm bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all"
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
                        className="flex-1 border-2 border-white/20 bg-white/10 rounded-lg px-2 py-1.5 text-xs resize-none min-h-15 text-white placeholder:text-white/50"
                        rows={2}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="flex-1 wrap-break-word whitespace-pre-wrap max-w-44 text-white"
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
                        className="text-white/70 cursor-pointer hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                        title="Locate"
                      >
                        <MapPin size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(e.id);
                          setEditingValue(e.title);
                        }}
                        className="text-white/70 cursor-pointer hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(e.id)}
                        className="text-red-300 cursor-pointer hover:text-red-200 transition-colors p-1 hover:bg-red-500/20 rounded"
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
              className="w-full cursor-pointer rounded-lg bg-[#6b3f70] hover:bg-[#8b5a8f] py-2.5 text-sm font-bold text-white transition-all shadow-lg"
            >
              + Add Character
            </button>

            <ul className="space-y-2">
              {pagedCharacters.map((c) => (
                <li
                  key={c.id}
                  className="rounded-lg border-2 border-white/10 px-3 py-2.5 text-sm bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all"
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
                        className="flex-1 border-2 border-white/20 bg-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-white/50"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="flex-1 text-white"
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
                        className="text-white/70 cursor-pointer hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCharacter(c.id)}
                        className="text-red-300 cursor-pointer hover:text-red-200 transition-colors p-1 hover:bg-red-500/20 rounded"
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
              className="px-3 py-1.5 rounded-lg border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              ← Prev
            </button>

            <span className="text-white/80 font-medium">
              Page {eventsPage} / {eventsTotalPages}
            </span>

            <button
              disabled={eventsPage === eventsTotalPages}
              onClick={() =>
                setEventsPage((p) => Math.min(eventsTotalPages, p + 1))
              }
              className="px-3 py-1.5 rounded-lg border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
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
              className="px-3 py-1.5 rounded-lg border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              ← Prev
            </button>

            <span className="text-white/80 font-medium">
              Page {charactersPage} / {charactersTotalPages}
            </span>

            <button
              disabled={charactersPage === charactersTotalPages}
              onClick={() =>
                setCharactersPage((p) => Math.min(charactersTotalPages, p + 1))
              }
              className="px-3 py-1.5 rounded-lg border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Next →
            </button>
          </div>
        )}

        <div className="border-t-2 border-white/10 pt-4 text-xs text-white/70 font-medium">
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
                'linear-gradient(to bottom, rgba(30, 17, 32, 1), transparent)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </aside>
    </>
  );
}
