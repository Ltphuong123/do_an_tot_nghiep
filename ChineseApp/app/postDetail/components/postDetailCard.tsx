import AvatarCustom from "@/components/shared/avatarCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import HtmlRenderer from "@/components/shared/htmlRenderer";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useViewPost } from "@/hooks/usePost";
import { IPost } from "@/types/post.type";
import formatTimeAgo from "@/utils/format_time_ago";
import React, { memo, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import { Icon, Text } from "react-native-paper";

type Props = {
  post: IPost;
  theme: "light" | "dark";
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  isCommented: boolean;
  onLikePress: () => void;
  onCommentPress: () => void;
};

const PostDetailCard = ({
  post,
  theme,
  likesCount,
  isLiked,
  commentsCount,
  onLikePress,
  isCommented,
  onCommentPress,
}: Props) => {
  const textColor = useMemo(() => getTextColor(theme, "primary"), [theme]);
  const secondaryTextColor = useMemo(
    () => getTextColor(theme, "secondary"),
    [theme]
  );
  const { language } = useLanguageContext();

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [localViews, setLocalViews] = useState(post.views ?? 0);
  const [localIsViewed, setLocalIsViewed] = useState(Boolean(post.isViewed));

  const viewMutation = useViewPost();

  const handleToggleView = () => {
    if (!localIsViewed) {
      setLocalViews((prev) => prev + 1);
      setLocalIsViewed(true);
      viewMutation.mutate(post.id);
    } else {
      setLocalViews((prev) => prev - 1);
      setLocalIsViewed(false);
      // Note: Server may not support decreasing views, this is local only
    }
  };

  console.log("PostDetailCard render", isLiked);

  return (
    <CardCustom
      style={{
        paddingTop: 10,
        paddingBottom: 0,
        gap: DesignSystem.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.sm,
          marginBottom: DesignSystem.spacing.sm,
        }}
      >
        <AvatarCustom avatar={post.user.avatar_url} size={40} />

        <View style={{ gap: 2 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: textColor,
              }}
            >
              {post.user.name}
            </Text>
            {/* Badge Icon */}
            {post.badge?.icon && (
              <Image
                source={{ uri: post.badge.icon }}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                }}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              style={{
                fontSize: 13,
                color: secondaryTextColor,
              }}
            >
              {formatTimeAgo(post.created_at, language)}.
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
              }}
            >
              {post.topic}
            </Text>
          </View>
        </View>
      </View>

      {!!post.title && (
        <Text
          style={{
            fontSize: 18,
            fontWeight: DesignSystem.typography.fontWeight.bold,
            lineHeight: 24,
            color: textColor,
          }}
          numberOfLines={3}
        >
          {post.title}
        </Text>
      )}

      <HtmlRenderer
        htmlContent={post.content.html}
        theme={theme}
        fontSize={15}
        textAlign="justify"
      />
      {/* Hiển thị ảnh nếu có */}
      {post.content.images && post.content.images.length > 0 && (
        <View style={{ gap: DesignSystem.spacing.sm }}>
          {post.content.images.length === 1 && (
            <Pressable
              onPress={() => {
                setSelectedImageIndex(0);
                setImageModalVisible(true);
              }}
            >
              <Image
                source={{ uri: post.content.images[0] }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
            </Pressable>
          )}
          {post.content.images.length === 2 && (
            <View style={{ flexDirection: "row", gap: 4 }}>
              {post.content.images.map((imageUrl, index) => (
                <Pressable
                  key={index}
                  style={{ flex: 1 }}
                  onPress={() => {
                    setSelectedImageIndex(index);
                    setImageModalVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </View>
          )}
          {post.content.images.length === 3 && (
            <View style={{ gap: 4 }}>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {post.content.images.slice(0, 2).map((imageUrl, index) => (
                  <Pressable
                    key={index}
                    style={{ flex: 1 }}
                    onPress={() => {
                      setSelectedImageIndex(index);
                      setImageModalVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={() => {
                  setSelectedImageIndex(2);
                  setImageModalVisible(true);
                }}
              >
                <Image
                  source={{ uri: post.content.images[2] }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
              </Pressable>
            </View>
          )}
          {post.content.images.length === 4 && (
            <View style={{ gap: 4 }}>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {post.content.images.slice(0, 2).map((imageUrl, index) => (
                  <Pressable
                    key={index}
                    style={{ flex: 1 }}
                    onPress={() => {
                      setSelectedImageIndex(index);
                      setImageModalVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}
              </View>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {post.content.images.slice(2, 4).map((imageUrl, index) => (
                  <Pressable
                    key={index + 2}
                    style={{ flex: 1 }}
                    onPress={() => {
                      setSelectedImageIndex(index + 2);
                      setImageModalVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
          onPress={onLikePress}
        >
          <Icon
            source={isLiked ? "heart" : "heart-outline"}
            size={16}
            color="#F44336"
          />
          <Text
            style={{
              fontSize: 14,
              color: secondaryTextColor,
            }}
          >
            {likesCount}
          </Text>
        </Pressable>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
          onPress={onCommentPress}
        >
          <Icon
            source={isCommented ? "chat" : "chat-outline"}
            size={16}
            color={textColor}
          />
          <Text
            style={{
              fontSize: 14,
              color: secondaryTextColor,
            }}
          >
            {commentsCount}
          </Text>
        </Pressable>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
          onPress={handleToggleView}
        >
          <Icon
            source={localIsViewed ? "eye" : "eye-outline"}
            size={16}
            color={textColor}
          />
          <Text
            style={{
              fontSize: 14,
              color: secondaryTextColor,
            }}
          >
            {localViews}
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor:
            theme === "light"
              ? "rgba(0, 0, 0, 0.08)"
              : "rgba(255, 255, 255, 0.12)",
          marginVertical: 4,
        }}
      />

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)" }}>
          <Pressable
            style={{ position: "absolute", top: 40, right: 20, zIndex: 10 }}
            onPress={() => setImageModalVisible(false)}
          >
            <Icon source="close" size={30} color="#fff" />
          </Pressable>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{
              x: selectedImageIndex * Dimensions.get("window").width,
              y: 0,
            }}
          >
            {post.content.images?.map((imageUrl, index) => (
              <View
                key={index}
                style={{
                  width: Dimensions.get("window").width,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* @ts-ignore */}
                <ImageZoom
                  cropWidth={Dimensions.get("window").width}
                  cropHeight={Dimensions.get("window").height}
                  imageWidth={Dimensions.get("window").width}
                  imageHeight={Dimensions.get("window").height * 0.8}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={{
                      width: Dimensions.get("window").width,
                      height: Dimensions.get("window").height * 0.8,
                    }}
                    resizeMode="contain"
                  />
                </ImageZoom>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </CardCustom>
  );
};

export default memo(PostDetailCard);
