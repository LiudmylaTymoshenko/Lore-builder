import { useState, memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Pencil, Trash2 } from 'lucide-react';
import type { NodeData } from '../../../types';

function EventNode({ data, id, selected }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.label);

  const handleSave = () => {
    if (data.onUpdate) {
      data.onUpdate(id, title);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -top-2 -right-2 flex gap-1 z-10">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 shadow-md transition-colors"
          title="Edit"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div
        className={`bg-white border-2 ${selected ? 'border-yellow-500' : 'border-green-500'}  rounded-lg shadow-lg p-3 max-w-40`}
      >
        <Handle type="target" position={Position.Left} />

        {isEditing ? (
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
              if (e.key === 'Escape') {
                setTitle(data.label);
                setIsEditing(false);
              }
            }}
            className="w-full border rounded px-2 py-1 text-sm resize-none min-h-15"
            rows={3}
            autoFocus
          />
        ) : (
          <div
            className="font-semibold text-blue-700 text-sm wrap-break-word whitespace-pre-wrap cursor-text"
            onDoubleClick={() => setIsEditing(true)}
          >
            {data.label}
          </div>
        )}

        <Handle type="source" position={Position.Right} />
      </div>
    </div>
  );
}

export default memo(EventNode);
