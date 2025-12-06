import { CardCustom } from "@/components/shared/cardCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useInteractedPosts, useMyPosts } from "@/hooks/usePost";
import { IPost } from "@/types/post.type";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import PostCard from "./components/postCard";

type ProfileTab = "posted" | "interacted";

const MyProfileScreen = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posted");
  const [allMyPosts, setAllMyPosts] = useState<IPost[]>([]);
  const [allInteractedPosts, setAllInteractedPosts] = useState<IPost[]>([]);
  const [tabWidth, setTabWidth] = useState(0);
  const LIMIT = 10;

  // Pagination states for my posts
  const [myPostsPage, setMyPostsPage] = useState<number>(1);
  const [myPostsHasMore, setMyPostsHasMore] = useState<boolean>(true);

  // Pagination states for interacted posts
  const [interactedPostsPage, setInteractedPostsPage] = useState<number>(1);
  const [interactedPostsHasMore, setInteractedPostsHasMore] =
    useState<boolean>(true);

  // Animated indicator X position
  const indicatorX = useRef(new Animated.Value(0)).current;

  const textColor = getTextColor(theme, "primary");
  const subTextColor = getTextColor(theme, "secondary");

  // Use React Query hooks
  const {
    data: myPostsData,
    isLoading: isLoadingMyPosts,
    refetch: refetchMyPosts,
  } = useMyPosts(myPostsPage, LIMIT);

  const {
    data: interactedPostsData,
    isLoading: isLoadingInteractedPosts,
    refetch: refetchInteractedPosts,
  } = useInteractedPosts(interactedPostsPage, LIMIT);

  // Animate tab change: slide the indicator and set active tab
  const animateTabChange = (index: number) => {
    setActiveTab(index === 0 ? "posted" : "interacted");
    if (tabWidth > 0) {
      Animated.spring(indicatorX, {
        toValue: index * tabWidth,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }).start();
    }
  };

  // Accumulate my posts when page changes
  useEffect(() => {
    if (myPostsData?.data) {
      setAllMyPosts((prev) => {
        if (myPostsPage === 1) {
          return myPostsData.data;
        }
        // Prevent duplicates
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = myPostsData.data.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });

      // Update hasMore
      if (myPostsData.meta && typeof myPostsData.meta.totalPages === "number") {
        setMyPostsHasMore(myPostsPage < myPostsData.meta.totalPages);
      } else {
        setMyPostsHasMore(myPostsData.data.length === LIMIT);
      }
    }
  }, [myPostsData, myPostsPage, LIMIT]);

  // Accumulate interacted posts when page changes
  useEffect(() => {
    if (interactedPostsData?.data) {
      setAllInteractedPosts((prev) => {
        if (interactedPostsPage === 1) {
          return interactedPostsData.data;
        }
        // Prevent duplicates
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = interactedPostsData.data.filter(
          (p) => !existingIds.has(p.id)
        );
        return [...prev, ...newPosts];
      });

      // Update hasMore
      if (
        interactedPostsData.meta &&
        typeof interactedPostsData.meta.totalPages === "number"
      ) {
        setInteractedPostsHasMore(
          interactedPostsPage < interactedPostsData.meta.totalPages
        );
      } else {
        setInteractedPostsHasMore(interactedPostsData.data.length === LIMIT);
      }
    }
  }, [interactedPostsData, interactedPostsPage, LIMIT]);

  // Load more and refresh handlers
  const handleLoadMoreMyPosts = useCallback(() => {
    if (!myPostsHasMore || isLoadingMyPosts) return;
    setMyPostsPage((prev) => prev + 1);
  }, [myPostsHasMore, isLoadingMyPosts]);

  const handleRefreshMyPosts = useCallback(() => {
    setMyPostsPage(1);
    setAllMyPosts([]);
    refetchMyPosts();
  }, [refetchMyPosts]);

  const handleLoadMoreInteractedPosts = useCallback(() => {
    if (!interactedPostsHasMore || isLoadingInteractedPosts) return;
    setInteractedPostsPage((prev) => prev + 1);
  }, [interactedPostsHasMore, isLoadingInteractedPosts]);

  const handleRefreshInteractedPosts = useCallback(() => {
    setInteractedPostsPage(1);
    setAllInteractedPosts([]);
    refetchInteractedPosts();
  }, [refetchInteractedPosts]);

  const handleTabPress = (tab: ProfileTab, index: number) => {
    setActiveTab(tab);
    animateTabChange(index);
  };

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: "posted", label: t("myPosts") },
    { key: "interacted", label: t("interactedPosts") },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "posted":
        return (
          <FlatList
            data={allMyPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PostCard post={item} returnTo="/community/myProfileScreen" />
            )}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 60,
                }}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.md,
                    color: subTextColor,
                  }}
                >
                  {t("youHaventPostedAnyArticlesYet")}
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            windowSize={10}
            maxToRenderPerBatch={5}
            initialNumToRender={5}
            updateCellsBatchingPeriod={100}
            onEndReached={handleLoadMoreMyPosts}
            onEndReachedThreshold={0.5}
            refreshing={false}
            onRefresh={handleRefreshMyPosts}
            ListFooterComponent={
              isLoadingMyPosts && myPostsPage > 1 ? (
                <View style={{ padding: 12 }}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
          />
        );
      case "interacted":
        return (
          <FlatList
            data={allInteractedPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PostCard post={item} returnTo="/community/myProfileScreen" />
            )}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 60,
                }}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.md,
                    color: subTextColor,
                  }}
                >
                  {t("youHaventInteractedWithAnyPostsYet")}
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            windowSize={10}
            maxToRenderPerBatch={5}
            initialNumToRender={5}
            updateCellsBatchingPeriod={100}
            onEndReached={handleLoadMoreInteractedPosts}
            onEndReachedThreshold={0.5}
            refreshing={false}
            onRefresh={handleRefreshInteractedPosts}
            ListFooterComponent={
              isLoadingInteractedPosts && interactedPostsPage > 1 ? (
                <View style={{ padding: 12 }}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
          />
        );
    }
  };

  return (
    <ContainerCustom>
      {/* Header */}
      <View
        style={{
          padding: DesignSystem.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.md,
          backgroundColor: getBackgroundColor(theme, "primary"),
          ...DesignSystem.shadows[theme].md,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Icon source="arrow-left" size={24} color={textColor} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: DesignSystem.typography.fontSize.xl,
            fontWeight: DesignSystem.typography.fontWeight.bold,
            color: textColor,
          }}
        >
          {t("personalProfile")}
        </Text>
      </View>

      {/* Tabs */}
      <CardCustom
        variant="card"
        padding="xs"
        style={{
          flexDirection: "row",
          margin: DesignSystem.spacing.md,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            position: "relative",
          }}
          onLayout={(e) => {
            const { width } = e.nativeEvent.layout;
            setTabWidth(width / tabs.length);
          }}
        >
          {tabs.map((tab, index) => {
            const active = tab.key === activeTab;
            return (
              <Pressable
                key={tab.key}
                style={{
                  flex: 1,
                  paddingVertical: DesignSystem.spacing.sm,
                  alignItems: "center",
                }}
                onPress={() => handleTabPress(tab.key, index)}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    fontWeight: DesignSystem.typography.fontWeight.semibold,
                    color: active ? "#4A90E2" : subTextColor,
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}

          {/* Animated sliding indicator */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: tabWidth,
              height: 3,
              transform: [{ translateX: indicatorX }],
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#4A90E2",
                borderRadius: 2,
              }}
            />
          </Animated.View>
        </View>
      </CardCustom>

      {/* Content */}
      {renderTabContent()}
    </ContainerCustom>
  );
};

export default MyProfileScreen;
