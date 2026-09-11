export type UserRole = 'admin' | 'manager' | 'viewer';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  institution?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}
