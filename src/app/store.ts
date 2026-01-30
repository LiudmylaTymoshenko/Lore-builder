import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import loreReducer from '../features/lore/loreSlice';
import eventsReducer from '../features/events/eventsSlice';
import charactersReducer from '../features/characters/charactersSlice';
import connectionsReducer from '../features/connections/connectionsSlice';
import { authApi } from '../features/auth/authApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lore: loreReducer,
    events: eventsReducer,
    characters: charactersReducer,
    connections: connectionsReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
