import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import loreReducer from '../features/lore/loreSlice';
import eventsReducer from '../features/events/eventsSlice';
import charactersReducer from '../features/characters/charactersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lore: loreReducer,
    events: eventsReducer,
    characters: charactersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
