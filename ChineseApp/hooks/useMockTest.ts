import {
  getAllExamLevel,
  getAllExamType,
  getAllMockTests,
  getHistoryExamByName,
  getHistoryExams,
  getLeaderboard,
  getLeaderboardByExamLevel,
  getLeaderboardByExamType,
  getResult,
  saveAnswer,
  startExam,
  submitAnswers,
  submitExam,
} from "@/services/mockTest";
import { getTipList } from "@/services/tips";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const mockTestKeys = {
  all: ["mockTest"] as const,
  examTypes: () => [...mockTestKeys.all, "examTypes"] as const,
  examLevels: (examTypeId: string) =>
    [...mockTestKeys.all, "examLevels", examTypeId] as const,
  mockTests: (examTypeId?: string, examLevelId?: string) =>
    [...mockTestKeys.all, "mockTests", examTypeId, examLevelId] as const,
  tips: () => [...mockTestKeys.all, "tips"] as const,
  history: (page: number, limit: number) =>
    [...mockTestKeys.all, "history", page, limit] as const,
  leaderboard: (examId: string) =>
    [...mockTestKeys.all, "leaderboard", examId] as const,
  result: (resultId: string) =>
    [...mockTestKeys.all, "result", resultId] as const,
};

// Exam Types Query
export const useExamTypes = () => {
  return useQuery({
    queryKey: mockTestKeys.examTypes(),
    queryFn: async () => {
      const response = await getAllExamType();
      if (!response.success) {
        throw new Error("Failed to fetch exam types");
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Exam Levels Query
export const useExamLevels = (examTypeId: string) => {
  return useQuery({
    queryKey: mockTestKeys.examLevels(examTypeId),
    queryFn: async () => {
      const response = await getAllExamLevel(examTypeId);
      if (!response.success) {
        throw new Error("Failed to fetch exam levels");
      }
      return response.data;
    },
    enabled: !!examTypeId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Mock Tests Query
export const useMockTests = (examTypeId?: string, examLevelId?: string) => {
  return useQuery({
    queryKey: mockTestKeys.mockTests(examTypeId, examLevelId),
    queryFn: async () => {
      const response = await getAllMockTests(examTypeId, examLevelId);
      if (!response.success) {
        throw new Error("Failed to fetch mock tests");
      }
      return response.data;
    },
    enabled: !!examTypeId || !!examLevelId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

// Tips Query
export const useTips = () => {
  return useQuery({
    queryKey: mockTestKeys.tips(),
    queryFn: async () => {
      const response = await getTipList();
      if (!response.success) {
        throw new Error("Failed to fetch tips");
      }
      return response.data.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
};

// Start Exam Mutation
export const useStartExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => startExam(examId),
    onSuccess: (data, examId) => {
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: mockTestKeys.mockTests() });
    },
  });
};

// Save Answer Mutation
export const useSaveAnswer = () => {
  return useMutation({
    mutationFn: ({
      questionId,
      userResponse,
    }: {
      questionId: string;
      userResponse: any;
    }) => saveAnswer(questionId, userResponse),
  });
};

// Submit Answers Mutation
export const useSubmitAnswers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attemptsId,
      answers,
    }: {
      attemptsId: string;
      answers: any[];
    }) => submitAnswers(attemptsId, answers),
    onSuccess: () => {
      // Invalidate history after submitting answers
      queryClient.invalidateQueries({ queryKey: ["mockTest", "history"] });
    },
  });
};

// Submit Exam Mutation
export const useSubmitExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptsId: string) => submitExam(attemptsId),
    onSuccess: () => {
      // Invalidate history and leaderboard after submitting exam
      queryClient.invalidateQueries({ queryKey: ["mockTest", "history"] });
      queryClient.invalidateQueries({
        queryKey: ["mockTest", "historyByName"],
      });
      queryClient.invalidateQueries({ queryKey: ["mockTest", "leaderboard"] });
    },
  });
};

// Get Result Query
export const useExamResult = (resultId: string) => {
  return useQuery({
    queryKey: mockTestKeys.result(resultId),
    queryFn: async () => {
      const response = await getResult(resultId);
      if (!response.success) {
        throw new Error("Failed to fetch exam result");
      }
      return response.data;
    },
    enabled: !!resultId,
    staleTime: 0, // Always fresh for results
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
};

// History Exams Query
export const useHistoryExams = (page: number, limit: number) => {
  return useQuery({
    queryKey: mockTestKeys.history(page, limit),
    queryFn: async () => {
      const response = await getHistoryExams(page, limit);
      if (!response.success) {
        throw new Error("Failed to fetch exam history");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};

// History Exam by Name Query
export const useHistoryExamByName = (
  exam_type_id: string,
  exam_level_id: string,
  exam_name: string
) => {
  return useQuery({
    queryKey: [
      ...mockTestKeys.all,
      "historyByName",
      exam_type_id,
      exam_level_id,
      exam_name,
    ],
    queryFn: async () => {
      const response = await getHistoryExamByName(
        exam_type_id,
        exam_level_id,
        exam_name
      );
      if (!response.success) {
        throw new Error("Failed to fetch history by exam name");
      }
      return response.data;
    },
    enabled: !!exam_type_id && !!exam_level_id && !!exam_name,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
};

// Leaderboard Query
export const useLeaderboard = (examId: string) => {
  return useQuery({
    queryKey: mockTestKeys.leaderboard(examId),
    queryFn: async () => {
      const response = await getLeaderboard(examId);
      if (!response.success) {
        throw new Error("Failed to fetch leaderboard");
      }
      return response.data;
    },
    enabled: !!examId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Leaderboard by Exam Level Query
export const useLeaderboardByExamLevel = (examLevelId: string) => {
  return useQuery({
    queryKey: [...mockTestKeys.leaderboard(""), "byLevel", examLevelId],
    queryFn: async () => {
      const response = await getLeaderboardByExamLevel(examLevelId);
      if (!response.success) {
        throw new Error("Failed to fetch leaderboard by exam level");
      }
      return response.data;
    },
    enabled: !!examLevelId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Leaderboard by Exam Type Query
export const useLeaderboardByExamType = (examTypeId: string) => {
  return useQuery({
    queryKey: [...mockTestKeys.leaderboard(""), "byType", examTypeId],
    queryFn: async () => {
      const response = await getLeaderboardByExamType(examTypeId);
      if (!response.success) {
        throw new Error("Failed to fetch leaderboard by exam type");
      }
      return response.data;
    },
    enabled: !!examTypeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
