import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AppDispatch } from '../../app/store';
import { authApi } from './authApi';

export type User = {
  id: string;
  email: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

const storedUser = localStorage.getItem('auth_user');
const storedToken = localStorage.getItem('auth_token');

const initialState: AuthState = {
  user:
    storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedToken && storedToken !== 'undefined',
  token: storedToken && storedToken !== 'undefined' ? storedToken : null,
};

export const loginThunk = createAsyncThunk<
  { user: User; accessToken: string },
  { email: string; password: string },
  { dispatch: AppDispatch }
>('auth/loginThunk', async (credentials, { dispatch }) => {
  const result = await dispatch(
    authApi.endpoints.login.initiate(credentials),
  ).unwrap();

  return result;
});

export const registerThunk = createAsyncThunk<
  { user: User; accessToken: string },
  { email: string; password: string },
  { dispatch: AppDispatch }
>('auth/registerThunk', async (credentials, { dispatch }) => {
  const result = await dispatch(
    authApi.endpoints.register.initiate(credentials),
  ).unwrap();

  return result;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage on logout
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken; // Changed from token to accessToken
        state.isAuthenticated = true;

        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
        localStorage.setItem('auth_token', action.payload.accessToken); // Changed from token to accessToken
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken; // Changed from token to accessToken
        state.isAuthenticated = true;

        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
        localStorage.setItem('auth_token', action.payload.accessToken); // Changed from token to accessToken
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
