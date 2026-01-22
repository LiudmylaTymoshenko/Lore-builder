import ReactFlow, { Background, type Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

export default function LoreFlow({ loreId }: { loreId: string }) {
  const events = useSelector((s: RootState) =>
    s.events.filter((e) => e.loreId === loreId),
  );

  const nodes: Node[] = events.map((e, i) => ({
    id: e.id,
    data: { label: e.title },
    position: { x: 100, y: i * 100 },
  }));

  return (
    <div className="flex-1">
      <ReactFlow nodes={nodes} edges={[]} fitView>
        <Background />
      </ReactFlow>
    </div>
  );
}
