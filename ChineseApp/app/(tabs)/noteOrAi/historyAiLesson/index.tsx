import { CardCustom } from "@/components/shared/cardCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { getHistoryLessonAi, getLessonAiById } from "@/services/createLessonAi";
import { HistoryLessonAi } from "@/types/createLessonAi.types";
import formatTimeAgo from "@/utils/format_time_ago";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const HistoryAiLessonScreen = () => {
  const { theme } = useThemeContext();
  const { language, t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const subTextColor = getTextColor(theme, "secondary");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["historyAiLesson"],
    queryFn: ({ pageParam = 1 }) => getHistoryLessonAi(pageParam, 20),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length === 20) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const lessons = data?.pages.flatMap((page) => page.data) || [];

  const lessonMutation = useMutation({
    mutationFn: getLessonAiById,
    onSuccess: (data) => {
      router.push({
        pathname: "/(tabs)/noteOrAi/aiLessonResult" as any,
        params: { data: JSON.stringify(data.data.content) },
      });
    },
  });

  const renderItem = ({ item }: { item: HistoryLessonAi }) => (
    <Pressable onPress={() => lessonMutation.mutate(item.id)}>
      <CardCustom
        variant="card"
        padding="md"
        style={{
          marginHorizontal: DesignSystem.spacing.md,
          marginVertical: DesignSystem.spacing.xs,
          borderRadius: DesignSystem.borderRadius.lg,
        }}
      >
        <View style={{ gap: DesignSystem.spacing.sm }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
              }}
            >
              {item.theme}
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: subTextColor,
              }}
            >
              {item.level}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: DesignSystem.spacing.sm,
            }}
          >
            <Icon source="clock-outline" size={16} color={subTextColor} />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: subTextColor,
              }}
            >
              {formatTimeAgo(item.created_at, language)}
            </Text>
          </View>
        </View>
      </CardCustom>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme === "dark" ? "#000" : "#fff",
        }}
      >
        <Text style={{ color: textColor }}>{t("loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme === "dark" ? "#000" : "#fff",
        }}
      >
        <Text style={{ color: textColor }}>{t("error")}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === "dark" ? "#000" : "#fff",
      }}
    >
      <View
        style={{
          padding: DesignSystem.spacing.md,
          paddingTop: 50,
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
            marginRight: 40,
          }}
        >
          {t("historyLessonAi")}
        </Text>
      </View>
      <FlatList
        data={lessons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ padding: 12 }}>
              <ActivityIndicator color={getTextColor(theme, "primary")} />
            </View>
          ) : null
        }
        contentContainerStyle={{
          paddingVertical: DesignSystem.spacing.md,
        }}
      />
      {lessonMutation.isPending && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color={textColor} />
        </View>
      )}
    </View>
  );
};

export default HistoryAiLessonScreen;
