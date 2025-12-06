import ConfirmModal from "@/components/shared/confirmModal";
import { useLanguageContext } from "@/contexts/languageContext";
import { useRemoveVocabFromNotebook } from "@/hooks/useNoteBook";
import { useNotebookStore } from "@/store/useNotebookStore";
import { router } from "expo-router";

const ModalDeleteVocab = ({
  vocabId,
  notebookId,
  startLoading,
  stopLoading,
  showSnackbar,
  visible,
  onDismiss,
}: {
  vocabId: string;
  notebookId: string;
  startLoading: (message: string) => void;
  stopLoading: () => void;
  showSnackbar: (message: string, type: "success" | "error" | "info") => void;
  visible: boolean;
  onDismiss: () => void;
}) => {
  const { t } = useLanguageContext();
  const { updateNotebookVocabCount } = useNotebookStore();
  const removeVocabMutation = useRemoveVocabFromNotebook();
  const handleDelete = () => {
    removeVocabMutation.mutate(
      { notebooksId: notebookId, vocabId },
      {
        onSuccess: (data) => {
          showSnackbar(data.message || t("deleteSuccess"), "success");
          updateNotebookVocabCount(notebookId, data.data.newTotalVocabCount);
          router.back();
          onDismiss();
        },
        onError: (error: any) => {
          showSnackbar(error.message || t("deleteError"), "error");
        },
      }
    );
  };
  return (
    <ConfirmModal
      title={t("confirmDelete")}
      message={t("deleteVocabMessage")}
      icon="delete"
      iconColor="#D32F2F"
      confirmText={t("delete")}
      cancelText={t("cancel")}
      visible={visible}
      onConfirm={handleDelete}
      onCancel={onDismiss}
      onRequestClose={onDismiss}
    />
  );
};

export default ModalDeleteVocab;
