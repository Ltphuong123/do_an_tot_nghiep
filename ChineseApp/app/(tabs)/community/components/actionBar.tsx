import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const ActionBar = ({
  isLiked,
  likeCount,
  viewCount,
  isCommented,
  isViewed,
  onCommentPress,
  onLikePress,
  onViewPress,
  commentCount,
}: {
  isLiked: boolean;
  likeCount: number;
  viewCount: number;
  isViewed: boolean;
  isCommented: boolean;
  onCommentPress: () => void;
  onLikePress?: () => void;
  onViewPress?: () => void;
  commentCount: number;
}) => {
  const { theme } = useThemeContext();
  const subTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  return (
    <View
      style={{
        marginTop: DesignSystem.spacing.md,
        paddingBottom: DesignSystem.spacing.xs,
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.xs - 2,
        }}
        onPress={onLikePress}
      >
        <Icon
          source={isLiked ? "heart" : "heart-outline"}
          size={20}
          color={isLiked ? "red" : getTextColor(theme, "secondary")}
        />
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.medium,
            color: subTextColor,
          }}
        >
          {likeCount}
        </Text>
      </Pressable>

      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.xs - 2,
        }}
        onPress={onCommentPress}
      >
        <Icon
          source={isCommented ? "chat" : "chat-outline"}
          size={20}
          color={isCommented ? "#4caf50" : getTextColor(theme, "secondary")}
        />
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.medium,
            color: subTextColor,
          }}
        >
          {commentCount}
        </Text>
      </Pressable>

      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.xs - 2,
        }}
        onPress={onViewPress}
      >
        <Icon
          source={isViewed ? "eye" : "eye-outline"}
          size={20}
          color={isViewed ? "#4caf50" : getTextColor(theme, "secondary")}
        />
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.medium,
            color: subTextColor,
          }}
        >
          {viewCount}
        </Text>
      </Pressable>
    </View>
  );
};

export default ActionBar;
