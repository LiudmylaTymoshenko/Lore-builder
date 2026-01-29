import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type EventNode = {
  id: string;
  loreId: string;
  title: string;
  position: { x: number; y: number };
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
          position: {
            x: Math.random() * 400,
            y: Math.random() * 400,
          },
        },
      }),
      reducer: (state, action: PayloadAction<EventNode>) => {
        state.push(action.payload);
      },
    },
    updateEvent(state, action: PayloadAction<{ id: string; title: string }>) {
      const e = state.find((e) => e.id === action.payload.id);
      if (e) e.title = action.payload.title;
    },

    removeEvent(state, action: PayloadAction<string>) {
      return state.filter((e) => e.id !== action.payload);
    },
    updateEventPosition(
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>,
    ) {
      const e = state.find((e) => e.id === action.payload.id);
      if (e) e.position = action.payload.position;
    },
  },
});

export const { addEvent, updateEventPosition } = eventsSlice.actions;
export default eventsSlice.reducer;
