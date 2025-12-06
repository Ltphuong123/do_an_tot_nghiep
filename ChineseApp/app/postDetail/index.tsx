import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import {
  useLikePost,
  usePostComments,
  usePostDetail,
  useUpdateCommentCount,
} from "@/hooks/usePost";
import { commentsPost } from "@/services/post";
import { IComment, IPost } from "@/types/post.type";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getGradient,
  getTextColor,
} from "@/constants/designSystem";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useUserStore } from "@/store/useUserStore";
import { Icon, Text } from "react-native-paper";
import ModalActionSheet from "../(tabs)/community/components/modalActionSheet";
import PostCommentInput from "./components/postCommentInput";
import PostCommentRow from "./components/postCommentRow";
import PostDetailCard from "./components/postDetailCard";

type ExpandedMap = Record<string, boolean>;

const PostDetailScreen = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const router = useRouter();
  const params = useLocalSearchParams();
  const postId = params.id as string;
  const commentId = params.commentId as string;
  const initialPost = useMemo(() => {
    if (typeof params.post === "string") {
      try {
        return JSON.parse(params.post as string) as IPost;
      } catch {}
    }
    return undefined;
  }, [params.post]);
  console.log("Initial Post from params:", initialPost);
  const [expandedMap, setExpandedMap] = useState<ExpandedMap>({});
  const [commentText, setCommentText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(
    null
  );
  const flatListRef = useRef<FlatList>(null);
  const subTextColor = getTextColor(theme, "secondary");
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useUserStore();

  const { showSnackbar } = useSnackbar();
  const { startLoading, stopLoading } = useLoadingContext();

  // React Query hooks
  const likeMutation = useLikePost();
  const { data: comments = [], refetch: refetchComments } =
    usePostComments(postId);
  const { data: postDetail, isLoading: isLoadingPost } = usePostDetail(
    postId,
    initialPost as any
  );
  const post = (postDetail ?? initialPost) as IPost;
  const updateCommentCount = useUpdateCommentCount();

  const isLiked = Boolean(post.isLiked);
  const likesCount = typeof post.likes === "number" ? post.likes : 0;
  const isCommented = Boolean(
    post.isCommented || (post as any).comments_count > 0
  );

  // ====== Handle keyboard height ======
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height + 10)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardHeight(0)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // we no longer manually set post from params; `usePostDetail` handles the fetched data

  // ====== Handle Like ======
  const handleLike = useCallback(() => {
    likeMutation.mutate(postId);
  }, [postId, likeMutation]);

  // Stop global loading when post data has loaded
  useEffect(() => {
    if (!isLoadingPost) {
      stopLoading();
    }
  }, [isLoadingPost, stopLoading]);

  // Comments are fetched automatically by usePostComments hook

  const toggleExpand = useCallback(
    (commentId: string) => {
      setExpandedMap((prev) => {
        const isOpen = !!prev[commentId];
        if (!isOpen) {
          return { ...prev, [commentId]: true };
        }

        // Thu thập tất cả descendants dựa trên cây replies (đệ quy)
        const toClose: string[] = [];

        const collectDescendants = (
          nodes: IComment[] | undefined,
          targetId: string
        ): boolean => {
          if (!nodes || nodes.length === 0) return false;
          for (const node of nodes) {
            if (node.id === targetId) {
              const dfs = (n: IComment) => {
                (n.replies || []).forEach((r) => {
                  toClose.push(r.id);
                  dfs(r);
                });
              };
              dfs(node);
              return true;
            }
            if (collectDescendants(node.replies, targetId)) return true;
          }
          return false;
        };

        // start from top-level comments array
        collectDescendants(comments, commentId);

        const newMap = { ...prev };
        // đóng chính nó
        newMap[commentId] = false;
        // đóng tất cả con
        toClose.forEach((id) => (newMap[id] = false));
        return newMap;
      });
    },
    [comments]
  );

  const handleSendComment = useCallback(async () => {
    if (!commentText.trim()) return;

    const text = commentText.trim();
    const parentId = replyTo ? replyTo.id : null;

    setCommentText("");
    setReplyTo(null);
    Keyboard.dismiss();

    startLoading();

    try {
      const res = await commentsPost(postId, text, parentId);

      if (res.success) {
        // Refetch comments to get updated list
        const updatedComments = await refetchComments();
        const newCount = updatedComments.data?.length || 0;

        // Update comment count in all caches
        updateCommentCount(postId, newCount);

        // If reply, expand parent tree
        if (parentId) {
          setExpandedMap((prev) => ({ ...prev, [parentId]: true }));
        }

        // Scroll to new comment
        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 400);
      } else {
        showSnackbar(t("sendCommentFailed"), "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar(t("cantSendComment"), "error");
    } finally {
      stopLoading();
    }
  }, [
    commentText,
    postId,
    replyTo,
    refetchComments,
    updateCommentCount,
    showSnackbar,
    t,
    startLoading,
    stopLoading,
  ]);

  const handleReply = useCallback((commentId: string, name: string) => {
    setReplyTo({ id: commentId, name });
  }, []);

  const handleCancelReply = useCallback(() => setReplyTo(null), []);

  const handleGoBack = useCallback(() => {
    setExpandedMap({});
    router.back();
  }, [router]);
  const gradientColors = useMemo(
    () => getGradient(theme, "background") as [string, string, ...string[]],
    [theme]
  );
  const textColor = useMemo(() => getTextColor(theme, "primary"), [theme]);

  // ====== Parent comments ======
  const parentComments = useMemo(
    () => comments.filter((c) => !c.parent_comment_id),
    [comments]
  );

  const listData = useMemo(() => {
    return [
      { type: "header" as const },
      { type: "divider" as const },
      ...parentComments.map((comment) => ({
        type: "comment" as const,
        data: comment,
      })),
    ];
  }, [parentComments]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof listData)[0] }) => {
      if (item.type === "header") {
        return (
          <View style={{ paddingHorizontal: DesignSystem.spacing.md }}>
            <PostDetailCard
              post={post}
              theme={theme}
              likesCount={likesCount}
              isLiked={isLiked}
              commentsCount={post.comment_count}
              isCommented={isCommented}
              onLikePress={handleLike}
              onCommentPress={() => {}}
            />
          </View>
        );
      }

      if (item.type === "divider") {
        return (
          <View
            style={{
              marginVertical: DesignSystem.spacing.md,
              paddingHorizontal: DesignSystem.spacing.md,
            }}
          >
            <View
              style={{
                height: 1,
                backgroundColor:
                  theme === "light"
                    ? "rgba(0, 0, 0, 0.1)"
                    : "rgba(255, 255, 255, 0.1)",
                marginHorizontal: DesignSystem.spacing.sm,
              }}
            />
          </View>
        );
      }

      return (
        <View
          style={{
            paddingHorizontal: DesignSystem.spacing.md,
          }}
        >
          <PostCommentRow
            user={user}
            item={item.data}
            theme={theme}
            expandedMap={expandedMap}
            onToggleExpand={toggleExpand}
            onReply={handleReply}
          />
        </View>
      );
    },
    [
      post,
      theme,
      likesCount,
      isLiked,
      isCommented,
      handleLike,
      user,
      expandedMap,
      toggleExpand,
      handleReply,
    ]
  );

  const keyExtractor = useCallback((item: (typeof listData)[0]) => {
    if (item.type === "header") return "header";
    if (item.type === "divider") return "divider";
    return `comment-${item.data.id}`;
  }, []);

  // Scroll to specific comment if commentId is provided
  useEffect(() => {
    if (commentId && comments.length > 0) {
      // Find comment in parentComments
      let targetIndex = parentComments.findIndex((c) => c.id === commentId);
      if (targetIndex !== -1) {
        // Top-level comment
        const listIndex = 2 + targetIndex;
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: listIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 500);
      } else {
        // Might be a reply, find parent
        for (let i = 0; i < parentComments.length; i++) {
          const parent = parentComments[i];
          if (parent.replies?.some((r) => r.id === commentId)) {
            // Expand parent
            setExpandedMap((prev) => ({ ...prev, [parent.id]: true }));
            // Scroll to parent
            const listIndex = 2 + i;
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: listIndex,
                animated: true,
                viewPosition: 0.5,
              });
            }, 500);
            break;
          }
        }
      }
    }
  }, [commentId, comments, parentComments]);

  if (!post || !post.id || isLoadingPost) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: getTextColor(theme, "primary") }}>
            {t("loadingPostContent")}
          </Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, marginBottom: keyboardHeight }}>
        <ContainerCustom variant="background" scrollable={false}>
          {/* ===== HEADER ===== */}
          <View
            style={{
              padding: DesignSystem.spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: getBackgroundColor(theme, "primary"),
              ...DesignSystem.shadows[theme].md,
              marginBottom: DesignSystem.spacing.md,
            }}
          >
            <Pressable onPress={handleGoBack}>
              <Icon
                source="arrow-left"
                size={24}
                color={theme === "light" ? "#000" : "#FFF"}
              />
            </Pressable>

            <Text
              style={{
                flex: 1,
                fontSize: DesignSystem.typography.fontSize.xl,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
                marginLeft: 20,
              }}
            >
              {t("postDetail")}
            </Text>

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
            />
          </View>

          {/* ===== COMMENT LIST ===== */}
          <FlatList
            ref={flatListRef}
            data={listData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: DesignSystem.spacing.sm,
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <View style={{ paddingHorizontal: DesignSystem.spacing.md }}>
                <Text style={{ color: textColor, textAlign: "center" }}>
                  {t("noComments")}
                </Text>
              </View>
            }
          />

          {/* ===== COMMENT INPUT ===== */}
          <PostCommentInput
            theme={theme}
            value={commentText}
            onChangeText={setCommentText}
            onSend={handleSendComment}
            replyTo={replyTo}
            onCancelReply={handleCancelReply}
          />
        </ContainerCustom>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetailScreen;
