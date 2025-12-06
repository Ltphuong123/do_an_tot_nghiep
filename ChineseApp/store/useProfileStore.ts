import { IAchievements, IStreak } from "@/types/home.type";
import { TranslationStatistics } from "@/types/profile.type";
import { create } from "zustand";

interface ProfileState {
  // Cache cho Achievements
  achievements: IAchievements[];
  setAchievements: (data: IAchievements[]) => void;

  // Cache cho Chart (Streak)
  chartStreak: IStreak | null;
  setChartStreak: (data: IStreak | null) => void;

  // Cache cho Translation Statistics
  translationStats: TranslationStatistics | null;
  setTranslationStats: (data: TranslationStatistics | null) => void;

  // Clear all cache
  clearCache: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  // Achievements
  achievements: [],
  setAchievements: (data) => set({ achievements: data }),

  // Chart Streak
  chartStreak: null,
  setChartStreak: (data) => set({ chartStreak: data }),

  // Translation Statistics
  translationStats: null,
  setTranslationStats: (data) => set({ translationStats: data }),

  // Clear all cache
  clearCache: () =>
    set({
      achievements: [],
      chartStreak: null,
      translationStats: null,
    }),
}));
