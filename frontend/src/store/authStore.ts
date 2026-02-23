import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponseSchema } from '@/types';

interface AuthState {
  token: string | null;
  user: UserResponseSchema | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserResponseSchema) => void;
  logout: () => void;
  updateUser: (user: Partial<UserResponseSchema>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      setAuth: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },
      
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'chemezy-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
