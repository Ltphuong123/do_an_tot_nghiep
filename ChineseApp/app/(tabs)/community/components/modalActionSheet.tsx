import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useUserStore } from "@/store/useUserStore";
import { IPost } from "@/types/post.type";
import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable } from "react-native";
import { Text } from "react-native-paper";
import ModalDeletePost from "./modalDelete";

interface ModalActionSheetProps {
  visible: boolean;
  onClose: () => void;
  post: IPost;
  onReportPress?: () => void;
}

const ModalActionSheet: React.FC<ModalActionSheetProps> = ({
  visible,
  onClose,
  post,
  onReportPress,
}) => {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useUserStore();
  const { t } = useLanguageContext();

  const handleEdit = async () => {
    onClose();
    router.push({
      pathname: "/community/createPost",
      params: {
        data: JSON.stringify(post),
      },
    });
  };

  const handleOpenReport = () => {
    // close this sheet and call the report callback
    onReportPress?.();
    onClose();
  };

  const handleOpenDeletePost = () => {
    setShowDeleteModal(true);
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
          onPress={onClose}
        >
          <Pressable
            style={{
              backgroundColor: theme === "light" ? "#fff" : "#111",
              padding: DesignSystem.spacing.md,
              borderTopLeftRadius: DesignSystem.borderRadius.lg,
              borderTopRightRadius: DesignSystem.borderRadius.lg,
            }}
          >
            {post.user.id === user.id ? (
              <>
                <Pressable
                  style={{ paddingVertical: DesignSystem.spacing.sm }}
                  onPress={handleEdit}
                >
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.md,
                      color: textColor,
                    }}
                  >
                    {t("editPost")}
                  </Text>
                </Pressable>

                <Pressable
                  style={{ paddingVertical: DesignSystem.spacing.sm }}
                  onPress={handleOpenDeletePost}
                >
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.md,
                      color: "#e53935",
                    }}
                  >
                    {t("deletePost")}
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  style={{ paddingVertical: DesignSystem.spacing.sm }}
                  onPress={handleOpenReport}
                >
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.md,
                      color: "#e53935",
                    }}
                  >
                    {t("report")}
                  </Text>
                </Pressable>
              </>
            )}

            <Pressable
              style={{ paddingVertical: DesignSystem.spacing.sm, marginTop: 6 }}
              onPress={onClose}
            >
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.md,
                  color: textColor,
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                }}
              >
                {t("cancel")}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Delete modal */}
      <ModalDeletePost
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        postId={post?.id}
      />
    </>
  );
};

export default ModalActionSheet;
