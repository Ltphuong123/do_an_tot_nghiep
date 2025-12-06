import { create } from "zustand";

interface titleState {
  title: "notebook" | "ai-lesson";
  setTitle: (title: "notebook" | "ai-lesson") => void;
}

export const useTitleTranslateOrAi = create<titleState>((set) => ({
  title: "notebook",
  setTitle: (title) => set({ title }),
}));
