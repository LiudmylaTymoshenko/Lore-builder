/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loreApi } from './loreApi';
import type { CreateLorePayload } from './loreTypes';
import type { UpdateLoreContentPayload, Lore } from '../../types';

type LoreState = {
  items: Lore[];
  loading: boolean;
  activeLoreId?: string;
  dirty: boolean;
  current?: Lore;
};

const initialState: LoreState = {
  items: [],
  loading: false,
  dirty: false,
  current: undefined
};

export const fetchLores = createAsyncThunk<Lore[]>(
  'lore/fetchAll',
  async (_, { dispatch }) => {
    const promise = dispatch(loreApi.endpoints.getLores.initiate());

    const result = await promise.unwrap();
    return result;
  },
);

export const getLore = createAsyncThunk<Lore, string>(
  'lore/getLore',
  async (id, { dispatch }) => {
    const promise = dispatch(loreApi.endpoints.getLore.initiate(id));
    const result = await promise;
    if (result.data) {
      return result.data;
    }

    throw new Error('No data returned from API');
  },
);

export const createLore = createAsyncThunk<Lore, CreateLorePayload>(
  'lore/create',
  async (data, { dispatch }) => {
    const result = await dispatch(
      loreApi.endpoints.createLore.initiate(data),
    ).unwrap();

    return result;
  },
);

export const updateLore = createAsyncThunk<
  Lore,
  { id: string; data: UpdateLoreContentPayload }
>('lore/update', async ({ id, data }, { dispatch }) => {
  const result = await dispatch(
    loreApi.endpoints.updateLore.initiate({ id, data }),
  ).unwrap();

  return result;
});

export const deleteLore = createAsyncThunk<string, string>(
  'lore/delete',
  async (id, { dispatch }) => {
    await dispatch(loreApi.endpoints.deleteLore.initiate(id)).unwrap();

    return id;
  },
);

const loreSlice = createSlice({
  name: 'lore',
  initialState,
  reducers: {
    setActiveLore(state, action) {
      state.activeLoreId = action.payload;
    },
    markDirty(state) {
      state.dirty = true;
    },
    markSaved(state) {
      state.dirty = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLores.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLores.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getLore.fulfilled, (state, action) => {
        state.current = action.payload;
        const index = state.items.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(createLore.fulfilled, (state, action) => {
        if (!state.items) {
          state.items = [];
        }
        state.items.push(action.payload);
      })
      .addCase(deleteLore.fulfilled, (state, action) => {
        state.items = state.items.filter((lore) => lore.id !== action.payload);
      })
      .addCase(updateLore.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (lore) => lore.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        state.dirty = false;
      });
  },
});

export const { markDirty, markSaved, setActiveLore } = loreSlice.actions;

export default loreSlice.reducer;
