import { getAchievements, getListBadges, getStreaks } from "@/services/home";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const homeKeys = {
  all: ["home"] as const,
  streaks: () => [...homeKeys.all, "streaks"] as const,
  achievements: () => [...homeKeys.all, "achievements"] as const,
  badges: () => [...homeKeys.all, "badges"] as const,
};

// Streaks Query
export const useStreaks = () => {
  return useQuery({
    queryKey: homeKeys.streaks(),
    queryFn: async () => {
      const response = await getStreaks();
      if (!response.success) {
        throw new Error("Failed to fetch streaks");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};

// Achievements Query
export const useAchievements = () => {
  return useQuery({
    queryKey: homeKeys.achievements(),
    queryFn: async () => {
      const response = await getAchievements();
      if (!response.success) {
        throw new Error("Failed to fetch achievements");
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Badges Query
export const useBadges = () => {
  return useQuery({
    queryKey: homeKeys.badges(),
    queryFn: async () => {
      const response = await getListBadges();
      if (!response.success) {
        throw new Error("Failed to fetch badges");
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};
