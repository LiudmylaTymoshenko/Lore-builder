/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Background,
  MiniMap,
  type Connection,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import EventNode from './nodes/EventNode';
import CharacterNode from './nodes/CharacterNode';
import type {
  Character,
  ConnectionType,
  EventNodeType,
  Place,
} from '../../types';
import LoreSidebar from '../lore/LoreSidebar';
import { FlowHelpControl } from './FlowHelpControl';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useActiveLore } from '../../hooks/useActiveLore';
import {
  markDirty,
  markSaved,
  updateLore,
} from '../../features/lore/loreSlice';
import { selectDirty } from '../../features/lore/loreSelectors';
import PlaceNode from './nodes/PlaceNode';

const nodeTypes = {
  event: EventNode,
  character: CharacterNode,
  place: PlaceNode,
};

interface FlowState {
  events: EventNodeType[];
  characters: Character[];
  connections: ConnectionType[];
  nodes: Node[];
  edges: Edge[];
  places: Place[];
}

function buildInitialState(lore: ReturnType<typeof useActiveLore>): FlowState {
  if (!lore) {
    return {
      events: [],
      characters: [],
      connections: [],
      nodes: [],
      edges: [],
      places: [],
    };
  }
  return {
    events: lore.events ?? [],
    characters: lore.characters ?? [],
    connections: lore.connections ?? [],
    nodes: lore.nodes ?? [],
    places: lore.places ?? [],
    edges: (lore.connections ?? []).map((c) => ({
      id: c.id,
      source: c.sourceId,
      target: c.targetId,
      type: 'simplebezier' as const,
    })),
  };
}

function cleanNodes(nodes: Node[]) {
  return nodes.map(
    ({
      data,
      width,
      height,
      dragging,
      selected,
      resizing,
      positionAbsolute,
      ...node
    }) => {
      const {
        onUpdate,
        onDelete,
        onDuplicate,
        onUpdateDetails,
        onUpdateImage,
        onUpdateQuotes,
        allDetails,
        ...restData
      } = data;
      return { ...node, data: restData };
    },
  );
}

function LoreFlowInner({
  loreId,
  activeLore,
}: {
  loreId: string;
  activeLore: ReturnType<typeof useActiveLore>;
}) {
  const { fitView } = useReactFlow();
  const [showHelp, setShowHelp] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useAppDispatch();
  const dirty = useAppSelector(selectDirty);

  const nodesRef = useRef<Node[]>([]);

  const [flowState, setFlowState] = useState<FlowState>(() =>
    buildInitialState(activeLore),
  );

  const { events, characters, connections, nodes, edges, places } = flowState;

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const allDetails = Array.from(
    new Set(characters.flatMap((c) => (c as Character).details ?? [])),
  ) as string[];

  useEffect(() => {
    if (!dirty || !activeLore) return;

    const t = setTimeout(async () => {
      const payload = {
        events,
        characters,
        connections,
        places,
        nodes: cleanNodes(nodesRef.current),
      };

      try {
        await dispatch(
          updateLore({ id: activeLore.id, data: payload }),
        ).unwrap();
        dispatch(markSaved());
      } catch (e) {
        console.error('Autosave failed', e);
      }
    }, 800);

    return () => clearTimeout(t);
  }, [events, characters, connections, places, dirty, activeLore, dispatch]);

  const handleUpdateEvent = useCallback(
    (id: string, title: string) => {
      setFlowState((s) => ({
        ...s,
        events: s.events.map((e) => (e.id === id ? { ...e, title } : e)),
        nodes: s.nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: title } }
            : node,
        ),
      }));
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleDeleteEvent = useCallback(
    (id: string) => {
      setFlowState((s) => ({
        ...s,
        events: s.events.filter((e) => e.id !== id),
        nodes: s.nodes.filter((node) => node.id !== id),
        connections: s.connections.filter(
          (c) => c.sourceId !== id && c.targetId !== id,
        ),
        edges: s.edges.filter(
          (edge) => edge.source !== id && edge.target !== id,
        ),
      }));
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleUpdateCharacter = useCallback(
    (id: string, name: string) => {
      setFlowState((s) => ({
        ...s,
        characters: s.characters.map((c) => (c.id === id ? { ...c, name } : c)),
        nodes: s.nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: name } }
            : node,
        ),
      }));
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleDeleteCharacter = useCallback(
    (id: string) => {
      setFlowState((s) => ({
        ...s,
        characters: s.characters.filter((c) => c.id !== id),
        nodes: s.nodes.filter((node) => node.id !== id),
        connections: s.connections.filter(
          (c) => c.sourceId !== id && c.targetId !== id,
        ),
        edges: s.edges.filter(
          (edge) => edge.source !== id && edge.target !== id,
        ),
      }));
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleUpdateCharacterDetails = useCallback(
    (id: string, details: string[]) => {
      setFlowState((s) => ({
        ...s,
        characters: s.characters.map((c) =>
          c.id === id ? { ...c, details } : c,
        ),
        nodes: s.nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, details } } : node,
        ),
      }));
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleUpdateCharacterImage = useCallback(
    (id: string, imageUrl: string) => {
      setFlowState((s) => ({
        ...s,
        characters: s.characters.map((c) =>
          c.id === id ? { ...c, imageUrl } : c,
        ),
        nodes: s.nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, imageUrl } } : node,
        ),
      }));
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleUpdateCharacterQuotes = useCallback(
    (id: string, quotes: string[]) => {
      setFlowState((s) => ({
        ...s,
        characters: s.characters.map((c) =>
          c.id === id ? { ...c, quotes } : c,
        ),
        nodes: s.nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, quotes } } : node,
        ),
      }));
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleDuplicateNode = useCallback(
    (id: string) => {
      setFlowState((s) => {
        const node = s.nodes.find((n) => n.id === id);
        if (!node || node.type !== 'character') return s;

        const character = s.characters.find((c) => c.id === id);
        if (!character) return s;

        const newId = crypto.randomUUID();
        const position = { x: node.position.x + 40, y: node.position.y + 60 };

        return {
          ...s,
          characters: [
            ...s.characters,
            {
              ...character,
              id: newId,
              name: `${character.name} (copy)`,
              position,
            },
          ],
          nodes: [
            ...s.nodes,
            {
              ...node,
              id: newId,
              position,
              data: { ...node.data, label: `${character.name} (copy)` },
              parentNode: undefined,
              extent: undefined,
            },
          ],
        };
      });
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleAddEvent = useCallback(() => {
    const newEvent: EventNodeType = {
      id: `event-${Date.now()}`,
      loreId,
      title: 'New Event',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    setFlowState((s) => ({
      ...s,
      events: [...s.events, newEvent],
      nodes: [
        ...s.nodes,
        {
          id: newEvent.id,
          type: 'event',
          data: {
            label: newEvent.title,
            onUpdate: handleUpdateEvent,
            onDelete: handleDeleteEvent,
          },
          position: newEvent.position,
        },
      ],
    }));
    dispatch(markDirty());
  }, [loreId, handleUpdateEvent, handleDeleteEvent, dispatch]);

  const handleUpdatePlace = useCallback(
    (id: string, name: string) => {
      setFlowState((s) => ({
        ...s,
        places: s.places.map((c) => (c.id === id ? { ...c, name } : c)),
        nodes: s.nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: name } }
            : node,
        ),
      }));
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleDeletePlace = useCallback(
    (id: string) => {
      setFlowState((s) => ({
        ...s,
        places: s.places.filter((c) => c.id !== id),
        nodes: s.nodes.filter((node) => node.id !== id),
        connections: s.connections.filter(
          (c) => c.sourceId !== id && c.targetId !== id,
        ),
        edges: s.edges.filter(
          (edge) => edge.source !== id && edge.target !== id,
        ),
      }));
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleAddPlace = useCallback(() => {
    const newChar: Place = {
      id: `char-${Date.now()}`,
      loreId,
      name: 'New Place',
      position: { x: Math.random() * 400 + 500, y: Math.random() * 400 },
    };

    setFlowState((s) => ({
      ...s,
      places: [...s.places, newChar],
      nodes: [
        ...s.nodes,
        {
          id: newChar.id,
          type: 'place',
          data: {
            label: newChar.name,
            onUpdate: handleUpdatePlace,
            onDelete: handleDeletePlace,
          },
          position: newChar.position,
        },
      ],
    }));
    dispatch(markDirty());
  }, [loreId, handleUpdatePlace, handleDeletePlace, dispatch]);

  const handleAddCharacter = useCallback(() => {
    const newChar: Character = {
      id: `char-${Date.now()}`,
      loreId,
      name: 'New Character',
      position: { x: Math.random() * 400 + 500, y: Math.random() * 400 },
    };

    setFlowState((s) => ({
      ...s,
      characters: [...s.characters, newChar],
      nodes: [
        ...s.nodes,
        {
          id: newChar.id,
          type: 'character',
          data: {
            label: newChar.name,
            details: [],
            quotes: [],
            imageUrl: undefined,
            onUpdate: handleUpdateCharacter,
            onDelete: handleDeleteCharacter,
            onDuplicate: handleDuplicateNode,
            onUpdateDetails: handleUpdateCharacterDetails,
            onUpdateImage: handleUpdateCharacterImage,
            onUpdateQuotes: handleUpdateCharacterQuotes,
          },
          position: newChar.position,
        },
      ],
    }));
    dispatch(markDirty());
  }, [
    loreId,
    handleUpdateCharacter,
    handleDeleteCharacter,
    handleDuplicateNode,
    handleUpdateCharacterDetails,
    handleUpdateCharacterImage,
    handleUpdateCharacterQuotes,
    dispatch,
  ]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setFlowState((s) => {
        let {
          nodes: updatedNodes,
          events: updatedEvents,
          characters: updatedCharacters,
          places: updatedPlaces,
        } = s;

        updatedNodes = applyNodeChanges(changes, updatedNodes);

        changes.forEach((change) => {
          if (
            change.type === 'position' &&
            !change.dragging &&
            change.position &&
            change.id
          ) {
            const pos = change.position;
            updatedEvents = updatedEvents.map((e) =>
              e.id === change.id ? { ...e, position: pos } : e,
            );
            updatedCharacters = updatedCharacters.map((c) =>
              c.id === change.id ? { ...c, position: pos } : c,
            );
            updatedPlaces = updatedPlaces.map((c) =>
              c.id === change.id ? { ...c, position: pos } : c,
            );
          }
        });

        return {
          ...s,
          nodes: updatedNodes,
          events: updatedEvents,
          characters: updatedCharacters,
          places: updatedPlaces,
        };
      });
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      const newConnection: ConnectionType = {
        id: `conn-${Date.now()}`,
        loreId,
        sourceId: params.source,
        targetId: params.target,
      };

      setFlowState((s) => ({
        ...s,
        connections: [...s.connections, newConnection],
        edges: [
          ...s.edges,
          {
            id: newConnection.id,
            source: newConnection.sourceId,
            target: newConnection.targetId,
            type: 'simplebezier',
          },
        ],
      }));
      dispatch(markDirty());
    },
    [loreId, dispatch],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setFlowState((s) => {
        const updatedEdges = applyEdgeChanges(changes, s.edges);
        const removedIds = new Set(
          changes.filter((c) => c.type === 'remove').map((c) => c.id),
        );
        return {
          ...s,
          edges: updatedEdges,
          connections: removedIds.size
            ? s.connections.filter((c) => !removedIds.has(c.id))
            : s.connections,
        };
      });
      dispatch(markDirty());
    },
    [dispatch],
  );

  const handleLocateEvent = (nodeId: string) => {
    fitView({ nodes: [{ id: nodeId }], duration: 600 });
  };

  function withHandlers(node: Node): Node {
    if (node.type === 'event') {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: handleUpdateEvent,
          onDelete: handleDeleteEvent,
        },
      };
    }
    if (node.type === 'character') {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: handleUpdateCharacter,
          onDelete: handleDeleteCharacter,
          onDuplicate: handleDuplicateNode,
          onUpdateDetails: handleUpdateCharacterDetails,
          onUpdateImage: handleUpdateCharacterImage,
          onUpdateQuotes: handleUpdateCharacterQuotes,
        },
      };
    }
    if (node.type === 'place') {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: handleUpdatePlace,
          onDelete: handleDeletePlace,
        },
      };
    }
    return node;
  }

  useEffect(() => {
    if (!activeLore) return;

    const initialNodes = (activeLore.nodes ?? []).map(withHandlers);

    setFlowState({
      nodes: initialNodes,
      events: activeLore.events ?? [],
      characters: activeLore.characters ?? [],
      connections: activeLore.connections ?? [],
      places: activeLore.places ?? [],
      edges: (activeLore.connections ?? []).map((c) => ({
        id: c.id,
        source: c.sourceId,
        target: c.targetId,
        type: 'simplebezier',
      })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLore?.id]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <LoreSidebar
        events={events}
        characters={characters}
        connections={connections}
        places={places}
        handleAddEvent={handleAddEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
        handleAddCharacter={handleAddCharacter}
        handleUpdateCharacter={handleUpdateCharacter}
        handleDeleteCharacter={handleDeleteCharacter}
        handleLocateEvent={handleLocateEvent}
        handleAddPlace={handleAddPlace}
        handleUpdatePlace={handleUpdatePlace}
        handleDeletePlace={handleDeletePlace}
        activeLore={activeLore}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="absolute inset-0 overflow-hidden">
        <ReactFlow
          nodes={nodes.map((node) => {
            if (node.type === 'character') {
              const char = characters.find((c) => c.id === node.id);
              return {
                ...node,
                data: {
                  ...node.data,
                  allDetails,
                  details: char?.details ?? node.data.details ?? [],
                  quotes: char?.quotes ?? node.data.quotes ?? [],
                  imageUrl: char?.imageUrl ?? node.data.imageUrl,
                },
              };
            }
            return node;
          })}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          deleteKeyCode={['Backspace', 'Delete']}
          edgesFocusable
          edgesUpdatable={false}
          fitView
          minZoom={0.1}
          maxZoom={4}
        >
          <Background />
          <FlowHelpControl setShowHelp={setShowHelp} />
          <MiniMap />
        </ReactFlow>
        {showHelp && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-100 rounded-xl bg-white p-4 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Quick tips</h3>
                <X
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={() => setShowHelp(false)}
                />
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <b>Drag nodes</b> to rearrange your story visually.
                </li>
                <li>
                  <b>Connect events</b> to show cause and effect relationships.
                </li>
                <li>
                  <b>Characters can link</b> to multiple events at once.
                </li>
                <li>
                  <b>Click the pencil</b> to rename events or characters.
                </li>
                <li>
                  <b>Use "Locate"</b> to jump to an event on a large map.
                </li>
                <li>
                  <b>Think in timelines</b>: early, middle, and finale events.
                </li>
                <li>
                  <b>Sources</b> help track canon versus non-canon lore.
                </li>
                <li>
                  <b>Too many links?</b> Split events into smaller ones.
                </li>
                <li>
                  <b>Changes save automatically</b>; no manual save needed.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoreFlow({
  loreId = 'default-lore',
}: {
  loreId: string;
}) {
  const activeLore = useActiveLore();
  if (!activeLore) return null;

  return (
    <ReactFlowProvider>
      <LoreFlowInner key={loreId} loreId={loreId} activeLore={activeLore} />
    </ReactFlowProvider>
  );
}
