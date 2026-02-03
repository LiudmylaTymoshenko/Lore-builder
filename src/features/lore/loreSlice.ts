/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loreApi } from './loreApi';
import type { CreateLorePayload, Lore } from './loreTypes';

type LoreState = {
  items: Lore[];
  loading: boolean;
};

const initialState: LoreState = {
  items: [],
  loading: false,
};

export const fetchLores = createAsyncThunk<Lore[]>(
  'lore/fetchAll',
  async (_, { dispatch }) => {
    const result = await dispatch(
      loreApi.endpoints.getLores.initiate(),
    ).unwrap();

    return result;
  },
);

export const getLore = createAsyncThunk<string, string>(
  'lore/getLore',
  async (id, { dispatch }) => {
    await dispatch(loreApi.endpoints.getLore.initiate(id)).unwrap();

    return id;
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

export const updateLore = createAsyncThunk<Lore, CreateLorePayload>(
  'lore/update',
  async ({ id, data }: any, { dispatch }) => {
    const result = await dispatch(
      loreApi.endpoints.updateLore.initiate(id, data),
    ).unwrap();

    return result;
  },
);

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
  reducers: {},
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
      .addCase(createLore.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteLore.fulfilled, (state, action) => {
        state.items = state.items.filter((lore) => lore.id !== action.payload);
      });
  },
});

export default loreSlice.reducer;
