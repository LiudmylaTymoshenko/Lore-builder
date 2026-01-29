import { useState, memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Pencil, Trash2 } from 'lucide-react';
import type { NodeData } from '../../../types';

function CharacterNode({ data, id }: { data: NodeData; id: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.label);
  console.log(data);
  const handleSave = () => {
    if (data.onUpdate) {
      data.onUpdate(id, name);
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
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-1 shadow-md transition-colors"
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

      <div className="bg-white border-2 border-indigo-500 rounded-full shadow-lg px-4 py-3 min-w-35">
        <Handle type="target" position={Position.Left} />

        <div className="flex flex-col items-center">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === 'Escape') {
                  setName(data.label);
                  setIsEditing(false);
                }
              }}
              className="border rounded px-2 py-1 text-xs text-center w-full"
              autoFocus
            />
          ) : (
            <div
              className="font-medium text-indigo-700 text-sm cursor-text"
              onDoubleClick={() => setIsEditing(true)}
            >
              {data.label}
            </div>
          )}
        </div>

        <Handle type="source" position={Position.Right} />
      </div>
    </div>
  );
}

export default memo(CharacterNode);
