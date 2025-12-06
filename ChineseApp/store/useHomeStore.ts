import { ILeaderboardEntry, IStreak } from "@/types/home.type";
import { IExam, IExamType } from "@/types/mockTest.type";
import { create } from "zustand";

interface HomeState {
  // Cache cho Personal Stats
  streaks: IStreak | null;
  setStreaks: (streaks: IStreak | null) => void;

  // Cache cho Daily Translation
  dailyTranslation: number | null;
  setDailyTranslation: (count: number | null) => void;

  // Cache cho Mock Test Leaderboard
  leaderboard: ILeaderboardEntry[];
  examTypes: IExamType[];
  selectedExamType: IExamType | null;
  currentExam: IExam | null;
  setLeaderboard: (data: ILeaderboardEntry[]) => void;
  setExamTypes: (types: IExamType[]) => void;
  setSelectedExamType: (type: IExamType | null) => void;
  setCurrentExam: (exam: IExam | null) => void;

  // Clear all cache
  clearCache: () => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  // Personal Stats
  streaks: null,
  setStreaks: (streaks) => set({ streaks }),

  // Daily Translation
  dailyTranslation: null,
  setDailyTranslation: (count) => set({ dailyTranslation: count }),

  // Mock Test Leaderboard
  leaderboard: [],
  examTypes: [],
  selectedExamType: null,
  currentExam: null,
  setLeaderboard: (data) => set({ leaderboard: data }),
  setExamTypes: (types) => set({ examTypes: types }),
  setSelectedExamType: (type) => set({ selectedExamType: type }),
  setCurrentExam: (exam) => set({ currentExam: exam }),

  // Clear all cache
  clearCache: () =>
    set({
      streaks: null,
      dailyTranslation: null,
      leaderboard: [],
      examTypes: [],
      selectedExamType: null,
      currentExam: null,
    }),
}));
