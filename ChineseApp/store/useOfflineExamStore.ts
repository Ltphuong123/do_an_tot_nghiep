import { IExam, IExamDetail } from "@/types/mockTest.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface IOfflineExam extends IExam {
  downloadedAt: string;
  examDetail?: IExamDetail; // Chi tiết bài thi bao gồm câu hỏi
}

interface OfflineExamState {
  offlineExams: IOfflineExam[];
  downloadingExams: string[]; // List exam IDs đang download
  setOfflineExams: (exams: IOfflineExam[]) => void;
  addOfflineExam: (exam: IOfflineExam) => Promise<void>;
  removeOfflineExam: (examId: string) => Promise<void>;
  getOfflineExam: (examId: string) => IOfflineExam | undefined;
  loadOfflineExamsFromStorage: () => Promise<void>;
  setDownloadingExam: (examId: string, isDownloading: boolean) => void;
  isExamDownloaded: (examId: string) => boolean;
  isExamDownloading: (examId: string) => boolean;
  clearAllOfflineExams: () => Promise<void>;
}

const OFFLINE_EXAMS_STORAGE_KEY = "@offline_exams";

export const useOfflineExamStore = create<OfflineExamState>((set, get) => ({
  offlineExams: [],
  downloadingExams: [],

  setOfflineExams: (exams) => set({ offlineExams: exams }),

  addOfflineExam: async (exam: IOfflineExam) => {
    try {
      const currentExams = get().offlineExams;
      const existingIndex = currentExams.findIndex((e) => e.id === exam.id);

      let updatedExams: IOfflineExam[];
      if (existingIndex >= 0) {
        // Update existing exam
        updatedExams = [...currentExams];
        updatedExams[existingIndex] = exam;
      } else {
        // Add new exam
        updatedExams = [...currentExams, exam];
      }

      await AsyncStorage.setItem(
        OFFLINE_EXAMS_STORAGE_KEY,
        JSON.stringify(updatedExams)
      );
      set({ offlineExams: updatedExams });
    } catch (error) {
      console.error("Error saving offline exam:", error);
      throw error;
    }
  },

  removeOfflineExam: async (examId: string) => {
    try {
      const currentExams = get().offlineExams;
      const updatedExams = currentExams.filter((exam) => exam.id !== examId);

      await AsyncStorage.setItem(
        OFFLINE_EXAMS_STORAGE_KEY,
        JSON.stringify(updatedExams)
      );
      set({ offlineExams: updatedExams });
    } catch (error) {
      console.error("Error removing offline exam:", error);
      throw error;
    }
  },

  getOfflineExam: (examId: string) => {
    const exams = get().offlineExams;
    return exams.find((exam) => exam.id === examId);
  },

  loadOfflineExamsFromStorage: async () => {
    try {
      const storedExams = await AsyncStorage.getItem(OFFLINE_EXAMS_STORAGE_KEY);
      if (storedExams) {
        const parsedExams = JSON.parse(storedExams) as IOfflineExam[];
        set({ offlineExams: parsedExams });
      }
    } catch (error) {
      console.error("Error loading offline exams from storage:", error);
    }
  },

  setDownloadingExam: (examId: string, isDownloading: boolean) => {
    const currentDownloading = get().downloadingExams;
    if (isDownloading) {
      if (!currentDownloading.includes(examId)) {
        set({ downloadingExams: [...currentDownloading, examId] });
      }
    } else {
      set({
        downloadingExams: currentDownloading.filter((id) => id !== examId),
      });
    }
  },

  isExamDownloaded: (examId: string) => {
    const exams = get().offlineExams;
    return exams.some((exam) => exam.id === examId);
  },

  isExamDownloading: (examId: string) => {
    const downloading = get().downloadingExams;
    return downloading.includes(examId);
  },

  clearAllOfflineExams: async () => {
    try {
      await AsyncStorage.removeItem(OFFLINE_EXAMS_STORAGE_KEY);
      set({ offlineExams: [], downloadingExams: [] });
    } catch (error) {
      console.error("Error clearing offline exams:", error);
      throw error;
    }
  },
}));
