import React from "react";
import ConfirmModal from "./confirmModal";

interface SubscriptionUpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const SubscriptionUpgradeModal: React.FC<SubscriptionUpgradeModalProps> = ({
  visible,
  onClose,
  onUpgrade,
}) => {
  return (
    <ConfirmModal
      visible={visible}
      onRequestClose={onClose}
      onConfirm={onUpgrade}
      onCancel={onClose}
      title="Hết lượt sử dụng"
      message="Bạn đã hết sử dụng tính năng này. Vui lòng nâng cấp gói để tiếp tục trải nghiệm."
      confirmText="Nâng cấp ngay"
      cancelText="Hủy"
      icon="crown"
      iconColor="#FFD700"
      variant="confirm"
    />
  );
};

export default SubscriptionUpgradeModal;
