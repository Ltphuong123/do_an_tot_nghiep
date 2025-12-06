import { ContainerCustom } from "@/components/shared/containerCustom";
import { useNotificationList } from "@/hooks/useNotification";
import { useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import NotificationCard from "./components/notificationCard";
import NotificationHeader from "./components/notificationHeader";

export default function NotificationScreen() {
  const flatListRef = useRef<FlatList>(null);
  const LIMIT = 15;
  const [page, setPage] = useState<number>(1);
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const scrollPositionRef = useRef<number>(0);
  const isReturningRef = useRef<boolean>(false);

  const {
    data: notificationsData,
    isLoading,
    isRefetching,
    refetch,
  } = useNotificationList(page, LIMIT);

  useFocusEffect(
    useCallback(() => {
      isReturningRef.current = true;

      if (scrollPositionRef.current > 0 && allNotifications.length > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: scrollPositionRef.current,
            animated: false,
          });
        }, 50);
      }

      return () => {};
    }, [allNotifications.length])
  );

  useEffect(() => {
    if (notificationsData?.data) {
      setAllNotifications((prev) => {
        if (page === 1) {
          // Reset returning flag after handling
          if (isReturningRef.current) {
            isReturningRef.current = false;
          }

          return notificationsData.data;
        }
        // Prevent duplicates
        const existingIds = new Set(prev.map((n) => n.id));
        const newNotifications = notificationsData.data.filter(
          (n) => !existingIds.has(n.id)
        );
        return [...prev, ...newNotifications];
      });
    }
  }, [notificationsData, page]);

  // Memoize hasMore
  const hasMore = useMemo(() => {
    if (!notificationsData?.meta) return allNotifications.length === LIMIT;
    return page < notificationsData.meta.totalPages;
  }, [notificationsData?.meta, page, allNotifications.length]);

  const handleLoadMore = useCallback(() => {
    if (isRefetching || !hasMore || isLoading) return;
    setPage((prev) => prev + 1);
  }, [isRefetching, hasMore, isLoading]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  return (
    <ContainerCustom variant="background" scrollable={false}>
      <NotificationHeader title="Thông báo" />

      <FlatList
        ref={flatListRef}
        data={allNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard notification={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
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
    </ContainerCustom>
  );
}
