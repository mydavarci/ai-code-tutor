import { create } from 'zustand';
import api from '../lib/api';
import type { User, ApiResponse, AuthResponse, LoginRequest, SignupRequest } from '@ai-code-tutor/shared';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginRequest) => Promise<void>;
  signup: (credentials: SignupRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);

      if (data.success && data.data) {
        const { user, tokens } = data.data;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signup: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/signup', credentials);

      if (data.success && data.data) {
        const { user, tokens } = data.data;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Signup failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));
