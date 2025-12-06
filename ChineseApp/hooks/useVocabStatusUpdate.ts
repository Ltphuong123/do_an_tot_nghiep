import { useSnackbar } from "@/contexts/snackbarContext";
import { NotebookVocabItemStatus } from "@/types/common.type";
import { useCallback, useState } from "react";
import { useRefreshNotebookStatus, useUpdateVocabStatus } from "./useNoteBook";

interface UseVocabStatusUpdateProps {
  notebookId: string;
  isFromAdmin: boolean;
  originalNotebookId?: string;
  onSuccess?: () => void;
}

export const useVocabStatusUpdate = ({
  notebookId,
  isFromAdmin,
  originalNotebookId,
  onSuccess,
}: UseVocabStatusUpdateProps) => {
  const { showSnackbar } = useSnackbar();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<
    Record<string, NotebookVocabItemStatus>
  >({});

  const updateVocabStatusMutation = useUpdateVocabStatus();
  const refreshNotebookStatusMutation = useRefreshNotebookStatus();

  const updateVocabStatus = useCallback(
    async (
      vocabId: string,
      newStatus: NotebookVocabItemStatus,
      oldStatus: NotebookVocabItemStatus
    ) => {
      // Prevent multiple concurrent status updates for the same item
      if (updatingStatus === vocabId) {
        console.log("Already updating status for:", vocabId);
        return;
      }

      try {
        setUpdatingStatus(vocabId);

        // Step 1: Update local statuses immediately for better UX (optimistic update)
        setStatuses((prev) => ({ ...prev, [vocabId]: newStatus }));

        // Step 2: Update status in the backend
        await updateVocabStatusMutation.mutateAsync({
          vocabId: vocabId,
          notebookId: notebookId,
          status: newStatus,
          isFromAdminBool: isFromAdmin,
          originalNotebookId: originalNotebookId || notebookId,
        });

        console.log(
          `Status updated successfully for ${vocabId} to ${newStatus}`
        );

        // Step 3: Refresh notebook status counts
        refreshNotebookStatusMutation.mutateAsync(newStatus).catch((error) => {
          console.error(`Error refreshing ${newStatus} status:`, error);
        });

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        console.error("Error updating vocab status:", error);

        // Revert local statuses if there was an error
        setStatuses((prev) => ({ ...prev, [vocabId]: oldStatus }));

        showSnackbar(
          error?.message || "Đã xảy ra lỗi khi cập nhật trạng thái",
          "error"
        );
      } finally {
        setUpdatingStatus(null);
      }
    },
    [
      updatingStatus,
      updateVocabStatusMutation,
      refreshNotebookStatusMutation,
      notebookId,
      isFromAdmin,
      originalNotebookId,
      showSnackbar,
      onSuccess,
    ]
  );

  return {
    updateVocabStatus,
    updatingStatus,
    statuses,
    setStatuses,
  };
};
