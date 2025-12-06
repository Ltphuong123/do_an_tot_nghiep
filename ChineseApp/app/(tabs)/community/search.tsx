import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { usePostList } from "@/hooks/usePost";
import { EsearchNull } from "@/types/common.type";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import FilterTopicModal from "./components/filterTopicModal";
import PostCard from "./components/postCard";

export default function SearchScreen() {
  const router = useRouter();
  const { theme } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const LIMIT = 30;
  const [page, setPage] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const previousFilterRef = useRef<string>("");
  const shouldScrollToTopRef = useRef<boolean>(false);
  const textColor = getTextColor(theme, "primary");
  const bgColor = getBackgroundColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build query
  const query = useMemo(() => {
    let q = "";
    if (selectedTopics.length > 0) {
      q += `topic=${selectedTopics.join(",")}`;
    }
    return q || undefined;
  }, [selectedTopics]);

  // Build search param
  const searchParam = debouncedSearchQuery.trim()
    ? debouncedSearchQuery
    : EsearchNull.SEARCH_NULL;

  const {
    data: postsData,
    isLoading,
    isRefetching,
    refetch,
  } = usePostList(query, page, LIMIT, searchParam);

  useEffect(() => {
    refetch();
  }, [debouncedSearchQuery, refetch]);

  // Accumulate posts when page changes
  useEffect(() => {
    if (postsData?.data) {
      console.log(
        "Posts data received for page",
        page,
        "query:",
        query,
        "count:",
        postsData.data.length
      );
      setAllPosts((prev) => {
        if (page === 1) {
          // Only scroll to top if shouldScrollToTopRef is true (filter change)
          if (shouldScrollToTopRef.current) {
            setTimeout(() => {
              flatListRef.current?.scrollToOffset({
                offset: 0,
                animated: false,
              });
              shouldScrollToTopRef.current = false;
            }, 100);
          }
          return postsData.data;
        }
        // Prevent duplicates
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = postsData.data.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
    }
  }, [postsData, page, query]);

  // Memoize hasMore
  const hasMore = useMemo(() => {
    if (!postsData?.meta) return allPosts.length === LIMIT;
    return page < postsData.meta.totalPages;
  }, [postsData?.meta, page, allPosts.length]);

  useEffect(() => {
    const currentFilter = `${query || ""}|${debouncedSearchQuery}`;
    if (previousFilterRef.current !== currentFilter) {
      shouldScrollToTopRef.current = true;
      setPage(1);
      setAllPosts([]);
      previousFilterRef.current = currentFilter;
    }
  }, [query, debouncedSearchQuery]);

  const handleLoadMore = useCallback(() => {
    console.log("Handle load more triggered: ", isRefetching, hasMore);
    if (isRefetching || !hasMore || isLoading) return;
    console.log("Loading more posts...", page + 1);
    setPage((prev) => prev + 1);
  }, [isRefetching, hasMore, isLoading, page]);

  const handleRefresh = useCallback(() => {
    console.log("Refreshing posts...");
    setPage(1);
    // Keep allPosts to show old data while refreshing
    refetch();
  }, [refetch]);

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.md,
          paddingHorizontal: DesignSystem.spacing.md,
          paddingVertical: DesignSystem.spacing.md,
          backgroundColor: bgColor,
          ...DesignSystem.shadows[theme].md,
        }}
      >
        {/* Back Button */}
        <Pressable
          onPress={() => {
            setSearchQuery("");
            setSelectedTopics([]);
            setDebouncedSearchQuery("");
            router.back();
          }}
        >
          <Icon source="arrow-left" size={24} color={textColor} />
        </Pressable>

        {/* Search Input */}
        <TextInput
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            if (text.trim()) {
              setSelectedTopics([]);
            }
          }}
          placeholder="Tìm kiếm bài viết..."
          placeholderTextColor={secondaryTextColor}
          autoFocus
          style={{
            flex: 1,
            height: 40,
            backgroundColor:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            borderRadius: 20,
            paddingHorizontal: DesignSystem.spacing.md,
            fontSize: DesignSystem.typography.fontSize.base,
            color: textColor,
          }}
        />

        {/* Filter Button */}
        <Pressable onPress={() => setFilterModalVisible(true)}>
          <Icon source="filter-variant" size={24} color={textColor} />
        </Pressable>

        {/* Clear Button */}
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Icon source="close-circle" size={20} color={secondaryTextColor} />
          </Pressable>
        )}
      </View>

      {/* Results */}
      <FlatList
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        extraData={allPosts}
        key={allPosts.length}
        renderItem={({ item }) => {
          return <PostCard post={item} />;
        }}
        data={page === 1 ? (postsData as any)?.data || [] : allPosts}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: DesignSystem.spacing.xs,
          paddingHorizontal: DesignSystem.spacing.md,
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
          // Optional: track scroll position if needed
        }}
        scrollEventThrottle={16}
        ListFooterComponent={
          isLoading && page > 1 ? (
            <View style={{ padding: 12 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading &&
          allPosts.length === 0 &&
          searchQuery.trim() === "" &&
          selectedTopics.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 100,
              }}
            >
              <Icon source="magnify" size={64} color={secondaryTextColor} />
              <Text
                style={{
                  marginTop: DesignSystem.spacing.md,
                  color: secondaryTextColor,
                  fontSize: DesignSystem.typography.fontSize.base,
                }}
              >
                Nhập từ khóa để tìm kiếm
              </Text>
            </View>
          ) : !isLoading && allPosts.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 100,
              }}
            >
              <Icon
                source="file-document-outline"
                size={64}
                color={secondaryTextColor}
              />
              <Text
                style={{
                  marginTop: DesignSystem.spacing.md,
                  color: secondaryTextColor,
                  fontSize: DesignSystem.typography.fontSize.base,
                }}
              >
                Không tìm thấy kết quả
              </Text>
            </View>
          ) : null
        }
      />

      {/* Filter Topic Modal */}
      <FilterTopicModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedTopics={selectedTopics}
        onApply={(topics) => {
          setSelectedTopics(topics);
        }}
      />
    </ContainerCustom>
  );
}
