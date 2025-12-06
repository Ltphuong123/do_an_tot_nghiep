import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import {
  DesignSystem,
  getColorAtived,
  getTextColor,
  getVocabStatusColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { getNotebookStatus } from "@/services/notebook";
import { INoteBook } from "@/types/notebook.type";
import { useQueries } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface NotebookCardProps {
  notebook: INoteBook;
  index: number;
  onPress: () => void;
}

const NotebookNotes = ({
  startLoading,
  stopLoading,
  showSnackbar,
}: {
  startLoading: () => void;
  stopLoading: () => void;
  showSnackbar: (message: string, type: "success" | "error") => void;
}) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const statuses = useMemo(
    () => ["yêu thích", "đã thuộc", "chưa thuộc", "không chắc"],
    []
  );

  const memoizedQueries = useMemo(
    () =>
      statuses.map((status) => ({
        queryKey: ["notebooks", "status", status],
        queryFn: async () => {
          const response = await getNotebookStatus(status);
          return response.data;
        },
      })),
    [statuses]
  );

  const queries = useQueries({
    queries: memoizedQueries,
  });

  const learningNotebooks = useMemo(() => {
    return queries.map((query, index) => {
      const status = statuses[index];
      const name =
        status === "yêu thích"
          ? "Yêu thích"
          : status === "đã thuộc"
          ? "Đã thuộc"
          : status === "chưa thuộc"
          ? "Chưa thuộc"
          : "Không chắc";
      return {
        id: status,
        name,
        vocab_count: query.data?.total || 0,
        // Add other default fields if needed
      } as INoteBook;
    });
  }, [queries, statuses]);

  // Handle errors
  useEffect(() => {
    const hasError = queries.some((query) => query.error);
    if (hasError) {
      const errorMessage =
        queries.find((query) => query.error)?.error?.message ||
        "Lỗi khi tải sổ tay";
      showSnackbar(errorMessage, "error");
    }
  }, [queries, showSnackbar]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const getNotebookIcon = (name: string): string => {
    switch (name) {
      case "Yêu thích":
        return "heart";
      case "Đã thuộc":
        return "check-decagram";
      case "Chưa thuộc":
        return "book-open-variant";
      case "Không chắc":
        return "progress-question";
      default:
        return "notebook";
    }
  };

  const getNotebookColor = (name: string): string => {
    switch (name) {
      case "Yêu thích":
        return getVocabStatusColor("yêu thích");
      case "Đã thuộc":
        return getVocabStatusColor("đã thuộc");
      case "Chưa thuộc":
        return getVocabStatusColor("chưa thuộc");
      case "Không chắc":
        return getVocabStatusColor("không chắc");
      default:
        return "#2196F3";
    }
  };

  const handleNotebookPress = (notebook: INoteBook, status: string) => {
    if (notebook.vocab_count === 0) {
      console.log("Empty notebook:", notebook.name);
    }
    router.push({
      pathname: "/notebookDetail/status" as any,
      params: {
        id: status,
        returnTo: "/home/profile",
        key: Date.now().toString(),
      },
    });
  };

  const NotebookCard = ({ notebook, index, onPress }: NotebookCardProps) => {
    const [scaleAnim] = useState(new Animated.Value(1));
    const color = getNotebookColor(notebook.name);
    const icon = getNotebookIcon(notebook.name);
    const isEmpty = notebook.vocab_count === 0;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <CardCustom variant="card">
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: DesignSystem.spacing.md,
                gap: DesignSystem.spacing.md,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: DesignSystem.borderRadius.md,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  backgroundColor:
                    theme === "light" ? `${color}15` : `${color}25`,
                }}
              >
                <Icon source={icon as any} size={32} color={color} />
                {isEmpty && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      backgroundColor: "#FFF",
                      borderRadius: 10,
                      padding: 2,
                      ...DesignSystem.shadows[theme].sm,
                    }}
                  >
                    <Icon source="alert-circle" size={16} color="#FF9800" />
                  </View>
                )}
              </View>

              <View style={{ flex: 1, gap: DesignSystem.spacing.xs }}>
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.md,
                    fontWeight: DesignSystem.typography.fontWeight.semibold,
                    color: textColor,
                  }}
                  numberOfLines={1}
                >
                  {notebook.name}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: DesignSystem.spacing.sm,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Icon
                      source="book-alphabet"
                      size={14}
                      color={secondaryTextColor}
                    />
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.xs,
                        color: secondaryTextColor,
                      }}
                    >
                      {notebook.vocab_count} từ
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ justifyContent: "center" }}>
                <Icon
                  source="chevron-right"
                  size={24}
                  color={secondaryTextColor}
                />
              </View>
            </View>
          </CardCustom>
        </Pressable>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View
      style={{
        alignItems: "center",
        paddingVertical: DesignSystem.spacing.xxxl,
        paddingHorizontal: DesignSystem.spacing.lg,
      }}
    >
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: DesignSystem.spacing.lg,
          backgroundColor:
            theme === "light"
              ? "rgba(74, 144, 226, 0.1)"
              : "rgba(74, 144, 226, 0.2)",
        }}
      >
        <Icon source="notebook-outline" size={64} color="#4A90E2" />
      </View>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
          marginBottom: DesignSystem.spacing.sm,
        }}
      >
        {t("vocabularyStatistics")}
      </Text>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.md,
          color: secondaryTextColor,
          textAlign: "center",
          marginBottom: DesignSystem.spacing.xl,
          lineHeight:
            DesignSystem.typography.lineHeight.relaxed *
            DesignSystem.typography.fontSize.md,
        }}
      >
        {t("notebooksEmptyDesc")}
      </Text>
      <ButtonCustom
        size="md"
        title={t("createNotebook")}
        onPress={() =>
          router.push({
            pathname: "/noteOrAi" as any,
            params: { activeView: "notebook", timestamp: new Date().getTime() },
          })
        }
        startColors={getColorAtived(theme)}
        endColors={getColorAtived(theme)}
        textStyle={{ color: "#fff" }}
      />
    </View>
  );

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        marginTop: DesignSystem.spacing.lg,
      }}
    >
      <CardCustom variant="card">
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: DesignSystem.spacing.lg,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: DesignSystem.spacing.md,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: DesignSystem.borderRadius.md,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  theme === "light"
                    ? "rgba(74, 144, 226, 0.15)"
                    : "rgba(74, 144, 226, 0.25)",
              }}
            >
              <Icon source="notebook-multiple" size={24} color="#4A90E2" />
            </View>
            <View>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.lg,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: textColor,
                }}
              >
                {t("vocabularyStatistics")}
              </Text>
            </View>
          </View>
        </View>

        {/* Notebooks Grid */}
        {learningNotebooks.length > 0 ? (
          <View style={{ gap: DesignSystem.spacing.md }}>
            {learningNotebooks.map((notebook, index) => (
              <NotebookCard
                key={notebook.id}
                notebook={notebook}
                index={index}
                onPress={() => handleNotebookPress(notebook, statuses[index])}
              />
            ))}
          </View>
        ) : (
          <EmptyState />
        )}
      </CardCustom>
    </Animated.View>
  );
};

export default NotebookNotes;
