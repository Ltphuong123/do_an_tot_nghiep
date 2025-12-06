import { ContainerCustom } from "@/components/shared/containerCustom";

import { DesignSystem } from "@/constants/designSystem";

import {
  postKeys,
  useLikedPosts,
  usePostList,
  useViewedPosts,
} from "@/hooks/usePost";
import { useUserStore } from "@/store/useUserStore";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import CommunityHeader from "./components/communityHeader";
import CreatePostBar from "./components/createPostBar";
import FeedTabs, { FeedTab } from "./components/feedTabs";
import FilterTopicModal from "./components/filterTopicModal";
import PostCard from "./components/postCard";

export default function CommunityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTopics, setActiveTopics] = useState<string[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const LIMIT = 30;
  const [page, setPage] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const previousFilterRef = useRef<string>("");
  const shouldScrollToTopRef = useRef<boolean>(false);
  const scrollPositionRef = useRef<number>(0);
  const isReturningRef = useRef<boolean>(false);
  const isFromSubPageRef = useRef<boolean>(false);
  const hasHandledScrollRef = useRef<boolean>(false);
  const [activeTab, setActiveTab] = useState<FeedTab>("all");
  const { user } = useUserStore();
  const queryClient = useQueryClient();

  // Use React Query for data fetching based on activeTab
  const topic = activeTopics.length > 0 ? activeTopics.join(",") : undefined;
  const allQuery = usePostList(topic, page, LIMIT, undefined, {
    enabled: activeTab === "all",
  });
  const viewedQuery = useViewedPosts(page, LIMIT, {
    enabled: activeTab === "viewed",
  });
  const likedQuery = useLikedPosts(page, LIMIT, {
    enabled: activeTab === "favorite",
  });

  const currentQuery =
    activeTab === "all"
      ? allQuery
      : activeTab === "viewed"
      ? viewedQuery
      : likedQuery;

  const {
    data: postsData,
    isLoading,
    isRefetching,
    refetch,
  } = currentQuery as typeof allQuery;

  console.log(postsData);

  useEffect(() => {
    refetch();
  }, [topic, refetch]);

  // Scroll to specific post if params.scrollToPost
  useEffect(() => {
    if (
      params.scrollToPost &&
      allPosts.length > 0 &&
      !hasHandledScrollRef.current
    ) {
      hasHandledScrollRef.current = true;
      const index = allPosts.findIndex((p) => p.id === params.scrollToPost);
      if (index >= 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: true });
          setTimeout(() => {
            router.replace("/(tabs)/community");
            hasHandledScrollRef.current = false;
          }, 1000);
        }, 500);
      }
    }
  }, [params.scrollToPost, allPosts, router]);

  // Track when returning from other screens and restore scroll position
  useFocusEffect(
    useCallback(() => {
      const fromSubPage = isFromSubPageRef.current;

      isFromSubPageRef.current = false;
      isReturningRef.current = true;

      // Restore scroll position when returning from sub-page
      if (fromSubPage && scrollPositionRef.current > 0 && allPosts.length > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: scrollPositionRef.current,
            animated: false,
          });
        }, 50);
      }

      return () => {
        // Position is already being tracked via onScroll
      };
    }, [allPosts.length])
  );

  // Accumulate posts when page changes
  useEffect(() => {
    if ((postsData as any)?.data) {
      console.log(
        "Posts data received for page",
        page,
        "topic:",
        topic,
        "count:",
        (postsData as any).data
      );
      setAllPosts((prev) => {
        if (page === 1) {
          // Only scroll to top if shouldScrollToTopRef is true (filter change)
          if (shouldScrollToTopRef.current && !isReturningRef.current) {
            setTimeout(() => {
              flatListRef.current?.scrollToOffset({
                offset: 0,
                animated: false,
              });
              shouldScrollToTopRef.current = false;
            }, 100);
          }

          // Reset returning flag after handling
          if (isReturningRef.current) {
            isReturningRef.current = false;
          }

          return (postsData as any).data;
        }
        // Prevent duplicates
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = (postsData as any).data.filter(
          (p: any) => !existingIds.has(p.id)
        );
        return [...prev, ...newPosts];
      });
    }
  }, [postsData, page, topic]);

  // Memoize hasMore
  const hasMore = useMemo(() => {
    const meta = (postsData as any)?.meta;
    if (!meta) return allPosts.length === LIMIT;
    return page < meta.totalPages;
  }, [postsData, page, allPosts.length]);

  useEffect(() => {
    const currentTopic = topic || "";
    if (previousFilterRef.current !== currentTopic) {
      shouldScrollToTopRef.current = true;
      setPage(1);
      setAllPosts([]);
      hasHandledScrollRef.current = false;
      previousFilterRef.current = currentTopic;
    }
  }, [topic]);

  const handleLoadMore = useCallback(() => {
    console.log("Handle load more triggered: ", isRefetching, hasMore);
    if (isRefetching || !hasMore || isLoading) return;
    console.log("Loading more posts...", page + 1);
    setPage((prev) => prev + 1);
  }, [isRefetching, hasMore, isLoading, page]);
  const handleRefresh = useCallback(() => {
    console.log("Refreshing posts...");
    setPage(1);
    refetch();
  }, [refetch]);

  const handleLeaderboard = () => {
    isFromSubPageRef.current = true;
    router.push("/community/leaderboard");
  };

  const handleAvatarPress = () => {
    isFromSubPageRef.current = true;
    router.push("/community/myProfileScreen");
  };

  const handleCreatePost = () => {
    isFromSubPageRef.current = true;
    router.push("/community/createPost");
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleSearchPress = () => {
    isFromSubPageRef.current = true;
    router.push("/community/search" as any);
  };

  const handleTabChange = (tab: FeedTab) => {
    setActiveTab(tab);
    setPage(1);
    setAllPosts([]);
    hasHandledScrollRef.current = false;
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

    // Invalidate queries for the new tab to refetch fresh data
    if (tab === "all") {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    } else if (tab === "viewed") {
      queryClient.invalidateQueries({ queryKey: postKeys.viewedPosts({}) });
    } else if (tab === "favorite") {
      queryClient.invalidateQueries({ queryKey: postKeys.likedPosts({}) });
    }
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      <CommunityHeader
        onLeaderboardPress={handleLeaderboard}
        onFilterPress={handleFilterPress}
        onSearchPress={handleSearchPress}
      />

      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <CreatePostBar
          userAvatar={user.avatar_url}
          onAvatarPress={handleAvatarPress}
          onCreatePostPress={handleCreatePost}
        />
        <FeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </View>

      {(isLoading || (isRefetching && page === 1)) && allPosts.length === 0 ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 40,
            paddingHorizontal: DesignSystem.spacing.md,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={page === 1 ? (postsData as any)?.data || [] : allPosts}
          keyExtractor={(item) => item.id}
          extraData={allPosts}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 40,
                paddingHorizontal: DesignSystem.spacing.md,
              }}
            >
              <Text>Không có bài viết nào </Text>
            </View>
          }
          renderItem={({ item }) => {
            return <PostCard post={item} activeTab={activeTab} />;
          }}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: DesignSystem.spacing.xs,
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          windowSize={10}
          maxToRenderPerBatch={5}
          initialNumToRender={5}
          updateCellsBatchingPeriod={100}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          onScroll={(e) => {
            scrollPositionRef.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          ListFooterComponent={
            isLoading && page > 1 ? (
              <View style={{ padding: 12 }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      )}

      {/* Filter Topic Modal */}
      <FilterTopicModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedTopics={selectedTopics}
        onApply={(topics) => {
          setSelectedTopics(topics);
          setActiveTopics(topics);
        }}
      />
    </ContainerCustom>
  );
}
