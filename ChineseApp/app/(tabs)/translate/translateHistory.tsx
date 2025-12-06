import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { getTranslateHistory } from "@/services/translate";
import { ITranslateHistory } from "@/types/translate.type";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";
import TranslateHistoryItem from "./components/TranslateHistoryItem";

function TranslateHistory() {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [history, setHistory] = useState<ITranslateHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const flatListRef = useRef<FlatList>(null);
  const LIMIT = 10;

  const handleDeleteItem = useCallback((itemId: string) => {
    // Remove item from history
    setHistory((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const loadHistory = useCallback(
    async (pageToFetch: number = 1, append: boolean = false) => {
      try {
        if (!append && pageToFetch === 1) {
          setLoading(true);
        }
        if (append) {
          setIsLoadingMore(true);
        }

        const response = await getTranslateHistory(pageToFetch, LIMIT);
        if (response.success) {
          const newData: ITranslateHistory[] = response.data || [];

          if (append) {
            // Remove duplicates when appending
            setHistory((prev) => {
              const existingIds = new Set(prev.map((item) => item.id));
              const uniqueNewData = newData.filter(
                (item) => !existingIds.has(item.id)
              );
              return [...prev, ...uniqueNewData];
            });
          } else {
            // Remove duplicates in initial data
            const uniqueData = newData.filter(
              (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            );
            setHistory(uniqueData);
          }

          // Determine hasMore based on meta or data length
          if (response.meta && typeof response.meta.totalPages === "number") {
            setHasMore(pageToFetch < response.meta.totalPages);
          } else {
            setHasMore(newData.length === LIMIT);
          }

          setPage(pageToFetch);
        }
      } catch (error) {
        console.error("Error loading translate history:", error);
      } finally {
        if (!append && pageToFetch === 1) {
          setLoading(false);
        }
        if (append) {
          setIsLoadingMore(false);
        }
        setRefreshing(false);
      }
    },
    [LIMIT]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await loadHistory(1, false);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore || refreshing) return;
    loadHistory(page + 1, true);
  };

  useEffect(() => {
    loadHistory(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderHistoryItem = useCallback(
    ({ item }: { item: ITranslateHistory }) => (
      <TranslateHistoryItem item={item} onDelete={handleDeleteItem} />
    ),
    [handleDeleteItem]
  );

  const keyExtractor = useCallback((item: ITranslateHistory, index: number) => {
    return `${item.id}-${index}`;
  }, []);

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: DesignSystem.spacing.xxl,
      }}
    >
      <Icon
        source="translate"
        size={64}
        color={getTextColor(theme, "secondary")}
      />
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          marginTop: DesignSystem.spacing.md,
          marginBottom: DesignSystem.spacing.sm,
          color: getTextColor(theme, "primary"),
        }}
      >
        {t("noTranslationHistory")}
      </Text>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.base,
          textAlign: "center",
          marginBottom: DesignSystem.spacing.xl,
          lineHeight: 24,
          color: getTextColor(theme, "secondary"),
        }}
      >
        {t("startTranslating")}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <ContainerCustom variant="background" scrollable={false}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            size="large"
            color={getTextColor(theme, "primary")}
          />
          <Text
            style={{
              marginTop: DesignSystem.spacing.md,
              fontSize: DesignSystem.typography.fontSize.base,
              color: getTextColor(theme, "primary"),
            }}
          >
            {t("loadingHistory")}
          </Text>
        </View>
      </ContainerCustom>
    );
  }

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: DesignSystem.spacing.md,
          gap: DesignSystem.spacing.md,
          ...DesignSystem.shadows[theme].md,
          backgroundColor: getBackgroundColor(theme, "primary"),
        }}
      >
        <Pressable
          onPress={() => router.replace("/translate")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              theme === "light"
                ? "rgba(0, 0, 0, 0.05)"
                : "rgba(255, 255, 255, 0.1)",
          }}
        >
          <Icon
            source="arrow-left"
            size={24}
            color={getTextColor(theme, "primary")}
          />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: getTextColor(theme, "primary"),
            }}
          >
            {t("translationHistory")}
          </Text>
        </View>
      </View>

      {/* Content */}
      {history.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          ref={flatListRef}
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            padding: DesignSystem.spacing.md,
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          windowSize={10}
          maxToRenderPerBatch={5}
          initialNumToRender={5}
          updateCellsBatchingPeriod={100}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[getTextColor(theme, "primary")]}
            />
          }
          ListFooterComponent={
            isLoadingMore ? (
              <View style={{ padding: 12 }}>
                <ActivityIndicator color={getTextColor(theme, "primary")} />
              </View>
            ) : null
          }
        />
      )}
    </ContainerCustom>
  );
}

export default TranslateHistory;
