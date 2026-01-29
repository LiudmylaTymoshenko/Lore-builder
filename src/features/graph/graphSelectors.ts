import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export const selectGraphData = (loreId: string) =>
  createSelector(
    [
      (s: RootState) => s.events,
      (s: RootState) => s.characters,
      (s: RootState) => s.connections,
    ],
    (events, characters, connections) => {
      const nodes = [
        ...events
          .filter((e) => e.loreId === loreId)
          .map((e) => ({
            id: e.id,
            type: 'event',
            data: { label: e.title },
            position: e.position,
          })),

        ...characters
          .filter((c) => c.loreId === loreId)
          .map((c) => ({
            id: c.id,
            type: 'character',
            data: { label: c.name },
            position: { x: 0, y: 0 },
          })),
      ];

      const edges = connections
        .filter((c) => c.loreId === loreId)
        .map((c) => ({
          id: c.id,
          source: c.sourceId,
          target: c.targetId,
        }));

      return { nodes, edges };
    },
  );
