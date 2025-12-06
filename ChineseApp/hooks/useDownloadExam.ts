import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { downloadExamForOffline } from "@/services/mockTest";
import { useOfflineExamStore } from "@/store/useOfflineExamStore";
import { IExam } from "@/types/mockTest.type";
import { useCallback, useState } from "react";

export const useDownloadExam = () => {
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();
  const { isExamDownloaded, isExamDownloading, removeOfflineExam } =
    useOfflineExamStore();

  const [downloadProgress, setDownloadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [downloadMessage, setDownloadMessage] = useState<{
    [key: string]: string;
  }>({});

  const downloadExam = useCallback(
    async (exam: IExam): Promise<boolean> => {
      try {
        if (isExamDownloading(exam.id)) {
          showSnackbar(t("examDownloading"), "info");
          return false;
        }

        if (isExamDownloaded(exam.id)) {
          showSnackbar(t("examAlreadyDownloaded"), "info");
          return false;
        }

        // Reset progress
        setDownloadProgress((prev) => ({ ...prev, [exam.id]: 0 }));
        setDownloadMessage((prev) => ({
          ...prev,
          [exam.id]: "Bắt đầu tải...",
        }));

        showSnackbar(t("downloadingExam"), "info");

        await downloadExamForOffline(exam.id, exam, (progress, message) => {
          setDownloadProgress((prev) => ({ ...prev, [exam.id]: progress }));
          if (message) {
            setDownloadMessage((prev) => ({ ...prev, [exam.id]: message }));
          }
        });

        // Clean up progress tracking
        setDownloadProgress((prev) => {
          const newState = { ...prev };
          delete newState[exam.id];
          return newState;
        });
        setDownloadMessage((prev) => {
          const newState = { ...prev };
          delete newState[exam.id];
          return newState;
        });

        showSnackbar(t("examDownloadSuccess"), "success");
        return true;
      } catch (error: any) {
        // Clean up progress tracking on error
        setDownloadProgress((prev) => {
          const newState = { ...prev };
          delete newState[exam.id];
          return newState;
        });
        setDownloadMessage((prev) => {
          const newState = { ...prev };
          delete newState[exam.id];
          return newState;
        });

        const errorMessage = error.message || "Lỗi khi tải bài thi";
        showSnackbar(errorMessage, "error");
        return false;
      }
    },
    [showSnackbar, isExamDownloading, isExamDownloaded]
  );

  const removeExam = useCallback(
    async (examId: string): Promise<boolean> => {
      try {
        await removeOfflineExam(examId);
        showSnackbar(t("examDeletedSuccess"), "success");
        return true;
      } catch (error: any) {
        const errorMessage = error.message || "Lỗi khi xóa bài thi";
        showSnackbar(errorMessage, "error");
        return false;
      }
    },
    [removeOfflineExam, showSnackbar]
  );

  const getDownloadStatus = useCallback(
    (examId: string) => {
      return {
        isDownloaded: isExamDownloaded(examId),
        isDownloading: isExamDownloading(examId),
        progress: downloadProgress[examId] || 0,
        message: downloadMessage[examId] || "",
      };
    },
    [isExamDownloaded, isExamDownloading, downloadProgress, downloadMessage]
  );

  return {
    downloadExam,
    removeExam,
    getDownloadStatus,
    isExamDownloaded,
    isExamDownloading,
  };
};
