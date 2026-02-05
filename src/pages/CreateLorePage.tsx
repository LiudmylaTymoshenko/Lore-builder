import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createLore } from '../features/lore/loreSlice';

const inputBase =
  'w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500';

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
    <div className="min-h-screen bg-[#f4f2f2] px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow space-y-8">
        <Link
          to="/dashboard"
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-gray-300
            px-4
            py-2
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-100
            hover:text-gray-900
        "
        >
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-semibold">Create new lore</h1>

        <div className="space-y-4">
          <input
            className={`${inputBase} ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Lore name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

          <input
            className={`${inputBase} ${errors.type ? 'border-red-500' : ''}`}
            placeholder="Genre / type (Fantasy, Sci-Fi, etc.)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-700">Sources</h2>

          {sources.map((source, i) => {
            const sourceError = errors.sources?.[i];

            return (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-start"
              >
                <div className="sm:col-span-2">
                  <input
                    className={`${inputBase} ${
                      sourceError ? 'border-red-500' : ''
                    }`}
                    placeholder="Title"
                    value={source.title}
                    onChange={(e) => updateSource(i, 'title', e.target.value)}
                  />
                  {sourceError && (
                    <p className="text-xs text-red-600 mt-1">{sourceError}</p>
                  )}
                </div>

                <select
                  className={inputBase}
                  value={source.type}
                  onChange={(e) => updateSource(i, 'type', e.target.value)}
                >
                  <option value="book">Book</option>
                  <option value="film">Film</option>
                  <option value="game">Game</option>
                  <option value="codex">Codex</option>
                </select>

                <select
                  className={inputBase}
                  value={source.canon}
                  onChange={(e) => updateSource(i, 'canon', e.target.value)}
                >
                  <option value="official">Official</option>
                  <option value="semi-canon">Semi-canon</option>
                  <option value="fanon">Fanon</option>
                </select>

                <button
                  type="button"
                  onClick={() => removeSource(i)}
                  disabled={sources.length === 1}
                  className="
                    rounded-lg
                    bg-red-600
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
                >
                  Delete
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addSource}
            className="text-sm font-medium text-[#2b192e] hover:underline"
          >
            + Add source
          </button>
        </div>

        <textarea
          className={inputBase}
          rows={4}
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Cover image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleImage(e.target.files[0])}
            className="block w-full text-sm text-[#2b192e] cursor-pointer"
          />

          {image && (
            <img
              src={image}
              alt="Preview"
              className="mt-2 max-h-64 rounded-lg object-cover"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-[#2b192e] py-2.5 text-white font-medium hover:bg-[#543859] transition"
        >
          Create lore
        </button>
      </div>
    </div>
  );
}
