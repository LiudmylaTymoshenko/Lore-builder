import { useState, useCallback } from 'react';
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

const nodeTypes = {
  event: EventNode,
  character: CharacterNode,
};

function LoreFlowInner({ loreId = 'default-lore' }: { loreId: string }) {
  const { fitView } = useReactFlow();
  const [showHelp, setShowHelp] = useState(false);
  const [events, setEvents] = useState<EventNodeType[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [connections, setConnections] = useState<ConnectionType[]>([]);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleUpdateEvent = useCallback((id: string, title: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, title } : e)));
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: title } }
          : node,
      ),
    );
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setConnections((prev) =>
      prev.filter((c) => c.sourceId !== id && c.targetId !== id),
    );
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id),
    );
  }, []);

  const handleUpdateCharacter = useCallback((id: string, name: string) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)),
    );
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: name } }
          : node,
      ),
    );
  }, []);

  const handleDeleteCharacter = useCallback((id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setConnections((prev) =>
      prev.filter((c) => c.sourceId !== id && c.targetId !== id),
    );
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id),
    );
  }, []);

  const handleDuplicateNode = (id: string) => {
    setNodes((nodes) => {
      const node = nodes.find((n) => n.id === id);
      if (!node) return nodes;

      const newNode = {
        id: crypto.randomUUID(),
        type: node.type,
        position: {
          x: node.position.x + 40,
          y: node.position.y + 60,
        },
        data: {
          ...node.data,
        },
        parentNode: undefined,
        extent: undefined,
      };

      return [...nodes, newNode];
    });
  };
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
    setEvents((prev) => [...prev, newEvent]);

    setNodes((nds) => [
      ...nds,
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
    ]);
  }, [loreId, handleUpdateEvent, handleDeleteEvent]);

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
    setCharacters((prev) => [...prev, newChar]);

    setNodes((nds) => [
      ...nds,
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
    ]);
  }, [loreId, handleUpdateCharacter, handleDeleteCharacter]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));

    changes.forEach((change) => {
      if (
        change.type === 'position' &&
        !change.dragging &&
        change.position &&
        change.id
      ) {
        const newPosition = change.position;
        setEvents((prev) =>
          prev.map((e) =>
            e.id === change.id ? { ...e, position: newPosition } : e,
          ),
        );
        setCharacters((prev) =>
          prev.map((c) =>
            c.id === change.id ? { ...c, position: newPosition } : c,
          ),
        );
      }
    });
  }, []);

  const handleConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      const newConnection: ConnectionType = {
        id: `conn-${Date.now()}`,
        loreId,
        sourceId: params.source,
        targetId: params.target,
      };
      setConnections((prev) => [...prev, newConnection]);

      setEdges((eds) => [
        ...eds,
        {
          id: newConnection.id,
          source: newConnection.sourceId,
          target: newConnection.targetId,
          type: 'simplebezier',
        },
      ]);
    },
    [loreId],
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));

    changes.forEach((change) => {
      if (change.type === 'remove') {
        setConnections((prev) => prev.filter((c) => c.id !== change.id));
      }
    });
  }, []);

  const handleLocateEvent = (nodeId: string) => {
    fitView({ nodes: [{ id: nodeId }], duration: 600 });
  };

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
      />

      <div style={{ flex: 1, width: '100%', position: 'relative' }}>
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

export default function LoreFlow(props: { loreId: string }) {
  return (
    <ReactFlowProvider>
      <LoreFlowInner {...props} />
    </ReactFlowProvider>
  );
}
