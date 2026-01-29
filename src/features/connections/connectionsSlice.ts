import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type Connection = {
  id: string;
  loreId: string;
  sourceId: string;
  targetId: string;
};

const initialState: Connection[] = [];

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    addConnection: {
      prepare: (loreId: string, sourceId: string, targetId: string) => ({
        payload: {
          id: nanoid(),
          loreId,
          sourceId,
          targetId,
        },
      }),
      reducer: (state, action: PayloadAction<Connection>) => {
        state.push(action.payload);
      },
    },
    removeConnection(state, action: PayloadAction<string>) {
      return state.filter((c) => c.id !== action.payload);
    },
  },
});

export const { addConnection, removeConnection } = connectionsSlice.actions;
export default connectionsSlice.reducer;
