import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Pencil, Check, User } from 'lucide-react';

interface CharacterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  characterId: string;
  characterName: string;
  details: string[];
  imageUrl?: string;
  onUpdateDetails: (details: string[]) => void;
  onUpdateImage: (url: string) => void;
}

export default function CharacterDrawer({
  isOpen,
  onClose,
  characterName,
  details,
  imageUrl,
  onUpdateDetails,
  onUpdateImage,
}: CharacterDrawerProps) {
  const [newDetail, setNewDetail] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddDetail = () => {
    const trimmed = newDetail.trim();
    if (!trimmed) return;
    onUpdateDetails([...details, trimmed]);
    setNewDetail('');
  };

  const handleDeleteDetail = (index: number) => {
    onUpdateDetails(details.filter((_, i) => i !== index));
  };

  const handleEditDetail = (index: number) => {
    setEditingIndex(index);
    setEditingValue(details[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editingValue.trim();
    if (!trimmed) return;
    const updated = [...details];
    updated[editingIndex] = trimmed;
    onUpdateDetails(updated);
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        onUpdateImage(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#E7E8E3] shadow-2xl z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#3F4245]/10">
          <h2 className="text-lg font-bold text-[#3F4245]">{characterName}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#3F4245]/10 cursor-pointer transition-colors"
          >
            <X size={18} className="text-[#3F4245]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#6e5872] shadow-md cursor-pointer bg-[#6e5872]/20 flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload image"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={characterName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-[#6e5872]/60" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#3F4245]/60 hover:text-[#3F4245] transition-colors cursor-pointer"
            >
              {imageUrl ? 'Change image' : 'Upload image'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-[#3F4245]">Details</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddDetail();
                }}
                placeholder="e.g. Captain, Imperium..."
                className="flex-1 text-sm px-3 py-2 rounded-lg border border-[#3F4245]/20 bg-white text-[#3F4245] placeholder:text-[#3F4245]/40 focus:outline-none focus:border-[#6e5872]"
              />
              <button
                onClick={handleAddDetail}
                className="bg-[#6e5872] hover:bg-[#57445b] cursor-pointer text-white rounded-lg px-3 py-2 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {details.length === 0 && (
              <p className="text-xs text-[#3F4245]/40 text-center py-3">
                No details yet
              </p>
            )}
            <ul className="flex flex-col gap-1.5">
              {details.map((detail, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-[#3F4245]/10"
                >
                  {editingIndex === i ? (
                    <>
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') setEditingIndex(null);
                        }}
                        className="flex-1 text-sm px-1 py-0.5 rounded border border-[#6e5872] focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 rounded cursor-pointer hover:bg-[#6e5872]/10 text-[#6e5872]"
                      >
                        <Check size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-[#3F4245]">
                        {detail}
                      </span>
                      <button
                        onClick={() => handleEditDetail(i)}
                        className="p-1 rounded cursor-pointer hover:bg-[#3F4245]/10 text-[#3F4245]/50"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteDetail(i)}
                        className="p-1 rounded cursor-pointer hover:bg-[#F64134]/10 text-[#F64134]"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
