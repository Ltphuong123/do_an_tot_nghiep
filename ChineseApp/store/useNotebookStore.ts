import { INoteBook } from "@/types/notebook.type";
import { create } from "zustand";

interface NotebookState {
  personalNotebook: INoteBook[];
  freeNotebook: INoteBook[];
  premiumNotebook: INoteBook[];
  learningNotebook: INoteBook[];
  notebookLoaded: boolean; // Flag để biết đã load notebook chưa
  setPersonalNotebook: (notebooks: INoteBook[]) => void;
  setFreeNotebook: (notebooks: INoteBook[]) => void;
  setPremiumNotebook: (notebooks: INoteBook[]) => void;
  setLearningNotebook: (notebooks: INoteBook[]) => void;
  setNotebookLoaded: (loaded: boolean) => void;
  updateNotebookVocabCount: (notebookId: string, newCount: number) => void;
  clearNotebookCache: () => void;
}

export const useNotebookStore = create<NotebookState>((set) => ({
  personalNotebook: [],
  setPersonalNotebook: (notebooks) => set({ personalNotebook: notebooks }),
  freeNotebook: [],
  setFreeNotebook: (notebooks) => set({ freeNotebook: notebooks }),
  premiumNotebook: [],
  setPremiumNotebook: (notebooks) => set({ premiumNotebook: notebooks }),
  learningNotebook: [],
  setLearningNotebook: (notebooks) => set({ learningNotebook: notebooks }),
  notebookLoaded: false,
  setNotebookLoaded: (loaded) => set({ notebookLoaded: loaded }),
  clearNotebookCache: () =>
    set({
      personalNotebook: [],
      freeNotebook: [],
      premiumNotebook: [],
      learningNotebook: [],
      notebookLoaded: false,
    }),
  updateNotebookVocabCount: (notebookId: string, newCount: number) =>
    set((state) => {
      // Tìm notebook trong personalNotebook
      const personalIndex = state.personalNotebook.findIndex(
        (nb) => nb.id === notebookId
      );
      if (personalIndex !== -1) {
        const updatedPersonal = [...state.personalNotebook];
        updatedPersonal[personalIndex] = {
          ...updatedPersonal[personalIndex],
          vocab_count: newCount,
        };
        return { personalNotebook: updatedPersonal };
      }

      // Tìm notebook trong freeNotebook
      const freeIndex = state.freeNotebook.findIndex(
        (nb) => nb.id === notebookId
      );
      if (freeIndex !== -1) {
        const updatedFree = [...state.freeNotebook];
        updatedFree[freeIndex] = {
          ...updatedFree[freeIndex],
          vocab_count: newCount,
        };
        return { freeNotebook: updatedFree };
      }

      // Tìm notebook trong premiumNotebook
      const premiumIndex = state.premiumNotebook.findIndex(
        (nb) => nb.id === notebookId
      );
      if (premiumIndex !== -1) {
        const updatedPremium = [...state.premiumNotebook];
        updatedPremium[premiumIndex] = {
          ...updatedPremium[premiumIndex],
          vocab_count: newCount,
        };
        return { premiumNotebook: updatedPremium };
      }

      // Nếu không tìm thấy, không thay đổi gì
      return {};
    }),
}));
