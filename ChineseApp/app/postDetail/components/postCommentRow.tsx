import AvatarCustom from "@/components/shared/avatarCustom";
import { InputCustom } from "@/components/shared/inputCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { editComment } from "@/services/post";
import { IComment } from "@/types/post.type";
import { IUser } from "@/types/user.type";
import formatTimeAgo from "@/utils/format_time_ago";
import React, { memo, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, View } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import ModalReason from "./modalReason";

type Props = {
  user: IUser;
  item: IComment;
  level?: number;
  theme: "light" | "dark";
  expandedMap: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  onReply: (commentId: string, name: string) => void;
};

const PostCommentRow: React.FC<Props> = ({
  user,
  item,
  level = 0,
  theme,
  expandedMap,
  onToggleExpand,
  onReply,
}) => {
  const children = item.replies || [];
  const isOpen = !!expandedMap[item.id];

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  const handleExpandToggle = useCallback(
    () => onToggleExpand(item.id),
    [item.id, onToggleExpand]
  );
  const handleReply = useCallback(
    () => onReply(item.id, item.user.name),
    [item.id, item.user.name, onReply]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState(item.content.text || "");
  const [saving, setSaving] = useState(false);
  const [localText, setLocalText] = useState(item.content?.text || "");
  const [showModalReason, setShowModalReason] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { language } = useLanguageContext();

  useEffect(() => {
    // Reset local states when comment changes
    setEditingContent(item.content.text || "");
    setLocalText(item.content?.text || "");
    setIsEditing(false);
    setSaving(false);
  }, [item.id, item.content, item.content?.text]);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingContent(item.content.text || "");
    setIsEditing(false);
  }, [item.content]);

  const handleSaveEdit = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await editComment(item.id, editingContent);
      setLocalText(editingContent);
      setIsEditing(false);
    } catch (error: any) {
      showSnackbar(
        error?.message ||
          "Đã có lỗi xảy ra khi lưu bình luận. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }, [editingContent, item.id, saving, showSnackbar]);

  return (
    <Pressable
      onLongPress={() => setShowActionModal(true)}
      style={{
        flexDirection: "row",
        gap: 8,
        paddingVertical: DesignSystem.spacing.sm,
      }}
    >
      <AvatarCustom avatar={item.user.avatar_url} size={30} />

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
              }}
            >
              {item.user.name}
            </Text>
            {/* Badge Icon */}
            {item.badge?.icon && (
              <Image
                source={{ uri: item.badge.icon }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                }}
                resizeMode="contain"
              />
            )}
          </View>
          <Text style={{ fontSize: 12, color: secondaryTextColor }}>
            {" • "}
            {formatTimeAgo(item.created_at, language)}
          </Text>

          {children.length > 0 && (
            <Pressable
              onPress={handleExpandToggle}
              style={{
                marginLeft: "auto",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: DesignSystem.spacing.xs,
              }}
            >
              <Icon
                source={isOpen ? "chevron-down" : "chevron-left"}
                size={18}
                color={secondaryTextColor}
              />
              <Text
                style={{
                  marginLeft: 4,
                  color: secondaryTextColor,
                  fontSize: 12,
                }}
              >
                {children.length}
              </Text>
            </Pressable>
          )}
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
        >
          <View style={{ flex: 1 }}>
            {isEditing ? (
              <InputCustom
                value={editingContent}
                onChangeText={setEditingContent}
              />
            ) : (
              <Text
                style={{
                  fontWeight: "400",
                  color: getTextColor(theme, "primary"),
                }}
              >
                {localText}
              </Text>
            )}
          </View>

          <View
            style={{
              marginRight: 8,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {item.user.id !== user?.id ? null : isEditing ? (
              saving ? (
                <ActivityIndicator size={20} color={secondaryTextColor} />
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Pressable onPress={handleSaveEdit} hitSlop={6}>
                    <Icon source="check" size={20} color={secondaryTextColor} />
                  </Pressable>
                  <Pressable
                    onPress={handleCancelEdit}
                    style={{ marginLeft: 8 }}
                    hitSlop={6}
                  >
                    <Icon source="close" size={20} color={secondaryTextColor} />
                  </Pressable>
                </View>
              )
            ) : null}
          </View>
        </View>

        <Pressable onPress={handleReply} style={{ marginTop: 4 }}>
          <Text style={{ color: secondaryTextColor, fontSize: 12 }}>
            Trả lời
          </Text>
        </Pressable>

        {isOpen &&
          children.map((child) => (
            <View key={child.id} style={{ marginLeft: level > 1 ? -35 : 0 }}>
              <PostCommentRow
                user={user}
                item={child}
                level={level + 1}
                theme={theme}
                expandedMap={expandedMap}
                onToggleExpand={onToggleExpand}
                onReply={onReply}
              />
            </View>
          ))}
      </View>
      <Modal
        visible={showActionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setShowActionModal(false)}
          />
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <Button
              onPress={() => {
                setShowActionModal(false);
                if (item.user.id === user?.id) {
                  handleStartEdit();
                } else {
                  setShowModalReason(true);
                }
              }}
            >
              <Text>
                {item.user.id === user?.id
                  ? language === "vi"
                    ? "Chỉnh sửa"
                    : "Edit"
                  : language === "vi"
                  ? "Báo cáo"
                  : "Report"}
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
      <ModalReason
        visible={showModalReason}
        onClose={() => setShowModalReason(false)}
        targetId={item.id}
        targetType="comment"
      />
    </Pressable>
  );
};

export default memo(PostCommentRow);
