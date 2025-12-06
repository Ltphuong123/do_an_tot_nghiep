import { CardCustom } from "@/components/shared/cardCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import DesignSystem, {
  getBackgroundColor,
  getIconColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useHistoryExamByName } from "@/hooks/useMockTest";
import { IHistoryExam } from "@/types/mockTest.type";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const HistoryScreen = () => {
  const { theme } = useThemeContext();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();
  const params = useLocalSearchParams();
  const exam_type_id = params.exam_type_id as string;
  const exam_level_id = params.exam_level_id as string;
  const exam_name = params.exam_name as string;

  const isFocused = useIsFocused();

  // Use the new hook for specific exam history
  const {
    data: historyExams = [],
    isLoading,
    refetch,
  } = useHistoryExamByName(
    exam_type_id || "",
    exam_level_id || "",
    exam_name || ""
  );

  console.log("History Exams:", historyExams);

  // Refetch when screen is focused
  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  const renderItem = ({ item }: { item: IHistoryExam }) => {
    const endTime = item.end_time
      ? new Date(item.end_time).toLocaleString()
      : "";
    return (
      <Pressable
        onPress={() => {
          if (item.score_total === null) {
            showSnackbar(t("testNotSubmitted"), "info");
            return;
          }
          router.push({
            pathname: "/mockTest/result",
            params: { id: item.attempt_id, returnUrl: "/mockTest/history" },
          });
        }}
      >
        <CardCustom variant="card">
          {/* Title with icon */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Icon
              source="file-document-outline"
              size={20}
              color={getIconColor(theme, "primary")}
            />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: getTextColor(theme, "primary"),
                marginLeft: 8,
              }}
            >
              {item.exam_name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Score */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                source="star"
                size={16}
                color={getIconColor(theme, "star")}
              />
              <Text
                style={{ color: getTextColor(theme, "primary"), marginLeft: 4 }}
              >
                {t("scoreLabel")}: {item.score_total || "Chưa nộp bài"}{" "}
              </Text>
            </View>

            {/* Passed / Failed */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                source={
                  item.is_passed
                    ? "check-circle-outline"
                    : "close-circle-outline"
                }
                size={16}
                color={
                  item.is_passed
                    ? getIconColor(theme, "success")
                    : getIconColor(theme, "error")
                }
              />
              <Text
                style={{ color: getTextColor(theme, "primary"), marginLeft: 4 }}
              >
                {item.is_passed ? t("passedHistory") : t("failedHistory")}
              </Text>
            </View>
          </View>

          {/* Time */}
          <View
            style={{ marginTop: 8, flexDirection: "row", alignItems: "center" }}
          >
            <Icon
              source="clock-outline"
              size={14}
              color={getIconColor(theme, "neutral")}
            />
            <Text
              style={{
                color: getTextColor(theme, "primary"),
                fontSize: DesignSystem.typography.fontSize.sm,
                marginLeft: 4,
              }}
            >
              {t("timeLabel")}: {endTime}
            </Text>
          </View>
        </CardCustom>
      </Pressable>
    );
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: DesignSystem.spacing.md,
          gap: DesignSystem.spacing.md,
          backgroundColor: getBackgroundColor(theme, "primary"),
          ...DesignSystem.shadows[theme].md,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            source="arrow-left"
            size={24}
            color={getTextColor(theme, "primary")}
          />
        </Pressable>

        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text
            style={{
              flex: 1,
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: getTextColor(theme, "primary"),
            }}
          >
            {exam_name || t("historyTitle")}
          </Text>
        </View>
      </View>

      <FlatList
        data={historyExams}
        keyExtractor={(item) => item.attempt_id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 12,
          paddingHorizontal: 16,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Icon
                source="history"
                size={36}
                color={getTextColor(theme, "primary")}
              />
              <Text
                style={{ color: getTextColor(theme, "primary"), marginTop: 8 }}
              >
                {t("noHistory")}
              </Text>
            </View>
          ) : null
        }
      />
    </ContainerCustom>
  );
};

export default HistoryScreen;
