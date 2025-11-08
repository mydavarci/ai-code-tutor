import { create } from 'zustand';
import api from '../lib/api';
import type {
  Exercise,
  Category,
  Difficulty,
  ApiResponse,
  GenerateExerciseResponse,
  SubmitCodeResponse,
} from '@ai-code-tutor/shared';

interface ExerciseState {
  currentExercise: (Exercise & { solution?: string; solutionExplanation?: string }) | null;
  isLoading: boolean;
  error: string | null;
  lastSubmission: SubmitCodeResponse | null;

  generateExercise: (category: Category, topicId: string, difficulty: Difficulty) => Promise<void>;
  submitCode: (exerciseId: string, code: string) => Promise<SubmitCodeResponse>;
  getSolution: (exerciseId: string) => Promise<void>;
  clearExercise: () => void;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  currentExercise: null,
  isLoading: false,
  error: null,
  lastSubmission: null,

  generateExercise: async (category, topicId, difficulty) => {
    set({ isLoading: true, error: null, lastSubmission: null });
    try {
      const { data } = await api.post<ApiResponse>('/exercises/generate', {
        category,
        topicId,
        difficulty,
      });

      if (data.success && data.data) {
        set({ currentExercise: data.data, isLoading: false });
      }
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to generate exercise';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  submitCode: async (exerciseId, code) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<ApiResponse<SubmitCodeResponse>>('/submissions', {
        exerciseId,
        code,
      });

      if (data.success && data.data) {
        set({ lastSubmission: data.data, isLoading: false });
        return data.data;
      }

      throw new Error('Submission failed');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to submit code';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getSolution: async (exerciseId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<ApiResponse>('/exercises/solution', { exerciseId });

      if (data.success && data.data) {
        const currentExercise = get().currentExercise;
        if (currentExercise) {
          set({
            currentExercise: {
              ...currentExercise,
              solution: data.data.solution,
              solutionExplanation: data.data.explanation,
            },
            isLoading: false,
          });
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to get solution';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearExercise: () => set({ currentExercise: null, lastSubmission: null, error: null }),
}));
