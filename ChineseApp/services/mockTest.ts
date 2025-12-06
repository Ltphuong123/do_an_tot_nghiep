import { useOfflineExamStore } from "@/store/useOfflineExamStore";
import { DataSuccess, IMeta, IResponseSuccess } from "@/types/common.type";
import { ILeaderboardEntry } from "@/types/home.type";
import { AudioDownloadManager } from "@/utils/audio-download-manager";

import {
  IExam,
  IExamDetail,
  IExamLevel,
  IExamType,
  IHistoryExam,
  ILeaderboardByExamLevel,
  ILeaderboardByExamType,
  IResultExam,
  IStartExamResponse,
  IUserAnswerProgress,
  IUserTestProgress,
} from "@/types/mockTest.type";
import axios from "./index";

// ============ OFFLINE FUNCTIONS ============

export const downloadExamForOffline = async (
  examId: string,
  examInfo: IExam,
  onProgress?: (progress: number, message?: string) => void
): Promise<DataSuccess<boolean>> => {
  try {
    const { setDownloadingExam, addOfflineExam } =
      useOfflineExamStore.getState();

    // Set downloading state
    setDownloadingExam(examId, true);
    onProgress?.(10, "Đang tải thông tin bài thi...");

    // Fetch exam detail with questions
    const examDetailResponse = await startExam(examId);
    if (!examDetailResponse.success) {
      throw new Error("Không thể tải chi tiết bài thi");
    }
    onProgress?.(40, "Đang kiểm tra file audio...");

    // Collect all audio URLs from the exam
    const audioUrls: string[] = [];
    const exam = examDetailResponse.data.exam;

    // Collect audio from sections, subsections, and questions
    exam.sections?.forEach((section) => {
      // Section audio
      if (section.audio_url) {
        audioUrls.push(section.audio_url);
      }

      // Subsection audio and questions
      section.subsections?.forEach((subsection) => {
        if (subsection.audio_url) {
          audioUrls.push(subsection.audio_url);
        }

        // Questions audio
        subsection.questions?.forEach((question) => {
          if (question.audio_url) {
            audioUrls.push(question.audio_url);
          }

          // Options audio
          question.options?.forEach((option) => {
            if (option.audio_url) {
              audioUrls.push(option.audio_url);
            }
          });
        });

        // Prompts audio
        subsection.prompts?.forEach((prompt) => {
          if (prompt.audio_url) {
            audioUrls.push(prompt.audio_url);
          }

          // Questions in prompts
          prompt.questions?.forEach((question) => {
            if (question.audio_url) {
              audioUrls.push(question.audio_url);
            }

            question.options?.forEach((option) => {
              if (option.audio_url) {
                audioUrls.push(option.audio_url);
              }
            });
          });
        });
      });
    });

    // Download audio files if any exist
    if (audioUrls.length > 0) {
      onProgress?.(50, `Đang tải ${audioUrls.length} file audio...`);

      try {
        await AudioDownloadManager.downloadMultipleAudios(
          audioUrls,
          (currentIndex, totalCount) => {
            const audioProgress = 50 + ((currentIndex + 1) / totalCount) * 30;
            onProgress?.(
              Math.round(audioProgress),
              `Đang tải audio ${currentIndex + 1}/${totalCount}...`
            );
          }
        );
      } catch (audioError) {
        console.warn("Failed to download some audio files:", audioError);
        // Continue even if audio download fails
      }
    }

    onProgress?.(90, "Đang lưu bài thi...");

    // Create offline exam object with all required properties
    const offlineExam = {
      ...examInfo, // Use the passed exam info which has all required IExam properties
      downloadedAt: new Date().toISOString(),
      examDetail: examDetailResponse.data.exam,
    };

    // Save to offline store
    await addOfflineExam(offlineExam);

    onProgress?.(100, "Hoàn tất tải bài thi!");

    return {
      status: "success",
      code: 200,
      message: "Tải bài thi thành công ",
      data: true,
    };
  } catch (error: any) {
    console.error("Error downloading exam:", error);
    throw new Error(error.message || "Lỗi khi tải bài thi");
  } finally {
    const { setDownloadingExam } = useOfflineExamStore.getState();
    setDownloadingExam(examId, false);
  }
};

export const getDownloadedMockTests = async (): Promise<
  DataSuccess<IExam[]>
> => {
  try {
    const { loadOfflineExamsFromStorage, offlineExams } =
      useOfflineExamStore.getState();

    // Load from storage if not already loaded
    if (offlineExams.length === 0) {
      await loadOfflineExamsFromStorage();
    }

    const { offlineExams: updatedExams } = useOfflineExamStore.getState();

    return {
      status: "success",
      code: 200,
      message: "Lấy dữ liệu bài thi thử đã tải về thành công",
      data: updatedExams,
    };
  } catch (error) {
    console.error("Error getting downloaded tests:", error);
    return {
      status: "success",
      code: 200,
      message: "Lấy dữ liệu bài thi thử đã tải về thành công",
      data: [],
    };
  }
};

export const removeDownloadedExam = async (
  examId: string
): Promise<DataSuccess<boolean>> => {
  try {
    const { removeOfflineExam } = useOfflineExamStore.getState();
    await removeOfflineExam(examId);

    return {
      status: "success",
      code: 200,
      message: "Xóa bài thi khỏi thiết bị thành công",
      data: true,
    };
  } catch (error: any) {
    console.error("Error removing downloaded exam:", error);
    throw new Error("Lỗi khi xóa bài thi");
  }
};

export const getOfflineExamDetail = async (
  examId: string
): Promise<DataSuccess<IExamDetail | null>> => {
  try {
    const { getOfflineExam } = useOfflineExamStore.getState();
    const offlineExam = getOfflineExam(examId);

    if (offlineExam && offlineExam.examDetail) {
      return {
        status: "success",
        code: 200,
        message: "Lấy chi tiết bài thi offline thành công",
        data: offlineExam.examDetail,
      };
    } else {
      return {
        status: "success",
        code: 200,
        message: "Không tìm thấy bài thi offline",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error getting offline exam detail:", error);
    return {
      status: "success",
      code: 200,
      message: "Lỗi khi lấy chi tiết bài thi offline",
      data: null,
    };
  }
};

// ============ SAVE TEST PROGRESS ============
export const saveTestProgress = async (
  progress: IUserTestProgress
): Promise<DataSuccess<boolean>> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Simulate save to backend
  console.log("Saving progress:", progress);

  return {
    status: "success",
    code: 200,
    message: "Lưu tiến trình làm bài thành công",
    data: true,
  };
};

// ============ GET TEST PROGRESS ============
export const getTestProgress = async (
  testId: string,
  userId: string
): Promise<DataSuccess<IUserTestProgress | null>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Simulate no existing progress
  return {
    status: "success",
    code: 200,
    message: "Không có tiến trình làm bài",
    data: null,
  };
};

export const getAllExamType = async (): Promise<
  IResponseSuccess<IExamType[]>
> => {
  const res = await axios.get("/exams/types", {
    requireAuth: true,
  });
  return res.data;
};

export const getAllExamLevel = async (
  examTypeId: string
): Promise<IResponseSuccess<IExamLevel[]>> => {
  const res = await axios.get("/exams/levels/", {
    requireAuth: true,
    params: { examTypeId },
  });
  return res.data;
};

export const getAllMockTests = async (
  examTypeId?: string,
  examLevelId?: string
): Promise<{
  success: boolean;
  data: IExam[];
  meta: IMeta;
}> => {
  console.log("Calling real API to get all mock tests...");
  const res = await axios.get("/exams", {
    requireAuth: true,
    params: {
      examTypeId,
      examLevelId,
      page: 1,
      limit: 9999999,
    },
  });

  return res.data;
};

export const startExam = async (
  examId: string
): Promise<IResponseSuccess<IStartExamResponse>> => {
  const res = await axios.post(
    `/exams/${examId}/start-attempt`,
    {},
    {
      requireAuth: true,
    }
  );

  return res.data;
};

export const saveAnswer = async (questionId: string, userResponse: any) => {
  const res = await axios.post(
    `/attempts/${questionId}/answer`,
    { userResponse },
    {
      requireAuth: true,
    }
  );

  return res.data;
};

export const submitAnswers = async (
  attemptsId: string,
  answers: IUserAnswerProgress[]
): Promise<{ success: boolean; data: { attemptId: string } }> => {
  console.log(
    "Submitting exam with attempt ID:",
    attemptsId,
    "and answers:",
    answers
  );

  const res = await axios.post(
    `/attempts/${attemptsId}/answers`,
    { answers: answers },
    {
      requireAuth: true,
    }
  );
  console.log("Submit answer response from API:", res.data);

  return res.data;
};

export const submitExam = async (
  attemptsId: string
): Promise<{ success: boolean; data: { attemptId: string } }> => {
  console.log("Submitting exam with attempt ID:", attemptsId);
  const res = await axios.post(
    `/attempts/${attemptsId}/submit`,
    {},
    {
      requireAuth: true,
    }
  );
  console.log("Submit exam response from API:", res.data);

  return res.data;
};

export const getResult = async (
  resultId: string
): Promise<{ success: boolean; message: string; data: IResultExam }> => {
  const res = await axios.get(`/attempts/${resultId}/result`, {
    requireAuth: true,
  });
  return res.data;
};

export const getHistoryExams = async (
  page: number,
  limit: number
): Promise<{ success: boolean; data: IHistoryExam[]; meta: IMeta }> => {
  const res = await axios.get(`/users/me/exam-history`, {
    requireAuth: true,
    params: {
      page,
      limit,
    },
  });
  return res.data;
};

export const getLeaderboard = async (
  examId: string
): Promise<IResponseSuccess<ILeaderboardEntry[]>> => {
  const res = await axios.get(`/exams/${examId}/leaderboard`, {
    requireAuth: true,
  });
  return res.data;
};

export const getLeaderboardByExamType = async (
  examTypeId: string
): Promise<IResponseSuccess<ILeaderboardByExamType[]>> => {
  const res = await axios.get(`leaderboard/exam-type/${examTypeId}`, {
    requireAuth: true,
  });
  return res.data;
};

export const getLeaderboardByExamLevel = async (
  examLevelId: string
): Promise<IResponseSuccess<ILeaderboardByExamLevel[]>> => {
  const res = await axios.get(`leaderboard/exam-level/${examLevelId}`, {
    requireAuth: true,
  });
  return res.data;
};

export const getHistoryExamByName = async (
  exam_type_id: string,
  exam_level_id: string,
  exam_name: string
): Promise<{ success: boolean; data: IHistoryExam[] }> => {
  const res = await axios.get("/attempts/history/by-exam-info", {
    requireAuth: true,
    params: {
      exam_type_id,
      exam_level_id,
      exam_name,
    },
  });
  return res.data;
};
