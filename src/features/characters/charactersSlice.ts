import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type Character = {
  id: string;
  loreId: string;
  name: string;
};

const initialState: Character[] = [];

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    addCharacter: {
      prepare: (loreId: string, name: string) => ({
        payload: {
          id: nanoid(),
          loreId,
          name,
        },
      }),
      reducer: (state, action: PayloadAction<Character>) => {
        state.push(action.payload);
      },
    },
  },
});

export const { addCharacter } = charactersSlice.actions;
export default charactersSlice.reducer;
