export type User = {
  id: string;
  email: string;
  password: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};
