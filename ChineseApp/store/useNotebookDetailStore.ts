import { INoteBookVocabItem } from "@/types/notebook.type";
import { create } from "zustand";

interface NotebookDetailState {
  notebookDetail: INoteBookVocabItem[] | null;
  setNotebookDetail: (detail: INoteBookVocabItem[] | null) => void;
}

export const useNotebookDetailStore = create<NotebookDetailState>((set) => ({
  notebookDetail: null,
  setNotebookDetail: (detail) => set({ notebookDetail: detail }),
}));
