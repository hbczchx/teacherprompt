import { create } from 'zustand';
import type { PromptTemplate } from '../types';
import { builtInTemplates } from '../data/templates';
import { getItem, setItem } from '../utils/storage';

interface TemplateStore {
  allTemplates: PromptTemplate[];
  selectedIds: string[];
  filledValues: Record<string, Record<string, string>>;
  generatedContents: Record<string, string>;

  loadTemplates: () => void;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setFilledValues: (templateId: string, values: Record<string, string>) => void;
  setGeneratedContents: (contents: Record<string, string>) => void;
  resetEditor: () => void;

  addTemplate: (t: PromptTemplate) => void;
  updateTemplate: (t: PromptTemplate) => void;
  deleteTemplate: (id: string) => void;
  incrementUseCount: (ids: string[]) => void;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  allTemplates: [],
  selectedIds: [],
  filledValues: {},
  generatedContents: {},

  loadTemplates: () => {
    const userTemplates = getItem<PromptTemplate[]>('user-templates', []);
    set({ allTemplates: [...builtInTemplates, ...userTemplates] });
  },

  toggleSelect: (id) => {
    const { selectedIds } = get();
    if (selectedIds.includes(id)) {
      set({ selectedIds: selectedIds.filter((x) => x !== id) });
    } else {
      set({ selectedIds: [...selectedIds, id] });
    }
  },

  selectAll: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  setFilledValues: (templateId, values) => {
    set((s) => ({
      filledValues: { ...s.filledValues, [templateId]: values },
    }));
  },

  setGeneratedContents: (contents) => set({ generatedContents: contents }),
  resetEditor: () => set({ selectedIds: [], filledValues: {}, generatedContents: {} }),

  addTemplate: (t) => {
    const userTemplates = getItem<PromptTemplate[]>('user-templates', []);
    userTemplates.push(t);
    setItem('user-templates', userTemplates);
    get().loadTemplates();
  },

  updateTemplate: (t) => {
    const userTemplates = getItem<PromptTemplate[]>('user-templates', []);
    const idx = userTemplates.findIndex((x) => x.id === t.id);
    if (idx >= 0) {
      userTemplates[idx] = t;
      setItem('user-templates', userTemplates);
      get().loadTemplates();
    }
  },

  deleteTemplate: (id) => {
    const userTemplates = getItem<PromptTemplate[]>('user-templates', []);
    setItem('user-templates', userTemplates.filter((x) => x.id !== id));
    get().loadTemplates();
  },

  incrementUseCount: (ids) => {
    const userTemplates = getItem<PromptTemplate[]>('user-templates', []);
    let changed = false;
    for (const t of userTemplates) {
      if (ids.includes(t.id)) {
        t.useCount++;
        changed = true;
      }
    }
    if (changed) {
      setItem('user-templates', userTemplates);
      get().loadTemplates();
    }
  },
}));
