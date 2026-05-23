import { create } from 'zustand';
import type { PromptHistory } from '../types';
import { getItem, setItem } from '../utils/storage';

interface HistoryStore {
  histories: PromptHistory[];
  load: () => void;
  add: (h: PromptHistory) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  histories: [],

  load: () => {
    set({ histories: getItem<PromptHistory[]>('history', []) });
  },

  add: (h) => {
    const histories = [h, ...get().histories].slice(0, 50);
    setItem('history', histories);
    set({ histories });
  },

  remove: (id) => {
    const histories = get().histories.filter((x) => x.id !== id);
    setItem('history', histories);
    set({ histories });
  },

  clear: () => {
    setItem('history', []);
    set({ histories: [] });
  },
}));
