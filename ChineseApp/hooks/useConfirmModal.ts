import { useState } from "react";

interface ConfirmModalState {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  iconColor?: string;
}

const initialState: ConfirmModalState = {
  visible: false,
  title: "",
  message: "",
  onConfirm: () => {},
};

export const useConfirmModal = () => {
  const [modalState, setModalState] = useState<ConfirmModalState>(initialState);

  const showConfirm = ({
    title,
    message,
    onConfirm,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    icon = "help-circle",
    iconColor = "#4A90E2",
  }: Omit<ConfirmModalState, "visible">) => {
    setModalState({
      visible: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      icon,
      iconColor,
    });
  };

  const hideConfirm = () => {
    setModalState(initialState);
  };

  const handleConfirm = () => {
    modalState.onConfirm();
    hideConfirm();
  };

  return {
    modalState,
    showConfirm,
    hideConfirm,
    handleConfirm,
  };
};
