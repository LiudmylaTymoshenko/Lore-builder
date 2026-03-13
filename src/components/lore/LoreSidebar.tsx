import { useState } from 'react';
import type {
  Character,
  ConnectionType,
  EventNodeType,
  Lore,
  Place,
} from '../../types';
import { Pencil, Trash2, MapPin } from 'lucide-react';

interface LoreSidebarProps {
  events: EventNodeType[];
  characters: Character[];
  places: Place[];
  connections: ConnectionType[];
  handleAddEvent: () => void;
  handleUpdateEvent: (id: string, val: string) => void;
  handleDeleteEvent: (id: string) => void;
  handleAddCharacter: () => void;
  handleUpdateCharacter: (id: string, val: string) => void;
  handleDeleteCharacter: (id: string) => void;
  handleAddPlace: () => void;
  handleUpdatePlace: (id: string, val: string) => void;
  handleDeletePlace: (id: string) => void;
  handleLocateEvent: (id: string, position: { x: number; y: number }) => void;
  activeLore?: Lore;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function LoreSidebar({
  events,
  characters,
  places,
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
  handleAddPlace,
  handleUpdatePlace,
  handleDeletePlace,
}: LoreSidebarProps) {
  const [tab, setTab] = useState<'events' | 'characters' | 'places'>('events');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const ITEMS_PER_PAGE = 5;

  const [eventsPage, setEventsPage] = useState(1);
  const [charactersPage, setCharactersPage] = useState(1);
  const [placesPage, setPlacesPage] = useState(1);

  const handleTabChange = (nextTab: 'events' | 'characters' | 'places') => {
    setTab(nextTab);
    if (nextTab === 'events') setEventsPage(1);
    if (nextTab === 'characters') setCharactersPage(1);
    if (nextTab === 'places') setPlacesPage(1);
  };

  const pagedEvents = events.slice(
    (eventsPage - 1) * ITEMS_PER_PAGE,
    eventsPage * ITEMS_PER_PAGE,
  );

  const pagedCharacters = characters.slice(
    (charactersPage - 1) * ITEMS_PER_PAGE,
    charactersPage * ITEMS_PER_PAGE,
  );

  const pagedPlaces = places.slice(
    (placesPage - 1) * ITEMS_PER_PAGE,
    placesPage * ITEMS_PER_PAGE,
  );

  const eventsTotalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const charactersTotalPages = Math.ceil(characters.length / ITEMS_PER_PAGE);
  const placesTotalPages = Math.ceil(places.length / ITEMS_PER_PAGE);

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed w-14 cursor-pointer top-30 left-2 z-40 lg:hidden bg-white border-2 border-[#3F4245]/20 p-2 rounded-lg shadow-sm text-[#3F4245] font-bold"
      >
        ☰
      </button>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`w-72 bg-[#E7E8E3] border-r-2 border-[#3F4245]/10 p-4 space-y-4 overflow-y-auto h-screen
        lg:relative lg:translate-x-0
        fixed top-0 left-0 z-40
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ height: '100vh' }}
      >
        <h2 className="text-xl font-bold text-[#3F4245]">Lore Builder</h2>

        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange('events')}
            className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              tab === 'events'
                ? 'bg-[#F64134] text-white shadow-sm'
                : 'bg-white text-[#3F4245] border border-[#3F4245]/20 hover:bg-[#E7E8E3]'
            }`}
          >
            Events ({events.length})
          </button>

          <button
            onClick={() => handleTabChange('characters')}
            className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              tab === 'characters'
                ? 'bg-[#F64134] text-white shadow-sm'
                : 'bg-white text-[#3F4245] border border-[#3F4245]/20 hover:bg-[#E7E8E3]'
            }`}
          >
            Characters ({characters.length})
          </button>

          <button
            onClick={() => handleTabChange('places')}
            className={`flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              tab === 'places'
                ? 'bg-[#F64134] text-white shadow-sm'
                : 'bg-white text-[#3F4245] border border-[#3F4245]/20 hover:bg-[#E7E8E3]'
            }`}
          >
            Places ({places.length})
          </button>
        </div>

        {tab === 'events' && (
          <>
            <button
              onClick={handleAddEvent}
              className="w-full cursor-pointer rounded-lg bg-[#718E92] hover:bg-[#5a7074] py-2.5 text-sm font-bold text-white transition-all"
            >
              + Add Event
            </button>

            <ul className="space-y-2">
              {pagedEvents.map((e) => (
                <li
                  key={e.id}
                  className="rounded-lg border border-[#3F4245]/10 px-3 py-2.5 text-sm bg-white hover:bg-[#E7E8E3]/60 transition-all"
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
                        className="flex-1 border border-[#3F4245]/20 bg-white rounded-lg px-2 py-1.5 text-xs resize-none min-h-15"
                        rows={2}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="flex-1 whitespace-pre-wrap wrap-break-word text-[#3F4245]"
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
                        className="p-1 rounded cursor-pointer hover:bg-[#E7E8E3]"
                        title="Locate"
                      >
                        <MapPin size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(e.id);
                          setEditingValue(e.title);
                        }}
                        className="p-1 rounded cursor-pointer hover:bg-[#E7E8E3]"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(e.id)}
                        className="p-1 cursor-pointer rounded text-[#F64134] hover:bg-[#F64134]/10"
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
              className="w-full cursor-pointer rounded-lg bg-[#718E92] hover:bg-[#5a7074] py-2.5 text-sm font-bold text-white transition-all"
            >
              + Add Character
            </button>

            <ul className="space-y-2">
              {pagedCharacters.map((c) => (
                <li
                  key={c.id}
                  className="rounded-lg border border-[#3F4245]/10 px-3 py-2.5 text-sm bg-white hover:bg-[#E7E8E3]/60 transition-all"
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
                        className="flex-1 border border-[#3F4245]/20 bg-white rounded-lg px-2 py-1.5 text-xs"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="flex-1 text-[#3F4245]"
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
                        className="p-1 cursor-pointer rounded hover:bg-[#E7E8E3]"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCharacter(c.id)}
                        className="p-1 cursor-pointer rounded text-[#F64134] hover:bg-[#F64134]/10"
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

        {tab === 'places' && (
          <>
            <button
              onClick={handleAddPlace}
              className="w-full cursor-pointer rounded-lg bg-[#718E92] hover:bg-[#5a7074] py-2.5 text-sm font-bold text-white transition-all"
            >
              + Add Place
            </button>

            <ul className="space-y-2">
              {pagedPlaces.map((p) => (
                <li
                  key={p.id}
                  className="rounded-lg border border-[#3F4245]/10 px-3 py-2.5 text-sm bg-white hover:bg-[#E7E8E3]/60 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    {editingId === p.id ? (
                      <textarea
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => {
                          handleUpdatePlace(p.id, editingValue);
                          setEditingId(null);
                        }}
                        onKeyDown={(ev) => {
                          if (ev.key === 'Enter' && ev.ctrlKey) {
                            handleUpdatePlace(p.id, editingValue);
                            setEditingId(null);
                          }
                          if (ev.key === 'Escape') {
                            setEditingId(null);
                          }
                        }}
                        className="flex-1 border border-[#3F4245]/20 bg-white rounded-lg px-2 py-1.5 text-xs resize-none min-h-15"
                        rows={2}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="flex-1 whitespace-pre-wrap wrap-break-word text-[#3F4245]"
                        onDoubleClick={() => {
                          setEditingId(p.id);
                          setEditingValue(p.name);
                        }}
                      >
                        {p.name}
                      </span>
                    )}
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingId(p.id);
                          setEditingValue(p.name);
                        }}
                        className="p-1 rounded cursor-pointer hover:bg-[#E7E8E3]"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePlace(p.id)}
                        className="p-1 cursor-pointer rounded text-[#F64134] hover:bg-[#F64134]/10"
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
              className="px-3 py-1.5 cursor-pointer rounded-lg border border-[#3F4245]/20 bg-white disabled:opacity-40"
            >
              ← Prev
            </button>

            <span className="text-[#3F4245]/60 font-medium">
              Page {eventsPage} / {eventsTotalPages}
            </span>

            <button
              disabled={eventsPage === eventsTotalPages}
              onClick={() =>
                setEventsPage((p) => Math.min(eventsTotalPages, p + 1))
              }
              className="px-3 py-1.5 cursor-pointer rounded-lg border border-[#3F4245]/20 bg-white disabled:opacity-40"
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
              className="px-3 py-1.5 cursor-pointer rounded-lg border border-[#3F4245]/20 bg-white disabled:opacity-40"
            >
              ← Prev
            </button>

            <span className="text-[#3F4245]/60 font-medium">
              Page {charactersPage} / {charactersTotalPages}
            </span>

            <button
              disabled={charactersPage === charactersTotalPages}
              onClick={() =>
                setCharactersPage((p) => Math.min(charactersTotalPages, p + 1))
              }
              className="px-3 py-1.5 cursor-pointer rounded-lg border border-[#3F4245]/20 bg-white disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}

        {tab === 'places' && placesTotalPages > 1 && (
          <div className="flex items-center justify-between text-xs pt-2">
            <button
              disabled={placesPage === 1}
              onClick={() => setPlacesPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 cursor-pointer rounded-lg border border-[#3F4245]/20 bg-white disabled:opacity-40"
            >
              ← Prev
            </button>

            <span className="text-[#3F4245]/60 font-medium">
              Page {placesPage} / {placesTotalPages}
            </span>

            <button
              disabled={placesPage === placesTotalPages}
              onClick={() =>
                setPlacesPage((p) => Math.min(placesTotalPages, p + 1))
              }
              className="px-3 py-1.5 cursor-pointer rounded-lg border border-[#3F4245]/20 bg-white disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}

        <div className="border-t border-[#3F4245]/10 pt-4 text-xs text-[#3F4245]/60 font-medium">
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
                'linear-gradient(to bottom, rgba(231, 232, 227, 1), transparent)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </aside>
    </>
  );
}
