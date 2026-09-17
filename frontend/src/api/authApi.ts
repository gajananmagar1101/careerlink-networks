import { apiClient, unwrap } from './apiClient';
import type { AuthResponse, GoogleAuthPayload, GoogleAuthResponse, Role, User } from '../types/domain';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  role: Role;
}

export const authApi = {
  login: (payload: LoginPayload) => unwrap<AuthResponse>(apiClient.post('/api/auth/login', payload)),
  googleAuth: (payload: GoogleAuthPayload) =>
    unwrap<GoogleAuthResponse>(apiClient.post('/api/auth/google', payload)),
  register: (payload: RegisterPayload) => unwrap<User>(apiClient.post('/api/auth/register', payload)),
  me: () => unwrap<User>(apiClient.get('/api/auth/me')),
  getUser: (userId: string) => unwrap<User>(apiClient.get(`/api/auth/users/${userId}`))
};
