import { useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Pencil, Trash2, Copy } from 'lucide-react';
import type { NodeData } from '../../../types';

function CharacterNode({ data, id, selected }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.label);

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
          onClick={() => data.onDuplicate?.(id)}
          className="bg-[#7b15a0] hover:bg-[#9f20cd] text-white rounded-full p-1 shadow-md transition-colors"
          title="Duplicate"
        >
          <Copy size={12} />
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-[#50006c] hover:bg-[#68028d] text-white rounded-full p-1 shadow-md transition-colors"
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
        className={`bg-white border-3 ${selected ? 'border-yellow-500' : 'border-[#2b192e]'} rounded-full shadow-lg px-4 py-3 min-w-35`}
      >
        <Handle
          style={{
            width: 15,
            height: 15,
            background: '#68028d',
            border: '2px solid white',
          }}
          type="target"
          position={Position.Left}
        />

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
              className="font-medium border-[#2b192e] text-sm cursor-text"
              onDoubleClick={() => setIsEditing(true)}
            >
              {data.label}
            </div>
          )}
        </div>

        <Handle
          style={{
            width: 15,
            height: 15,
            background: '#68028d',
            border: '2px solid white',
          }}
          type="source"
          position={Position.Right}
        />
      </div>
    </div>
  );
}

export default CharacterNode;
