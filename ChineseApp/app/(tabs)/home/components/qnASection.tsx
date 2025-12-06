import { useScaleAnimation } from "@/components/aniamtion-scale";
import AvatarCustom from "@/components/shared/avatarCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import HtmlRenderer from "@/components/shared/htmlRenderer";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useTabRefreshContext } from "@/contexts/tabRefreshContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useLikePost, usePostList, useViewPost } from "@/hooks/usePost";
import { IPost } from "@/types/post.type";
import formatNumber from "@/utils/format_number";
import formatTimeAgo from "@/utils/format_time_ago";
import { router, useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

const QnASection = () => {
  const screenWidth = Dimensions.get("window").width;
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const { t, language } = useLanguageContext();

  const { data: postData } = usePostList(undefined, 1, 10);
  const likeMutation = useLikePost();
  const viewMutation = useViewPost();

  const posts = useMemo(() => postData?.data || [], [postData]);

  const { setScrollPosition, getScrollPosition } = useTabRefreshContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const [localViewsMap, setLocalViewsMap] = useState<Record<string, number>>(
    {}
  );
  const [localIsViewedMap, setLocalIsViewedMap] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const viewsMap: Record<string, number> = {};
    const isViewedMap: Record<string, boolean> = {};
    posts.forEach((post) => {
      viewsMap[post.id] = post.views ?? 0;
      isViewedMap[post.id] = Boolean(post.isViewed);
    });
    setLocalViewsMap(viewsMap);
    setLocalIsViewedMap(isViewedMap);
  }, [posts]);

  useFocusEffect(
    useCallback(() => {
      const savedPosition = getScrollPosition("home");
      if (savedPosition > 0) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: savedPosition,
            animated: false,
          });
        }, 100);
      }
    }, [getScrollPosition])
  );

  const handlePostPress = async (post: IPost) => {
    // Save current scroll position
    setScrollPosition("home", scrollOffset);

    router.push({
      pathname: "/(tabs)/community",
      params: { scrollToPost: post.id },
    });
  };

  const handleLikePress = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleToggleView = (postId: string) => {
    const currentViewed = localIsViewedMap[postId] ?? false;
    if (!currentViewed) {
      setLocalViewsMap((prev) => ({
        ...prev,
        [postId]: (prev[postId] ?? 0) + 1,
      }));
      setLocalIsViewedMap((prev) => ({ ...prev, [postId]: true }));
      viewMutation.mutate(postId);
    } else {
      setLocalViewsMap((prev) => ({
        ...prev,
        [postId]: (prev[postId] ?? 0) - 1,
      }));
      setLocalIsViewedMap((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const { scaleValues, handlePressIn, handlePressOut } = useScaleAnimation(
    posts.length || 0
  );

  return (
    <View style={{ width: "100%", gap: DesignSystem.spacing.md }}>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
        }}
      >
        {t("qna")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ width: "100%", paddingBottom: 5 }}
        decelerationRate="fast"
        ref={scrollViewRef}
        onScroll={(e) => setScrollOffset(e.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
      >
        <View style={{ flexDirection: "row", gap: DesignSystem.spacing.md }}>
          {posts.map((post, index) => (
            <Pressable
              key={post.id}
              onPress={() => handlePostPress(post)}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
              style={{
                width: screenWidth * 0.7,
                borderRadius: DesignSystem.borderRadius.xl,
                height: 240,
                position: "relative",
              }}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: scaleValues[index] || new Animated.Value(1),
                    },
                  ],
                }}
              >
                <CardCustom
                  variant="card"
                  padding="md"
                  style={{
                    borderRadius: DesignSystem.borderRadius.xl,
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  {/* Header với user info */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: DesignSystem.spacing.md,
                      marginBottom: DesignSystem.spacing.md,
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
                            color: textColor,
                            fontSize: DesignSystem.typography.fontSize.base,
                            fontWeight:
                              DesignSystem.typography.fontWeight.semibold,
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
                      <Text
                        style={{
                          color: secondaryTextColor,
                          fontSize: DesignSystem.typography.fontSize.sm,
                        }}
                      >
                        {formatTimeAgo(post.created_at, language)} •{" "}
                        {post.topic}
                      </Text>
                    </View>
                  </View>

                  {/* Nội dung bài viết - Flexible content area */}
                  <View
                    style={{ flex: 1, marginBottom: DesignSystem.spacing.sm }}
                  >
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.lg,
                        fontWeight: DesignSystem.typography.fontWeight.semibold,
                        color: textColor,
                        marginBottom: 6,
                      }}
                      numberOfLines={1}
                    >
                      {post.title}
                    </Text>
                    <View
                      style={{ flex: 1, overflow: "hidden", maxHeight: 120 }}
                    >
                      <HtmlRenderer
                        htmlContent={post.content?.html}
                        theme={theme}
                        fontSize={15}
                        textAlign="justify"
                      />
                    </View>
                  </View>

                  {/* Footer - Fixed position */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: DesignSystem.spacing.sm,
                      borderTopWidth: 1,
                      borderTopColor:
                        theme === "dark"
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.05)",
                    }}
                  >
                    <Pressable
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                      onPress={() => handleLikePress(post.id)}
                    >
                      <Icon
                        source={post.isLiked ? "heart" : "heart-outline"}
                        size={20}
                        color={post.isLiked ? "red" : secondaryTextColor}
                      />
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.sm,
                          color: secondaryTextColor,
                        }}
                      >
                        {formatNumber(post.likes)}
                      </Text>
                    </Pressable>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Icon
                        source={post.isCommented ? "chat" : "chat-outline"}
                        size={20}
                        color={getTextColor(theme, "primary")}
                      />
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.sm,
                          color: secondaryTextColor,
                        }}
                      >
                        {formatNumber(post.comment_count)}
                      </Text>
                    </View>
                    <Pressable
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                      onPress={() => handleToggleView(post.id)}
                    >
                      <Icon
                        source={
                          localIsViewedMap[post.id] ? "eye" : "eye-outline"
                        }
                        size={20}
                        color={getTextColor(theme, "primary")}
                      />
                      <Text
                        style={{
                          fontSize: DesignSystem.typography.fontSize.sm,
                          color: secondaryTextColor,
                        }}
                      >
                        {formatNumber(localViewsMap[post.id] ?? 0)}
                      </Text>
                    </Pressable>
                  </View>
                </CardCustom>
              </Animated.View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default QnASection;
