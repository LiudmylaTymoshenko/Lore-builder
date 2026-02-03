import { Link } from 'react-router-dom';
import type { Lore } from '../../types';
import { useEffect, useState } from 'react';

export default function LoreHeader({ lore }: { lore: Lore }) {
  const getDominantColor = (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve('255, 255, 255');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(
          Math.floor(img.width * 0.8),
          Math.floor(img.height * 0.5),
          1,
          1,
        ).data;

        resolve(`${imageData[0]}, ${imageData[1]}, ${imageData[2]}`);
      };

      img.onerror = () => resolve('255, 255, 255');
    });
  };

  const [dominantColor, setDominantColor] = useState<string | null>(null);

  useEffect(() => {
    if (lore.imageUrl) {
      getDominantColor(lore.imageUrl).then(setDominantColor);
    }
  }, [lore.imageUrl]);

  return (
    <header className="relative flex items-center justify-between px-6 py-4 shadow overflow-hidden bg-white">
      {lore.imageUrl && dominantColor && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${lore.imageUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
              zIndex: 0,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                to right,
                rgb(255, 255, 255) 0%,
                rgb(255, 255, 255) 30%,
                rgba(${dominantColor}, 0.8) 65%,
                rgba(${dominantColor}, 0) 90%
                )`,
              zIndex: 1,
            }}
          />
        </>
      )}

      <div className="flex items-center gap-4 relative z-10">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:underline">
          ← Dashboard
        </Link>

        <div>
          <h1 className="text-lg font-semibold">{lore.name}</h1>
          <p className="text-sm text-gray-500">{lore.type}</p>
        </div>
      </div>
    </header>
  );
}
