/* eslint-disable react-hooks/purity */
import { useMemo } from 'react';
import type { LoreDot } from '../../types';

type LoreSpinnerProps = {
  size?: number;
  text?: string;
};

export function LoreSpinner({
  size = 200,
  text = 'Synthesizing lore…',
}: LoreSpinnerProps) {
  const dots = useMemo(() => {
    const layers = [
      { count: 14, radius: 45 },
      { count: 18, radius: 95 },
      { count: 22, radius: 75 },
    ];

    const center = size / 2;

    return layers.flatMap((layer, layerIndex) =>
      Array.from({ length: layer.count }).map((_, i) => {
        const angle = (i / layer.count) * Math.PI * 2;
        const jitter = Math.random() * 6 - 3;

        return {
          x: center + Math.cos(angle) * layer.radius + jitter,
          y: center + Math.sin(angle) * layer.radius + jitter,
          layer: layerIndex,
          delay: `${Math.random() * 2}s`,
          driftDuration: `${1 + Math.random() * 3}s`,
        };
      }),
    );
  }, [size]);

  const renderDot = (dot: LoreDot, i: number) => (
    <circle
      key={i}
      cx={dot.x}
      cy={dot.y}
      r={Math.random() * 4}
      style={{
        animationDelay: dot.delay,
        animationDuration: `2s, ${dot.driftDuration}`,
      }}
      className="dot animate-dot"
    />
  );

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="fade-gradient">
            <stop offset="70%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <mask id="fade-mask">
            <rect width={size} height={size} fill="url(#fade-gradient)" />
          </mask>
        </defs>

        <g mask="url(#fade-mask)">
          <g className="animate-orbit orbit-fast">
            {dots.filter((d) => d.layer === 0).map(renderDot)}
          </g>
          <g className="animate-orbit orbit-fast">
            {dots.filter((d) => d.layer === 1).map(renderDot)}
          </g>
          <g className="animate-orbit orbit-slow">
            {dots.filter((d) => d.layer === 2).map(renderDot)}
          </g>
        </g>
      </svg>
      {text && (
        <p className="mt-4 text-xs tracking-[0.2em] text-[#2b192e]/70 font-mono uppercase animate-text-flicker">
          {text}
        </p>
      )}
    </div>
  );
}
