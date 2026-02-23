import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

// API Error interface
export interface APIError {
  detail: string;
  status: number;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<APIError>) => {
    const status = error.response?.status || 500;
    const message = error.response?.data?.detail || '网络错误';
    
    // Handle 401 - Unauthorized
    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    
    return Promise.reject({ message, status });
  }
);

export default apiClient;
