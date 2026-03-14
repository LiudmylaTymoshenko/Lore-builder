import { useState, useRef, useCallback, useEffect } from 'react';
import type {
  Character,
  ConnectionType,
  EventNodeType,
  Lore,
  Place,
} from '../../types';
import { Pencil, Trash2, MapPin } from 'lucide-react';
import PaginationControls from '../pagination';

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

const MIN_WIDTH = 240;
const MAX_WIDTH = 600;
const COLLAPSE_THRESHOLD = 160;

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
  const [sidebarWidth, setSidebarWidth] = useState(433);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

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

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;
      startX.current = e.clientX;
      startWidth.current = sidebarWidth;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [sidebarWidth],
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isResizing.current = true;
      startX.current = e.touches[0].clientX;
      startWidth.current = sidebarWidth;
    },
    [sidebarWidth],
  );

  useEffect(() => {
    const applyResize = (clientX: number) => {
      const delta = clientX - startX.current;
      const newWidth = startWidth.current + delta;

      if (newWidth < COLLAPSE_THRESHOLD) {
        setDesktopCollapsed(true);
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        return;
      }

      setDesktopCollapsed(false);
      setSidebarWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth)));
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      applyResize(e.clientX);
    };

    const onMouseUp = () => {
      if (!isResizing.current) return;
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isResizing.current) return;
      applyResize(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
      isResizing.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 768,
  );
  const desktopVisible = !desktopCollapsed;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed w-14 cursor-pointer top-30 left-2 z-40 md:hidden bg-white border-2 border-[#3F4245]/20 p-2 rounded-lg shadow-sm text-[#3F4245] font-bold"
      >
        ☰
      </button>

      {desktopCollapsed && (
        <button
          onClick={() => {
            setDesktopCollapsed(false);
            setSidebarWidth(433);
          }}
          className="hidden md:flex fixed top-1/2 -translate-y-1/2 left-0 z-50 flex-col items-center justify-center
            w-5 h-16 bg-[#E7E8E3] border border-[#3F4245]/20 border-l-0
            rounded-r-md cursor-pointer hover:bg-[#d8d9d4] transition-colors"
          title="Open sidebar"
        >
          <span
            className="text-[#3F4245]/60 text-[10px] font-bold tracking-widest"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            LORE
          </span>
        </button>
      )}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <div
        className={`relative h-screen flex-shrink-0
          md:relative fixed top-0 left-0 z-40
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
        style={{
          width: isDesktop
            ? desktopVisible
              ? sidebarWidth + 6
              : 0
            : isSidebarOpen
              ? sidebarWidth + 6
              : 0,
          overflow: 'hidden',
        }}
      >
        <div
          className="absolute top-0 left-0 bg-[#E7E8E3] border-r-2 border-[#3F4245]/10 flex flex-col"
          style={{ width: sidebarWidth, height: '100vh', overflow: 'hidden' }}
        >
          <div className="flex flex-col gap-4 p-4 flex-1 min-h-0 overflow-hidden">
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
                <ul className="space-y-2 overflow-y-auto flex-1 min-h-0">
                  {pagedEvents.map((e) => (
                    <li
                      key={e.id}
                      className="rounded-lg border border-[#3F4245]/10 px-3 py-2.5 text-sm bg-white hover:bg-[#E7E8E3]/60 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        {editingId === e.id ? (
                          <textarea
                            value={editingValue}
                            onChange={(ev) => setEditingValue(ev.target.value)}
                            onBlur={() => {
                              handleUpdateEvent(e.id, editingValue);
                              setEditingId(null);
                            }}
                            onKeyDown={(ev) => {
                              if (ev.key === 'Enter' && ev.ctrlKey) {
                                handleUpdateEvent(e.id, editingValue);
                                setEditingId(null);
                              }
                              if (ev.key === 'Escape') setEditingId(null);
                            }}
                            className="flex-1 border border-[#3F4245]/20 bg-white rounded-lg px-2 py-1.5 text-xs resize-none min-h-[60px]"
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
                        <div className="flex gap-1 shrink-0">
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
                <PaginationControls
                  page={eventsPage}
                  totalPages={eventsTotalPages}
                  setPage={setEventsPage}
                />
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
                <ul className="space-y-2 overflow-y-auto flex-1 min-h-0">
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
                            onChange={(ev) => setEditingValue(ev.target.value)}
                            onBlur={() => {
                              handleUpdateCharacter(c.id, editingValue);
                              setEditingId(null);
                            }}
                            onKeyDown={(ev) => {
                              if (ev.key === 'Enter') {
                                handleUpdateCharacter(c.id, editingValue);
                                setEditingId(null);
                              }
                              if (ev.key === 'Escape') setEditingId(null);
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
                        <div className="flex gap-1 shrink-0">
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
                <PaginationControls
                  page={charactersPage}
                  totalPages={charactersTotalPages}
                  setPage={setCharactersPage}
                />
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
                <ul className="space-y-2 overflow-y-auto flex-1 min-h-0">
                  {pagedPlaces.map((p) => (
                    <li
                      key={p.id}
                      className="rounded-lg border border-[#3F4245]/10 px-3 py-2.5 text-sm bg-white hover:bg-[#E7E8E3]/60 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        {editingId === p.id ? (
                          <textarea
                            value={editingValue}
                            onChange={(ev) => setEditingValue(ev.target.value)}
                            onBlur={() => {
                              handleUpdatePlace(p.id, editingValue);
                              setEditingId(null);
                            }}
                            onKeyDown={(ev) => {
                              if (ev.key === 'Enter' && ev.ctrlKey) {
                                handleUpdatePlace(p.id, editingValue);
                                setEditingId(null);
                              }
                              if (ev.key === 'Escape') setEditingId(null);
                            }}
                            className="flex-1 border border-[#3F4245]/20 bg-white rounded-lg px-2 py-1.5 text-xs resize-none min-h-[60px]"
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
                        <div className="flex gap-1 shrink-0">
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
                <PaginationControls
                  page={placesPage}
                  totalPages={placesTotalPages}
                  setPage={setPlacesPage}
                />
              </>
            )}

            <div className="border-t border-[#3F4245]/10 pt-4 text-xs text-[#3F4245]/60 font-medium">
              <div>Connections: {connections.length}</div>
            </div>
          </div>

          {activeLore?.imageUrl && (
            <div
              style={{ position: 'relative', width: '100%', marginTop: 'auto' }}
            >
              <img
                src={String(activeLore.imageUrl)}
                alt="Lore"
                style={{ width: '100%', height: 'auto', display: 'block' }}
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
          )}
        </div>

        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          style={{ left: sidebarWidth }}
          className="absolute top-0 bottom-0 w-4 cursor-col-resize z-10 select-none
            bg-[#3F4245]/10 hover:bg-[#718E92]/30 active:bg-[#718E92]/50
            transition-colors duration-150 flex items-center justify-center group"
        >
          <div className="flex flex-col gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[#45413f]" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
