export interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}