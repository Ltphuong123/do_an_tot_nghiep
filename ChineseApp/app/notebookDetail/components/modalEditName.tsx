import ConfirmModal from "@/components/shared/confirmModal";
import { useLanguageContext } from "@/contexts/languageContext";
import { useRenameNotebook } from "@/hooks/useNoteBook";
import { useState } from "react";

const ModalEditName = ({
  visible,
  onDismiss,
  notebookId,
  startLoading,
  stopLoading,
  showSnackbar,
  onRenameSuccess,
}: {
  visible: boolean;
  onDismiss: () => void;
  notebookId: string;
  startLoading: (message: string) => void;
  stopLoading: () => void;
  showSnackbar: (message: string, type: "success" | "error" | "info") => void;
  onRenameSuccess?: (newName: string) => void;
}) => {
  const { t } = useLanguageContext();
  const [namne, setName] = useState<string>("");
  const renameNotebookMutation = useRenameNotebook();
  const handleEditName = () => {
    renameNotebookMutation.mutate(
      { notebookId, newName: namne },
      {
        onSuccess: (data) => {
          showSnackbar(data.message || t("renameSuccess"), "success");
          onRenameSuccess?.(namne);
          onDismiss();
          setName("");
        },
        onError: (error: any) => {
          showSnackbar(error.message || t("cannotRename"), "error");
        },
      }
    );
  };
  return (
    <ConfirmModal
      title={t("editNotebookName")}
      inputPlaceholder={t("editNotebookNamePlaceholder")}
      icon="pencil"
      iconColor="#1976D2"
      confirmText={t("saveButtonLabel")}
      cancelText={t("cancelButtonLabel")}
      visible={visible}
      onConfirm={handleEditName}
      onCancel={onDismiss}
      onRequestClose={onDismiss}
      variant="form"
      inputValue={namne}
      onInputChange={(value) => setName(value)}
      confirmDisabled={namne.trim().length === 0}
      isLoading={renameNotebookMutation.isPending}
    />
  );
};

export default ModalEditName;
