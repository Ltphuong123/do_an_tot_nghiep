import AvatarCustom from "@/components/shared/avatarCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import HtmlRenderer from "@/components/shared/htmlRenderer";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useThemeContext } from "@/contexts/themeContext";
import { postKeys, useLikePost, useViewPost } from "@/hooks/usePost";
import { IPost } from "@/types/post.type";
import formatTimeAgo from "@/utils/format_time_ago";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
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
import ModalActionSheet from "./modalActionSheet";
import ModalBadges from "./modalBadges";
import ModalReason from "./modalReason";

interface PostCardProps {
  post: IPost;
  returnTo?: string;
  activeTab?: "all" | "viewed" | "favorite";
}

const PostCard = ({ post, returnTo, activeTab }: PostCardProps) => {
  const { theme } = useThemeContext();
  const { language, t } = useLanguageContext();
  const { startLoading, stopLoading } = useLoadingContext();

  const textColor = getTextColor(theme, "primary");
  const subTextColor = getTextColor(theme, "secondary");

  const [menuVisible, setMenuVisible] = useState(false);
  const [badgesModalVisible, setBadgesModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportType, setReportType] = useState<"user" | "post">("post");
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [localViews, setLocalViews] = useState(post.views ?? 0);
  const [localIsViewed, setLocalIsViewed] = useState(Boolean(post.isViewed));

  // Use React Query mutations
  const likeMutation = useLikePost();
  const viewMutation = useViewPost();
  const queryClient = useQueryClient();

  // Get state from post prop (React Query keeps this synced)
  const isLiked = Boolean(post.isLiked);
  const likesCount = typeof post.likes === "number" ? post.likes : 0;
  const isCommented = Boolean(
    post.isCommented || (post as any).comments_count > 0
  );

  const navigateToPostDetail = (post: IPost) => {
    router.push({
      pathname: "/postDetail" as any,
      params: {
        id: post.id,
        post: JSON.stringify(post),
      },
    });
    // Removed viewMutation.mutate(post.id) - now handled by eye icon
  };

  const handleComment = () => {
    try {
      startLoading();
      const fallback = setTimeout(() => stopLoading(), 7000);
      router.push({
        pathname: "/postDetail" as any,
        params: {
          id: post.id,
          post: JSON.stringify(post),
          highlightComment: "true",
          returnTo: returnTo || "community",
        },
      });
      clearTimeout(fallback);
    } catch {
      stopLoading();
    }
  };

  const handleLike = async () => {
    // Call API for like/unlike in all cases
    likeMutation.mutate(post.id);
  };

  const handleToggleView = () => {
    if (activeTab === "viewed") {
      // For viewed tab, clicking should unview and remove from list
      // Update cache to remove this post from viewed posts list
      queryClient.setQueryData(
        postKeys.viewedPosts({ page: 1, limit: 30 }), // Assuming current page/limit
        (oldData: any) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((p: IPost) => p.id !== post.id),
            meta: {
              ...oldData.meta,
              totalItems: oldData.meta.totalItems - 1,
            },
          };
        }
      );
      // Update local state
      setLocalViews((prev) => prev - 1);
      setLocalIsViewed(false);
      // Note: Not calling API to avoid server sync issues
    } else {
      // Normal view behavior
      if (!localIsViewed) {
        setLocalViews((prev) => prev + 1);
        setLocalIsViewed(true);
        viewMutation.mutate(post.id);
      } else {
        setLocalViews((prev) => prev - 1);
        setLocalIsViewed(false);
        // Note: Server may not support decreasing views, this is local only
      }
    }
  };

  return (
    <>
      <CardCustom
        variant="card"
        padding="md"
        style={{
          marginHorizontal: DesignSystem.spacing.md,
          marginVertical: DesignSystem.spacing.xs,
          borderRadius: DesignSystem.borderRadius.lg,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: DesignSystem.spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: DesignSystem.spacing.sm,
            }}
          >
            <Pressable
              onLongPress={() => {
                setReportType("user");
                setReportModalVisible(true);
              }}
            >
              <AvatarCustom avatar={post.user.avatar_url} size={40} />
            </Pressable>
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
                    fontSize: DesignSystem.typography.fontSize.md,
                    fontWeight: DesignSystem.typography.fontWeight.semibold,
                    color: textColor,
                  }}
                >
                  {post.user.name}
                </Text>
                {/* Badge Icon */}
                {post.badge?.icon && (
                  <Pressable
                    onPress={() => {
                      setBadgesModalVisible(true);
                      console.log("Pressed badge icon");
                    }}
                  >
                    <Image
                      source={{ uri: post.badge.icon }}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                      }}
                      resizeMode="contain"
                    />
                  </Pressable>
                )}
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.xs,
                    color: subTextColor,
                  }}
                >
                  {formatTimeAgo(post.created_at, language)} • {post.topic}
                </Text>
              </View>
            </View>
          </View>

          {/* Menu Options */}
          <Pressable
            style={{ padding: DesignSystem.spacing.xs }}
            onPress={() => setMenuVisible(true)}
          >
            <Icon source="dots-vertical" size={20} color={subTextColor} />
          </Pressable>

          <ModalActionSheet
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            post={post}
            onReportPress={() => {
              setReportType("post");
              setReportModalVisible(true);
            }}
          />
        </View>

        {/* Content */}
        <View
          style={{
            marginBottom: DesignSystem.spacing.md,
            overflow: "hidden",
          }}
        >
          <Pressable
            style={{
              marginBottom: DesignSystem.spacing.sm,
              gap: DesignSystem.spacing.xs,
            }}
            onPress={() => navigateToPostDetail(post)}
          >
            {post.title && (
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.lg,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: textColor,
                  marginBottom: 6,
                }}
                numberOfLines={1}
              >
                {post.title}
              </Text>
            )}
            <View style={{ position: "relative" }}>
              <View
                style={
                  isExpanded
                    ? {}
                    : {
                        maxHeight: 120,
                        minHeight: 70,
                        overflow: "hidden",
                      }
                }
              >
                <HtmlRenderer
                  htmlContent={post.content.html}
                  theme={theme}
                  fontSize={15}
                  textAlign="justify"
                />
              </View>
              {!isExpanded && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: -DesignSystem.spacing.md,
                    right: -DesignSystem.spacing.md,
                    height: 64,
                  }}
                >
                  <LinearGradient
                    colors={
                      theme === "dark"
                        ? ["rgba(24, 24, 27, 0)", "rgba(24, 24, 27, 1)"]
                        : ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
                    }
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingBottom: 8,
                    }}
                  >
                    <Pressable
                      onPress={() => setIsExpanded(true)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 6,
                        borderRadius: 20,
                        backgroundColor: "#cce2fcff",
                      }}
                    >
                      <Text
                        style={{
                          color: "#4A90E2",
                          fontWeight: "bold",
                          fontSize: 13,
                        }}
                      >
                        {t("seeMore")}...
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          </Pressable>

          {/* Images - only show when expanded */}
          {isExpanded &&
            post.content.images &&
            post.content.images.length > 0 && (
              <View style={{ marginTop: DesignSystem.spacing.sm }}>
                {post.content.images.length === 1 ? (
                  <Pressable
                    onPress={() => {
                      setSelectedImageIndex(0);
                      setImageModalVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: post.content.images[0] }}
                      style={{ width: "100%", height: 200, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  </Pressable>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: "row", gap: 4 }}>
                      {post.content.images.map((imageUrl, index) => (
                        <Pressable
                          key={index}
                          onPress={() => {
                            setSelectedImageIndex(index);
                            setImageModalVisible(true);
                          }}
                        >
                          <Image
                            source={{ uri: imageUrl }}
                            style={{ width: 100, height: 100, borderRadius: 8 }}
                            resizeMode="cover"
                          />
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </View>
            )}

          {/* Thu gọn button - only show when expanded, at the bottom */}
          {isExpanded && (
            <Pressable
              onPress={() => setIsExpanded(false)}
              style={{
                marginTop: 14,
                alignSelf: "center",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 20,
                backgroundColor: "#cce2fcff",
              }}
            >
              <Text style={{ color: "#4A90E2", fontWeight: "bold" }}>
                {t("collapse")}
              </Text>
            </Pressable>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: DesignSystem.spacing.sm,
            borderTopWidth: 1,
            borderTopColor:
              theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
            onPress={() => handleLike()}
          >
            <Icon
              source={
                activeTab === "favorite"
                  ? "heart"
                  : isLiked
                  ? "heart"
                  : "heart-outline"
              }
              size={20}
              color={
                activeTab === "favorite"
                  ? "red"
                  : isLiked
                  ? "red"
                  : subTextColor
              }
            />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: subTextColor,
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
            }}
            onPress={() => handleComment()}
          >
            <Icon
              source={isCommented ? "chat" : "chat-outline"}
              size={20}
              color={textColor}
            />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: subTextColor,
              }}
            >
              {post.comment_count}
            </Text>
          </Pressable>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
            onPress={() => handleToggleView()}
          >
            <Icon
              source={
                activeTab === "viewed"
                  ? "eye"
                  : localIsViewed
                  ? "eye"
                  : "eye-outline"
              }
              size={20}
              color={textColor}
            />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: subTextColor,
              }}
            >
              {localViews}
            </Text>
          </Pressable>
        </View>

        <ModalBadges
          visible={badgesModalVisible}
          onClose={() => setBadgesModalVisible(false)}
        />

        <ModalReason
          visible={reportModalVisible}
          onClose={() => setReportModalVisible(false)}
          targetId={reportType === "user" ? post.user.id : post.id}
          targetType={reportType}
        />
      </CardCustom>

      {/* Image Viewer */}
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
    </>
  );
};

export default PostCard;
