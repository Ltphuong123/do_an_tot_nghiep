import ConfirmModal from "@/components/shared/confirmModal";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useDeletePost } from "@/hooks/usePost";
import { DeviceEventEmitter } from "react-native";

const ModalDeletePost = ({
  visible,
  onClose,
  postId,
  onDeleteSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  postId: string;
  onDeleteSuccess?: () => void;
}) => {
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();
  const deletePostMutation = useDeletePost();

  const handleDelete = async () => {
    deletePostMutation.mutate(postId, {
      onSuccess: (data) => {
        if (data.success) {
          showSnackbar(data.message || t("deletePostSuccess"), "success");
          // Emit event for backward compatibility
          DeviceEventEmitter.emit("postDeleted", { postId });
          // Call callback if provided
          onDeleteSuccess?.();
          onClose();
        }
      },
      onError: (error: any) => {
        showSnackbar(error.message || t("deletePostFailed"), "error");
        onClose();
      },
    });
  };

  return (
    <ConfirmModal
      visible={visible}
      onRequestClose={onClose}
      title={t("deletePostTitle")}
      message={t("deletePostConfirmMessage")}
      onConfirm={handleDelete}
      isLoading={deletePostMutation.isPending}
      icon="delete"
      iconColor="red"
      confirmText={t("confirm")}
      cancelText={t("cancel")}
    />
  );
};

export default ModalDeletePost;
