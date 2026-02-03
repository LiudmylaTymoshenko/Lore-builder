import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createLore } from '../features/lore/loreSlice';

export default function CreateLorePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!user || !name || !type) return;

    try {
      const lore = await dispatch(
        createLore({
          name,
          type,
          description,
          imageUrl: image,
        }),
      ).unwrap();

      navigate(`/lore/${lore.id}`);
    } catch (error) {
      console.error('Failed to create lore', error);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl bg-white rounded-2xl shadow p-8 space-y-6">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:underline">
          ← Back to dashboard
        </Link>

        <h1 className="text-2xl font-semibold">Create new lore</h1>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lore name"
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type (Fantasy, Sci-Fi, etc)"
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
            rows={4}
            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <label className="block text-sm text-gray-600">
            Cover image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleImage(e.target.files[0])}
              className="mt-1 block w-full text-sm text-blue-700"
            />
          </label>

          {image && (
            <img
              src={image}
              alt="Preview"
              className="rounded-lg max-h-64 object-cover"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-white hover:bg-indigo-700 transition"
        >
          Create lore
        </button>
      </div>
    </div>
  );
}
