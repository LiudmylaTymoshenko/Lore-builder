import { useState, useCallback, useEffect } from 'react';
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
import type { Character, ConnectionType, EventNodeType } from '../../types';
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

const nodeTypes = {
  event: EventNode,
  character: CharacterNode,
};

interface FlowState {
  events: EventNodeType[];
  characters: Character[];
  connections: ConnectionType[];
  nodes: Node[];
  edges: Edge[];
}

function buildInitialState(lore: ReturnType<typeof useActiveLore>): FlowState {
  if (!lore) {
    return {
      events: [],
      characters: [],
      connections: [],
      nodes: [],
      edges: [],
    };
  }
  return {
    events: lore.events ?? [],
    characters: lore.characters ?? [],
    connections: lore.connections ?? [],
    nodes: lore.nodes ?? [],
    edges: (lore.connections ?? []).map((c) => ({
      id: c.id,
      source: c.sourceId,
      target: c.targetId,
      type: 'simplebezier' as const,
    })),
  };
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

  const [flowState, setFlowState] = useState<FlowState>(() =>
    buildInitialState(activeLore),
  );

  const { events, characters, connections, nodes, edges } = flowState;

  useEffect(() => {
    if (!dirty || !activeLore) return;

    const payload = { events, characters, connections, nodes };

    const t = setTimeout(async () => {
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
  }, [events, characters, connections, nodes, dirty, activeLore, dispatch]);

  const handleUpdateEvent = useCallback((id: string, title: string) => {
    setFlowState((s) => ({
      ...s,
      events: s.events.map((e) => (e.id === id ? { ...e, title } : e)),
      nodes: s.nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: title } }
          : node,
      ),
    }));
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    setFlowState((s) => ({
      ...s,
      events: s.events.filter((e) => e.id !== id),
      nodes: s.nodes.filter((node) => node.id !== id),
      connections: s.connections.filter(
        (c) => c.sourceId !== id && c.targetId !== id,
      ),
      edges: s.edges.filter((edge) => edge.source !== id && edge.target !== id),
    }));
  }, []);

  const handleUpdateCharacter = useCallback((id: string, name: string) => {
    setFlowState((s) => ({
      ...s,
      characters: s.characters.map((c) => (c.id === id ? { ...c, name } : c)),
      nodes: s.nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: name } }
          : node,
      ),
    }));
  }, []);

  const handleDeleteCharacter = useCallback((id: string) => {
    setFlowState((s) => ({
      ...s,
      characters: s.characters.filter((c) => c.id !== id),
      nodes: s.nodes.filter((node) => node.id !== id),
      connections: s.connections.filter(
        (c) => c.sourceId !== id && c.targetId !== id,
      ),
      edges: s.edges.filter((edge) => edge.source !== id && edge.target !== id),
    }));
  }, []);

  const handleDuplicateNode = useCallback(
    (id: string) => {
      setFlowState((s) => {
        const node = s.nodes.find((n) => n.id === id);
        if (!node || node.type !== 'character') return s;

        const character = s.characters.find((c) => c.id === id);
        if (!character) return s;

        const newId = crypto.randomUUID();

        const position = {
          x: node.position.x + 40,
          y: node.position.y + 60,
        };

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
              data: {
                ...node.data,
                label: `${character.name} (copy)`,
              },
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
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
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

  const handleAddCharacter = useCallback(() => {
    const newChar: Character = {
      id: `char-${Date.now()}`,
      loreId,
      name: 'New Character',
      position: {
        x: Math.random() * 400 + 500,
        y: Math.random() * 400,
      },
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
            onUpdate: handleUpdateCharacter,
            onDelete: handleDeleteCharacter,
            onDuplicate: handleDuplicateNode,
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
    dispatch,
  ]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setFlowState((s) => {
        let {
          nodes: updatedNodes,
          events: updatedEvents,
          characters: updatedCharacters,
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
          }
        });

        return {
          ...s,
          nodes: updatedNodes,
          events: updatedEvents,
          characters: updatedCharacters,
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
        },
      };
    }

    return node;
  }

  useEffect(() => {
    if (!activeLore) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlowState((s) => ({
      ...s,
      nodes: (activeLore.nodes ?? []).map(withHandlers),
      events: activeLore.events ?? [],
      characters: activeLore.characters ?? [],
      connections: activeLore.connections ?? [],
      edges: (activeLore.connections ?? []).map((c) => ({
        id: c.id,
        source: c.sourceId,
        target: c.targetId,
        type: 'simplebezier',
      })),
    }));
  }, [activeLore?.id]);

  return (
    <div style={{ width: '100vw', display: 'flex' }}>
      <LoreSidebar
        events={events}
        characters={characters}
        connections={connections}
        handleAddEvent={handleAddEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
        handleAddCharacter={handleAddCharacter}
        handleUpdateCharacter={handleUpdateCharacter}
        handleDeleteCharacter={handleDeleteCharacter}
        handleLocateEvent={handleLocateEvent}
        activeLore={activeLore}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
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
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="w-80 rounded-xl bg-white p-4 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Quick tips</h3>
                <X
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={() => setShowHelp(false)}
                />
              </div>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Hello</li>
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
