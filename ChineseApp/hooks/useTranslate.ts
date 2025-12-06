import { homeKeys } from "@/hooks/useHome";
import {
  deleteTranslateHistory,
  getTranslateHistory,
  getTranslateStats,
  getTranslateTodayCount,
  translate,
  translateWithAI,
} from "@/services/translate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const translateKeys = {
  all: ["translate"] as const,
  history: (page: number, limit: number) =>
    [...translateKeys.all, "history", page, limit] as const,
  todayCount: () => [...translateKeys.all, "todayCount"] as const,
  stats: () => [...translateKeys.all, "stats"] as const,
};

// Translate History Query
export const useTranslateHistory = (page: number, limit: number) => {
  return useQuery({
    queryKey: translateKeys.history(page, limit),
    queryFn: async () => {
      const response = await getTranslateHistory(page, limit);
      if (!response.success) {
        throw new Error("Failed to fetch translate history");
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Translate Today Count Query
export const useTranslateTodayCount = () => {
  return useQuery({
    queryKey: translateKeys.todayCount(),
    queryFn: async () => {
      const response = await getTranslateTodayCount();
      if (!response.success) {
        throw new Error("Failed to fetch translate today count");
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Translate Stats Query
export const useTranslateStats = () => {
  return useQuery({
    queryKey: translateKeys.stats(),
    queryFn: async () => {
      const response = await getTranslateStats();
      if (!response.success) {
        throw new Error("Failed to fetch translate stats");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};

// Translate Mutation
export const useTranslate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      text,
      direction,
      isAI,
    }: {
      text: string;
      direction: string;
      isAI?: boolean;
    }) => translate(text, direction, isAI),
    onSuccess: () => {
      // Optimistically update today count
      queryClient.setQueryData(
        translateKeys.todayCount(),
        (old: number | undefined) => (old || 0) + 1
      );
      // Invalidate streaks to refetch latest data
      queryClient.invalidateQueries({ queryKey: homeKeys.streaks() });
    },
  });
};

// Translate with AI Mutation
export const useTranslateWithAI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ text, direction }: { text: string; direction: string }) =>
      translateWithAI(text, direction),
    onSuccess: () => {
      // Optimistically update today count
      queryClient.setQueryData(
        translateKeys.todayCount(),
        (old: number | undefined) => (old || 0) + 1
      );
      // Invalidate streaks to refetch latest data
      queryClient.invalidateQueries({ queryKey: homeKeys.streaks() });
    },
  });
};

// Delete Translate History Mutation
export const useDeleteTranslateHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (historyId: string) => deleteTranslateHistory(historyId),
    onSuccess: () => {
      // Invalidate history after deleting
      queryClient.invalidateQueries({ queryKey: translateKeys.all });
    },
  });
};
