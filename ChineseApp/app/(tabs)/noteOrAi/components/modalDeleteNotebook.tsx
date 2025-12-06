import ConfirmModal from "@/components/shared/confirmModal";
import { useLanguageContext } from "@/contexts/languageContext";
import { useDeleteNotebook } from "@/hooks/useNoteBook";

const ModalDeleteNotebook = ({
  visible,
  onDismiss,
  startLoading,
  stopLoading,
  isLoading,
  showSnackbar,
  refreshNotebooks,
  idNotebookDelete,
}: {
  visible: boolean;
  onDismiss: () => void;
  startLoading: (message: string) => void;
  stopLoading: () => void;
  isLoading: boolean;
  showSnackbar: (message: string, type: "success" | "error" | "info") => void;
  refreshNotebooks: () => Promise<void>;
  idNotebookDelete: string;
}) => {
  const { t } = useLanguageContext();
  const deleteNotebookMutation = useDeleteNotebook();
  const handleConfirmDelete = () => {
    deleteNotebookMutation.mutate(idNotebookDelete, {
      onSuccess: () => {
        showSnackbar(t("notebookDeletedSuccess"), "success");
        refreshNotebooks();
        onDismiss();
      },
      onError: (error: any) => {
        showSnackbar(error.message || t("genericError"), "error");
      },
    });
  };

  return (
    <ConfirmModal
      visible={visible}
      onRequestClose={onDismiss}
      onConfirm={handleConfirmDelete}
      title={t("deleteNotebookTitle")}
      confirmText={t("delete")}
      cancelText={t("cancel")}
      icon="delete"
      message={t("confirmDeleteNotebook")}
      isLoading={deleteNotebookMutation.isPending}
    />
  );
};

export default ModalDeleteNotebook;
