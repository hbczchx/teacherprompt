import { create } from 'zustand';
import type { PromptTemplate } from '../types';
import { builtInTemplates } from '../data/templates';
import { getItem, setItem } from '../utils/storage';

const MAX_USER_TEMPLATES = 3;

function userKey(phone: string) {
  return `user-templates:${phone}`;
}

function getUserTemplates(): PromptTemplate[] {
  const phone = localStorage.getItem('teacherprompt:user');
  if (!phone) return [];
  return getItem<PromptTemplate[]>(userKey(phone), []);
}

function saveUserTemplates(templates: PromptTemplate[]) {
  const phone = localStorage.getItem('teacherprompt:user');
  if (!phone) return;
  setItem(userKey(phone), templates);
}

interface TemplateStore {
  allTemplates: PromptTemplate[];
  selectedId: string | null;
  filledValues: Record<string, string>;
  generatedContent: string;

  loadTemplates: () => void;
  selectTemplate: (id: string) => void;
  clearSelection: () => void;
  setFilledValues: (values: Record<string, string>) => void;
  setGeneratedContent: (content: string) => void;
  resetEditor: () => void;

  addTemplate: (t: PromptTemplate) => boolean;
  updateTemplate: (t: PromptTemplate) => void;
  deleteTemplate: (id: string) => void;
  incrementUseCount: (id: string) => void;
  canAddTemplate: () => boolean;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  allTemplates: [],
  selectedId: null,
  filledValues: {},
  generatedContent: '',

  loadTemplates: () => {
    const userTemplates = getUserTemplates();
    set({ allTemplates: [...builtInTemplates, ...userTemplates] });
  },

  selectTemplate: (id) => set({ selectedId: id }),
  clearSelection: () => set({ selectedId: null }),

  setFilledValues: (values) => set({ filledValues: values }),
  setGeneratedContent: (content) => set({ generatedContent: content }),
  resetEditor: () => set({ selectedId: null, filledValues: {}, generatedContent: '' }),

  canAddTemplate: () => {
    const userTemplates = getUserTemplates();
    return userTemplates.length < MAX_USER_TEMPLATES;
  },

  addTemplate: (t) => {
    const userTemplates = getUserTemplates();
    if (userTemplates.length >= MAX_USER_TEMPLATES) return false;
    userTemplates.push(t);
    saveUserTemplates(userTemplates);
    get().loadTemplates();
    return true;
  },

  updateTemplate: (t) => {
    const userTemplates = getUserTemplates();
    const idx = userTemplates.findIndex((x) => x.id === t.id);
    if (idx >= 0) {
      userTemplates[idx] = t;
      saveUserTemplates(userTemplates);
      get().loadTemplates();
    }
  },

  deleteTemplate: (id) => {
    const userTemplates = getUserTemplates();
    saveUserTemplates(userTemplates.filter((x) => x.id !== id));
    get().loadTemplates();
  },

  incrementUseCount: (id) => {
    const userTemplates = getUserTemplates();
    const changed = userTemplates.some((t) => {
      if (t.id === id) { t.useCount++; return true; }
      return false;
    });
    if (changed) {
      saveUserTemplates(userTemplates);
      get().loadTemplates();
    }
  },
}));
