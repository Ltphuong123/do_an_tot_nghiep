import ConfirmModal from "@/components/shared/confirmModal";
import { useLanguageContext } from "@/contexts/languageContext";
import { useCreateNotebook } from "@/hooks/useNoteBook";
import React, { useState } from "react";
import { Icon } from "react-native-paper";

interface ModalCreateNotebookProps {
  visible: boolean;
  onDismiss: () => void;
  startLoading: (message: string) => void;
  stopLoading: () => void;
  showSnackbar: (message: string, type: "success" | "error" | "info") => void;
  refreshNotebooks: () => Promise<void>;
}

function ModalCreateNotebook({
  visible,
  onDismiss,
  startLoading,
  stopLoading,
  showSnackbar,
  refreshNotebooks,
}: ModalCreateNotebookProps) {
  const { t } = useLanguageContext();
  const [notebookName, setNotebookName] = useState("");
  const [error, setError] = useState("");

  const createNotebookMutation = useCreateNotebook();

  const validateForm = (): boolean => {
    if (!notebookName.trim()) {
      setError(t("enterNotebookName"));
      return false;
    }

    if (notebookName.trim().length < 2) {
      setError(t("notebookNameMinLength"));
      return false;
    }

    if (notebookName.trim().length > 50) {
      setError(t("notebookNameMaxLength"));
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    createNotebookMutation.mutate(notebookName.trim(), {
      onSuccess: (data) => {
        showSnackbar(data.message || t("notebookCreatedSuccess"), "success");
        refreshNotebooks();
        handleClose();
      },
      onError: (error: any) => {
        showSnackbar(error.message || t("errorCreatingNotebook"), "error");
      },
    });
  };

  const handleClose = () => {
    setNotebookName("");
    setError("");
    onDismiss();
  };

  const handleInputChange = (value: string) => {
    setNotebookName(value);
    if (error) {
      setError("");
    }
  };

  return (
    <ConfirmModal
      visible={visible}
      onRequestClose={handleClose}
      onConfirm={handleSubmit}
      title={t("createNewNotebook")}
      confirmText={
        createNotebookMutation.isPending ? t("creating") : t("create")
      }
      cancelText={t("cancel")}
      icon="notebook-plus"
      iconColor="#4A90E2"
      variant="form"
      inputValue={notebookName}
      onInputChange={handleInputChange}
      inputPlaceholder={t("notebookNamePlaceholder")}
      inputError={error}
      inputMaxLength={50}
      isLoading={createNotebookMutation.isPending}
      confirmDisabled={!notebookName.trim()}
      confirmIcon={<Icon source="plus" size={18} color="#FFFFFF" />}
    />
  );
}

export default ModalCreateNotebook;
