import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';

export type User = {
  id: string;
  email: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const storedUser = localStorage.getItem('auth_user');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('auth_user', JSON.stringify(action.payload));
    },
    register(state, action: PayloadAction<{ email: string }>) {
      const user: User = {
        id: nanoid(),
        email: action.payload.email,
      };
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('auth_user', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth_user');
    },
  },
});

export const { loginSuccess, register, logout } = authSlice.actions;
export default authSlice.reducer;
