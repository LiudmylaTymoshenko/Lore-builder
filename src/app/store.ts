import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import loreReducer from '../features/lore/loreSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lore: loreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
