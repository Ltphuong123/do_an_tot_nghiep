import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { getNotebookStatus } from "@/services/notebook";
import { INoteBookVocabItem } from "@/types/notebook.type";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import EmptyState from "../components/emptyState";
import VocabCard from "../components/vocabCard";

function StatusNotebookDetail() {
  const { id } = useLocalSearchParams();
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");

  const status = id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["notebookStatus", status],
    queryFn: async () => {
      const response = await getNotebookStatus(status);
      return response.data;
    },
  });

  const vocabularies = data?.vocabularies || [];

  const handleVocabPress = (vocab: INoteBookVocabItem) => {
    const serialized = encodeURIComponent(JSON.stringify(vocab));
    router.push({
      pathname: "/notebookDetail/vocab",
      params: {
        item: serialized,
        notebookId: status, // or something
        returnTo: "/notebookDetail/status",
      },
    });
  };

  if (isLoading) {
    return (
      <ContainerCustom variant="background" scrollable={false}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={textColor} />
        </View>
      </ContainerCustom>
    );
  }

  if (error) {
    return (
      <ContainerCustom variant="background" scrollable={false}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: textColor }}>Lỗi khi tải dữ liệu</Text>
        </View>
      </ContainerCustom>
    );
  }

  return (
    <ContainerCustom variant="background" scrollable={false}>
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
          <Icon
            source="arrow-left"
            size={24}
            color={theme === "light" ? "#000" : "#FFF"}
          />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: "700",
              color: getTextColor(theme),
            }}
          >
            {status === "yêu thích"
              ? "Yêu thích"
              : status === "đã thuộc"
              ? "Đã thuộc"
              : status === "chưa thuộc"
              ? "Chưa thuộc"
              : "Không chắc"}
          </Text>
        </View>
      </View>

      {/* Vocab List */}
      {vocabularies.length > 0 ? (
        <FlatList
          data={vocabularies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <VocabCard item={item} onPress={() => handleVocabPress(item)} />
          )}
          contentContainerStyle={{
            padding: DesignSystem.spacing.md,
            gap: DesignSystem.spacing.md,
          }}
        />
      ) : (
        <EmptyState />
      )}
    </ContainerCustom>
  );
}

export default StatusNotebookDetail;
