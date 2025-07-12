import { create } from 'zustand';
import { Question } from '@/types';

interface QuestionState {
  questions: Question[];
  currentQuestion: Question | null;
  loading: boolean;
  error: string | null;
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
}

export const useQuestionStore = create<QuestionState>((set) => ({
  questions: [],
  currentQuestion: null,
  loading: false,
  error: null,
  setQuestions: (questions) => set({ questions }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addQuestion: (question) => set((state) => ({ questions: [question, ...state.questions] })),
  updateQuestion: (id, updates) => set((state) => ({
    questions: state.questions.map(q => q.id === id ? { ...q, ...updates } : q),
    currentQuestion: state.currentQuestion?.id === id 
      ? { ...state.currentQuestion, ...updates } 
      : state.currentQuestion
  })),
  deleteQuestion: (id) => set((state) => ({
    questions: state.questions.filter(q => q.id !== id),
    currentQuestion: state.currentQuestion?.id === id ? null : state.currentQuestion
  }))
}));