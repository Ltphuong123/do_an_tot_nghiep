import AvatarCustom from "@/components/shared/avatarCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";

interface CreatePostBarProps {
  userAvatar: string | null;
  onAvatarPress: () => void;
  onCreatePostPress: () => void;
}

const CreatePostBar: React.FC<CreatePostBarProps> = ({
  userAvatar,
  onAvatarPress,
  onCreatePostPress,
}) => {
  const { theme } = useThemeContext();
  const subTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: DesignSystem.spacing.sm,
      }}
    >
      {/* User Avatar */}
      <Pressable onPress={onAvatarPress}>
        <AvatarCustom avatar={userAvatar} size={40} />
      </Pressable>

      {/* Create Post Input */}
      <Pressable
        style={{
          flex: 1,
          height: 36,
          borderRadius: 18,
          paddingHorizontal: DesignSystem.spacing.md,
          justifyContent: "center",
          backgroundColor:
            theme === "light"
              ? "rgba(0, 0, 0, 0.05)"
              : "rgba(255, 255, 255, 0.1)",
        }}
        onPress={onCreatePostPress}
      >
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            color: subTextColor,
          }}
        >
          {t("createPostPlaceholder")}
        </Text>
      </Pressable>
    </View>
  );
};

export default CreatePostBar;
