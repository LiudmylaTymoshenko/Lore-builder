import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type EventNode = {
  id: string;
  loreId: string;
  title: string;
};

const initialState: EventNode[] = [];

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: {
      prepare: (loreId: string, title: string) => ({
        payload: {
          id: nanoid(),
          loreId,
          title,
        },
      }),
      reducer: (state, action: PayloadAction<EventNode>) => {
        state.push(action.payload);
      },
    },
  },
});

export const { addEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
