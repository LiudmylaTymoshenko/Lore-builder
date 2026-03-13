import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createLore } from '../features/lore/loreSlice';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const inputBase =
  'w-full rounded-lg border-2 border-[#3F4245]/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#F64134]/40 focus:border-[#F64134] text-[#3F4245] placeholder:text-[#3F4245]/40 transition-all text-sm';

export default function CreateLorePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [sources, setSources] = useState([
    { title: '', type: 'book', canon: 'official' },
  ]);

  const [errors, setErrors] = useState<{
    name?: string;
    type?: string;
    sources?: Record<number, string>;
  }>({});

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
      if (!s.title.trim()) sourceErrors[i] = 'Source title is required';
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
    } catch (err) {
      console.error('Failed to create lore', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#E7E8E3]">
      <header className="bg-white border-b-2 border-[#3F4245]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#F64134] flex items-center justify-center">
              <span className="text-xl font-bold text-white">L</span>
            </div>
            <h1 className="text-2xl font-bold text-[#3F4245]">Lore Builder</h1>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#3F4245]/20 text-[#3F4245] font-semibold text-sm hover:bg-[#E7E8E3] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#3F4245] mb-2">
            Create New Lore
          </h2>
          <p className="text-[#3F4245]/60 mb-10">
            Define the foundation of your new world.
          </p>

          <div className="bg-white border-2 border-[#3F4245]/10 rounded-2xl p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3F4245] mb-1">
                    Lore Name
                  </label>
                  <input
                    className={`${inputBase} ${
                      errors.name ? 'border-[#F64134]' : ''
                    }`}
                    placeholder="Enter lore name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-xs text-[#F64134] mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3F4245] mb-1">
                    Genre / Type
                  </label>
                  <input
                    className={`${inputBase} ${
                      errors.type ? 'border-[#F64134]' : ''
                    }`}
                    placeholder="Fantasy, Sci-Fi, etc."
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                  {errors.type && (
                    <p className="text-xs text-[#F64134] mt-1">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3F4245] mb-1">
                    Description
                  </label>
                  <textarea
                    className={inputBase}
                    rows={4}
                    placeholder="Short description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#3F4245]">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleImage(e.target.files[0])
                  }
                  className="block w-full text-sm text-[#3F4245]
                    file:mr-3 file:py-2 file:px-3
                    file:rounded-lg file:border-0
                    file:bg-[#718E92] file:text-white
                    file:font-semibold hover:file:bg-[#5a7074]
                    file:cursor-pointer transition-all"
                />

                {image && (
                  <div className="h-48 rounded-xl overflow-hidden border border-[#3F4245]/10">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#3F4245]/10 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#3F4245]">Sources</h3>
                <button
                  type="button"
                  onClick={addSource}
                  className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg bg-[#718E92] hover:bg-[#5a7074] text-white font-semibold text-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Source
                </button>
              </div>

              <div className="space-y-4">
                {sources.map((source, i) => {
                  const sourceError = errors.sources?.[i];

                  return (
                    <div
                      key={i}
                      className="bg-[#E7E8E3]/40 border border-[#3F4245]/10 rounded-xl p-4 space-y-3"
                    >
                      <input
                        className={`${inputBase} ${
                          sourceError ? 'border-[#F64134]' : ''
                        }`}
                        placeholder="Source title..."
                        value={source.title}
                        onChange={(e) =>
                          updateSource(i, 'title', e.target.value)
                        }
                      />

                      {sourceError && (
                        <p className="text-xs text-[#F64134]">{sourceError}</p>
                      )}

                      <div className="grid grid-cols-2 gap-3">
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
                          className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F64134]/10 text-[#F64134] hover:bg-[#F64134]/20 border border-[#F64134]/20 font-semibold text-xs transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full cursor-pointer py-4 rounded-xl bg-[#F64134] hover:bg-[#d83a2f] text-white font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Create Lore
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
