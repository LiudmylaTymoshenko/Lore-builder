import { createSlice, type PayloadAction, nanoid } from '@reduxjs/toolkit';

export type Lore = {
  id: string;
  name: string;
  type: string;
  ownerId: string;
  description?: string;
  image?: string | null;
};

const initialState: Lore[] = [];

const loreSlice = createSlice({
  name: 'lore',
  initialState,
  reducers: {
    addLore: {
      prepare: (data: Omit<Lore, 'id'>) => {
        return {
          payload: {
            id: nanoid(),
            ...data,
          },
        };
      },
      reducer: (state, action: PayloadAction<Lore>) => {
        state.push(action.payload);
      },
    },
  },
});

export const { addLore } = loreSlice.actions;
export default loreSlice.reducer;
