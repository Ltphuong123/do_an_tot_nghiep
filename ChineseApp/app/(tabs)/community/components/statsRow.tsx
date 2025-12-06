import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { IPost } from "@/types/post.type";
import formatNumber from "@/utils/format_number";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const StatsRow = ({
  post,
  onShowLikes,
  onShowViews,
}: {
  post: IPost;
  onShowLikes: () => void;
  onShowViews: () => void;
}) => {
  const { theme } = useThemeContext();
  const subTextColor = getTextColor(theme, "secondary");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.xs - 2,
        }}
        onPress={onShowLikes}
      >
        <Icon
          source={post.isLiked ? "heart" : "heart-outline"}
          size={20}
          color="red"
        />
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.medium,
            color: subTextColor,
          }}
        >
          {formatNumber(post.likes)}
        </Text>
      </Pressable>

      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.xs - 2,
        }}

        // onPress={onPressComment}
      >
        <Icon
          source={post.isCommented ? "chat" : "chat-outline"}
          size={20}
          color="#4caf50"
        />
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.medium,
            color: subTextColor,
          }}
        >
          {formatNumber(post.comments)}
        </Text>
      </Pressable>

      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.xs - 2,
        }}
        onPress={onShowViews}
      >
        <Icon source="eye-outline" size={20} color="#2196f3" />
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.medium,
            color: subTextColor,
          }}
        >
          {formatNumber(post.views)}
        </Text>
      </Pressable>
    </View>
  );
};

export default StatsRow;
