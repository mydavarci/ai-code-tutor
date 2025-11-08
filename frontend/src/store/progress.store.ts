import { create } from 'zustand';
import api from '../lib/api';
import type { UserProgress, Streak, CategoryData, ApiResponse } from '@ai-code-tutor/shared';

interface ProgressState {
  progress: UserProgress | null;
  streak: Streak | null;
  categories: CategoryData[];
  isLoading: boolean;
  error: string | null;

  fetchProgress: () => Promise<void>;
  fetchStreak: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: null,
  streak: null,
  categories: [],
  isLoading: false,
  error: null,

  fetchProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<ApiResponse<UserProgress>>('/progress');

      if (data.success && data.data) {
        set({ progress: data.data, isLoading: false });
      }
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch progress';
      set({ error: message, isLoading: false });
    }
  },

  fetchStreak: async () => {
    try {
      const { data } = await api.get<ApiResponse<Streak>>('/progress/streak');

      if (data.success && data.data) {
        set({ streak: data.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch streak:', error);
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<ApiResponse<CategoryData[]>>('/topics');

      if (data.success && data.data) {
        set({ categories: data.data, isLoading: false });
      }
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to fetch categories';
      set({ error: message, isLoading: false });
    }
  },
}));
