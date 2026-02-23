import apiClient from './client';
import type { Token, UserCreateSchema, UserResponseSchema } from '@/types';

export const authApi = {
  // Login - uses form-urlencoded
  login: async (username: string, password: string): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await apiClient.post('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },
  
  // Register
  register: async (data: UserCreateSchema): Promise<UserResponseSchema> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  
  // Get current user
  getMe: async (token?: string): Promise<UserResponseSchema> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await apiClient.get('/auth/me', { headers });
    return response.data;
  },
  
  // Get user by ID
  getUser: async (userId: number): Promise<UserResponseSchema> => {
    const response = await apiClient.get(`/auth/users/${userId}`);
    return response.data;
  },
};
