import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';

export type User = { id: string; email: string; password: string };
export type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
};

const storedUser = localStorage.getItem('auth_user');
const storedToken = localStorage.getItem('auth_token');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedToken,
  accessToken: storedToken,
};

export const loginThunk = createAsyncThunk<
  { user: User; accessToken: string },
  { email: string; password: string }
>('auth/loginThunk', async (credentials, { dispatch }) => {
  return await dispatch(authApi.endpoints.login.initiate(credentials)).unwrap();
});

export const registerThunk = createAsyncThunk<
  { user: User; accessToken: string },
  { email: string; password: string }
>('auth/registerThunk', async (credentials, { dispatch }) => {
  return await dispatch(
    authApi.endpoints.register.initiate(credentials),
  ).unwrap();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;

        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
        localStorage.setItem('auth_token', action.payload.accessToken);
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;

        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
        localStorage.setItem('auth_token', action.payload.accessToken);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
