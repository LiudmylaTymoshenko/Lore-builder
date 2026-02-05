import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createLore } from '../features/lore/loreSlice';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const inputBase =
  'w-full rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#8b5a8f] focus:border-[#8b5a8f] text-white placeholder:text-white/50 transition-all text-sm';

export default function CreateLorePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    type?: string;
    sources?: Record<number, string>;
  }>({});

  const [sources, setSources] = useState([
    { title: '', type: 'book', canon: 'official' },
  ]);

  const addSource = () =>
    setSources((s) => [...s, { title: '', type: 'book', canon: 'official' }]);

  const updateSource = (
    index: number,
    field: 'title' | 'type' | 'canon',
    value: string,
  ) => {
    setSources((s) =>
      s.map((src, i) => (i === index ? { ...src, [field]: value } : src)),
    );
  };

  const removeSource = (index: number) => {
    setSources((s) => s.filter((_, i) => i !== index));
  };

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!name.trim()) nextErrors.name = 'Lore name is required';
    if (!type.trim()) nextErrors.type = 'Type is required';

    const sourceErrors: Record<number, string> = {};
    sources.forEach((s, i) => {
      if (!s.title.trim()) {
        sourceErrors[i] = 'Source title is required';
      }
    });

    if (Object.keys(sourceErrors).length) {
      nextErrors.sources = sourceErrors;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!validate()) return;

    try {
      const lore = await dispatch(
        createLore({
          name,
          type,
          description,
          imageUrl: image,
          sources: sources.filter((s) => s.title.trim() !== ''),
        }),
      ).unwrap();

      navigate(`/lore/${lore.id}`);
    } catch (error) {
      console.error('Failed to create lore', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#2b192e] flex flex-col">
      <div 
        className="fixed inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/Dashboard.png')" }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10 shadow-xl">
          <div className="px-6 py-4 flex items-center justify-between box-border">
            <h1 className="text-xl font-bold text-white">Lore Builder</h1>
            
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white font-medium transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-6">
          <div className="w-full max-w-4xl bg-white/15 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Create New Lore
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1">
                    Lore Name
                  </label>
                  <input
                    className={`${inputBase} ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="Enter name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-300 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1">
                    Genre / Type
                  </label>
                  <input
                    className={`${inputBase} ${errors.type ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="Fantasy, Sci-Fi, etc."
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                  {errors.type && (
                    <p className="text-xs text-red-300 mt-1">{errors.type}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1">
                    Description
                  </label>
                  <textarea
                    className={inputBase}
                    rows={3}
                    placeholder="Short description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && handleImage(e.target.files[0])
                    }
                    className="block w-full text-xs text-white/80 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#6b3f70] file:text-white file:font-semibold hover:file:bg-[#8b5a8f] file:cursor-pointer file:transition-all file:text-sm"
                  />
                  {image && (
                    <div className="mt-2 rounded-lg overflow-hidden border-2 border-white/20">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Sources</h3>
                  <button
                    type="button"
                    onClick={addSource}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#6b3f70] hover:bg-[#8b5a8f] text-white font-semibold transition-all text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {sources.map((source, i) => {
                    const sourceError = errors.sources?.[i];

                    return (
                      <div
                        key={i}
                        className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-3 space-y-2"
                      >
                        <input
                          className={`${inputBase} ${
                            sourceError ? 'border-red-400' : ''
                          }`}
                          placeholder="Title..."
                          value={source.title}
                          onChange={(e) =>
                            updateSource(i, 'title', e.target.value)
                          }
                        />
                        {sourceError && (
                          <p className="text-xs text-red-300">{sourceError}</p>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className={inputBase}
                            value={source.type}
                            onChange={(e) =>
                              updateSource(i, 'type', e.target.value)
                            }
                          >
                            <option value="book">Book</option>
                            <option value="film">Film</option>
                            <option value="game">Game</option>
                            <option value="codex">Codex</option>
                          </select>

                          <select
                            className={inputBase}
                            value={source.canon}
                            onChange={(e) =>
                              updateSource(i, 'canon', e.target.value)
                            }
                          >
                            <option value="official">Official</option>
                            <option value="semi-canon">Semi-canon</option>
                            <option value="fanon">Fanon</option>
                          </select>
                        </div>

                        {sources.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSource(i)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-300 font-semibold transition-all text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full mt-4 py-3 rounded-xl bg-[#6b3f70] hover:bg-[#8b5a8f] text-white font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Create Lore
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}