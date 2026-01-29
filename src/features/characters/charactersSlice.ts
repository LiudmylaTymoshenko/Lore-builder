import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type Character = {
  id: string;
  loreId: string;
  name: string;
  position: { x: number; y: number };
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState: [] as Character[],
  reducers: {
    addCharacter: {
      prepare: (loreId: string) => ({
        payload: {
          id: nanoid(),
          loreId,
          name: 'New character',
          position: {
            x: Math.random() * 400 + 500,
            y: Math.random() * 400,
          },
        },
      }),
      reducer: (state, action: PayloadAction<Character>) => {
        state.push(action.payload);
      },
    },

    updateCharacterName(
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) {
      const c = state.find((c) => c.id === action.payload.id);
      if (c) c.name = action.payload.name;
    },

    removeCharacter(state, action: PayloadAction<string>) {
      return state.filter((c) => c.id !== action.payload);
    },
    updateCharacterPosition(
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>,
    ) {
      const c = state.find((c) => c.id === action.payload.id);
      if (c) c.position = action.payload.position;
    },
  },
});

export const { addCharacter, updateCharacterPosition } = charactersSlice.actions;
export default charactersSlice.reducer;
