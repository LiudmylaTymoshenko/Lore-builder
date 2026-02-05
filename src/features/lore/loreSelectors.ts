import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export const selectDirty = (state: RootState) => state.lore.dirty;
export const selectLoreItems = (state: RootState) => state.lore.items;
export const selectActiveLoreId = (state: RootState) => state.lore.activeLoreId;

export const selectActiveLore = createSelector(
  [selectLoreItems, selectActiveLoreId],
  (items, id) => items.find((l) => l.id === id),
);
