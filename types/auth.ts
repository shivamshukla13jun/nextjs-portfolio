export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token?: string;
}
