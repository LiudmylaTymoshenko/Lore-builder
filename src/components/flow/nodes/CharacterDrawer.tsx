import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Pencil, Check, User } from 'lucide-react';

interface CharacterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  characterId: string;
  characterName: string;
  details: string[];
  quotes: string[];
  imageUrl?: string;
  allDetails: string[];
  onUpdateDetails: (details: string[]) => void;
  onUpdateQuotes: (quotes: string[]) => void;
  onUpdateImage: (url: string) => void;
}

export default function CharacterDrawer({
  isOpen,
  onClose,
  characterName,
  details,
  quotes,
  imageUrl,
  allDetails,
  onUpdateDetails,
  onUpdateQuotes,
  onUpdateImage,
}: CharacterDrawerProps) {
  const [tab, setTab] = useState<'details' | 'quotes'>('details');
  const [newDetail, setNewDetail] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = allDetails.filter(
    (d) =>
      d.toLowerCase().includes(newDetail.toLowerCase()) &&
      newDetail.trim() !== '' &&
      !details.includes(d),
  );

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

  const handleSaveEdit = (list: 'details' | 'quotes') => {
    if (editingIndex === null) return;
    const trimmed = editingValue.trim();
    if (!trimmed) return;
    if (list === 'details') {
      const updated = [...details];
      updated[editingIndex] = trimmed;
      onUpdateDetails(updated);
    } else {
      const updated = [...quotes];
      updated[editingIndex] = trimmed;
      onUpdateQuotes(updated);
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleAddQuote = () => {
    const trimmed = newQuote.trim();
    if (!trimmed) return;
    onUpdateQuotes([...quotes, trimmed]);
    setNewQuote('');
  };

  const handleDeleteQuote = (index: number) => {
    onUpdateQuotes(quotes.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 200;
      const ratio = Math.min(MAX / img.width, MAX / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      canvas
        .getContext('2d')!
        .drawImage(img, 0, 0, canvas.width, canvas.height);
      onUpdateImage(canvas.toDataURL('image/jpeg', 0.7));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-80 bg-[#E7E8E3] shadow-2xl z-50 flex flex-col">
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

          <div className="flex gap-1 bg-[#3F4245]/10 rounded-lg p-1">
            <button
              onClick={() => {
                setTab('details');
                setEditingIndex(null);
              }}
              className={`flex-1 cursor-pointer rounded-md py-1.5 text-sm font-semibold transition-all ${
                tab === 'details'
                  ? 'bg-white text-[#3F4245] shadow-sm'
                  : 'text-[#3F4245]/60 hover:text-[#3F4245]'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => {
                setTab('quotes');
                setEditingIndex(null);
              }}
              className={`flex-1 cursor-pointer rounded-md py-1.5 text-sm font-semibold transition-all ${
                tab === 'quotes'
                  ? 'bg-white text-[#3F4245] shadow-sm'
                  : 'text-[#3F4245]/60 hover:text-[#3F4245]'
              }`}
            >
              Quotes
            </button>
          </div>

          {tab === 'details' && (
            <div className="flex flex-col gap-2">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newDetail}
                    onChange={(e) => {
                      setNewDetail(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 150)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddDetail();
                        setShowSuggestions(false);
                      }
                      if (e.key === 'Escape') setShowSuggestions(false);
                    }}
                    placeholder="e.g. Captain, Imperium..."
                    className="w-full text-sm px-3 py-2 rounded-lg border border-[#3F4245]/20 bg-white text-[#3F4245] placeholder:text-[#3F4245]/40 focus:outline-none focus:border-[#6e5872]"
                  />
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <ul className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-[#3F4245]/20 rounded-lg shadow-lg overflow-hidden">
                      {filteredSuggestions.map((s) => (
                        <li
                          key={s}
                          onMouseDown={() => {
                            onUpdateDetails([...details, s]);
                            setNewDetail('');
                            setShowSuggestions(false);
                          }}
                          className="px-3 py-2 text-sm text-[#3F4245] hover:bg-[#6e5872]/10 cursor-pointer"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => {
                    handleAddDetail();
                    setShowSuggestions(false);
                  }}
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
                            if (e.key === 'Enter') handleSaveEdit('details');
                            if (e.key === 'Escape') setEditingIndex(null);
                          }}
                          className="flex-1 text-sm px-1 py-0.5 rounded border border-[#6e5872] focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit('details')}
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
          )}

          {tab === 'quotes' && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <textarea
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) handleAddQuote();
                    if (e.key === 'Escape') setNewQuote('');
                  }}
                  placeholder="Add a quote from source..."
                  rows={2}
                  className="flex-1 text-sm px-3 py-2 rounded-lg border border-[#3F4245]/20 bg-white text-[#3F4245] placeholder:text-[#3F4245]/40 focus:outline-none focus:border-[#6e5872] resize-none"
                />
                <button
                  onClick={handleAddQuote}
                  className="bg-[#6e5872] hover:bg-[#57445b] cursor-pointer text-white rounded-lg px-3 py-2 transition-colors self-start"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-xs text-[#3F4245]/40">Ctrl+Enter to add</p>

              {quotes.length === 0 && (
                <p className="text-xs text-[#3F4245]/40 text-center py-3">
                  No quotes yet
                </p>
              )}
              <ul className="flex flex-col gap-2">
                {quotes.map((quote, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-1 bg-white rounded-lg px-3 py-2 border border-[#3F4245]/10"
                  >
                    {editingIndex === i ? (
                      <div className="flex flex-col gap-1">
                        <textarea
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey)
                              handleSaveEdit('quotes');
                            if (e.key === 'Escape') setEditingIndex(null);
                          }}
                          className="flex-1 text-sm px-1 py-0.5 rounded border border-[#6e5872] focus:outline-none resize-none"
                          rows={3}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit('quotes')}
                          className="self-end p-1 rounded cursor-pointer hover:bg-[#6e5872]/10 text-[#6e5872]"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <span className="flex-1 text-sm text-[#3F4245] italic leading-relaxed">
                          "{quote}"
                        </span>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingIndex(i);
                              setEditingValue(quote);
                            }}
                            className="p-1 rounded cursor-pointer hover:bg-[#3F4245]/10 text-[#3F4245]/50"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuote(i)}
                            className="p-1 rounded cursor-pointer hover:bg-[#F64134]/10 text-[#F64134]"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}
