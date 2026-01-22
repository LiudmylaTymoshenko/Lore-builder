import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';

export type Lore = {
  id: string;
  name: string;
  type: string;
  ownerId: string;
};

const initialState: Lore[] = [];

const loreSlice = createSlice({
  name: 'lore',
  initialState,
  reducers: {
    addLore: (
      state,
      action: PayloadAction<{ name: string; type: string; ownerId: string }>,
    ) => {
      state.push({
        id: nanoid(),
        ...action.payload,
      });
    },
  },
});

export const { addLore } = loreSlice.actions;
export default loreSlice.reducer;
