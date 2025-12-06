import { ITip, TLevelTip } from "@/types/tips.type";
import { create } from "zustand";

interface TipsState {
  tipsStore: ITip[];
  tipsGeneralStore: ITip[];
  tipsStudyStore: ITip[];
  // Cache theo level để không phải fetch lại
  levelCache: Record<TLevelTip, ITip[]>;
  setTipsStore: (tips: ITip[]) => void;
  setTipsGeneralStore: (tips: ITip[]) => void;
  setTipsStudyStore: (tips: ITip[]) => void;
  setLevelCache: (level: TLevelTip, tips: ITip[]) => void;
  clearCache: () => void;
}

export const useTipsStore = create<TipsState>((set) => ({
  tipsStore: [],
  setTipsStore: (tips) => set({ tipsStore: tips }),
  tipsGeneralStore: [],
  setTipsGeneralStore: (tips) => set({ tipsGeneralStore: tips }),
  tipsStudyStore: [],
  setTipsStudyStore: (tips) => set({ tipsStudyStore: tips }),
  levelCache: {
    "Sơ cấp": [],
    "Trung cấp": [],
    "Cao cấp": [],
  },
  setLevelCache: (level, tips) =>
    set((state) => ({
      levelCache: {
        ...state.levelCache,
        [level]: tips,
      },
    })),
  clearCache: () =>
    set({
      levelCache: {
        "Sơ cấp": [],
        "Trung cấp": [],
        "Cao cấp": [],
      },
    }),
}));
