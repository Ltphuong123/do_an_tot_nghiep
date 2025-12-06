import { DesignSystem } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { IPost } from "@/types/post.type";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon } from "react-native-paper";

const PostCardFooter = ({
  post,
  onCommentPress,
  isLiked,
  likeCount,
  onLikePress,
  isCommented,
}: {
  post: IPost;
  onCommentPress: () => void;
  isLiked: boolean;
  likeCount: number;
  onLikePress?: () => void;
  isCommented?: boolean;
}) => {
  const { theme } = useThemeContext();
  // const subTextColor = getTextColor(theme, "secondary");
  // const { t } = useLanguageContext();

  return (
    <View
      style={{
        marginTop: DesignSystem.spacing.md,
        borderTopWidth: 1,
        borderTopColor:
          theme === "light"
            ? "rgba(210, 218, 185, 0.99)"
            : "rgba(255, 255, 255, 0.1)",
        paddingBottom: DesignSystem.spacing.xs,
        paddingTop: DesignSystem.spacing.md,
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
          // source={isLiked ? "heart" : "heart-outline"}
          source="heart"
          size={20}
          color="red"
        />
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
          // source={isCommented ? "chat" : "chat-outline"}
          source="chat"
          size={20}
          color="#4caf50"
        />
      </Pressable>
    </View>
  );
};

export default PostCardFooter;
