import { useLanguageContext } from "@/contexts/languageContext";
import { useLoadingContext } from "@/contexts/loadingContext";
import { useThemeContext } from "@/contexts/themeContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, View } from "react-native";

import { ContainerCustom } from "@/components/shared/containerCustom";
import DesignSystem, {
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useSnackbar } from "@/contexts/snackbarContext";
import { getResult } from "@/services/mockTest";
import { IResultExam } from "@/types/mockTest.type";
import { stopAudio } from "@/utils/play_audio";
import { Icon, Text } from "react-native-paper";
import OverallScoreCard from "./components/OverallScoreCard";
import QuestionDetailModal from "./components/QuestionDetailModal";
import QuestionNavigationCard from "./components/QuestionNavigationCard";
import SectionScoreCard from "./components/SectionScoreCard";
export default function MockTestResult() {
  const { id, returnUrl } = useLocalSearchParams();
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const { showSnackbar } = useSnackbar();
  const { startLoading, stopLoading } = useLoadingContext();
  const [result, setResult] = useState<IResultExam | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  console.log("Result ID:", id);

  useEffect(() => {
    // Stop any playing audio when entering result screen
    stopAudio().catch(() => {});
  }, []);

  useEffect(() => {
    const handleFetchResult = async () => {
      startLoading();
      try {
        const result = await getResult(id as string);
        console.log("Fetched result:", result);
        if (result.success) {
          setResult(result.data);
        }
      } catch (error: any) {
        console.error("Error fetching result:", error);
        showSnackbar(error.error || t("errorFetchingResult"), "error");
      } finally {
        stopLoading();
      }
    };

    handleFetchResult();
  }, [id, startLoading, stopLoading, showSnackbar, t]);

  if (!result) {
    return (
      <ContainerCustom
        variant="background"
        scrollable={false}
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar
          barStyle={theme === "light" ? "dark-content" : "light-content"}
          backgroundColor="transparent"
          translucent
        />
        <Text
          style={{
            color: theme === "light" ? "#666" : "#ccc",
            fontSize: 16,
          }}
        >
          {t("loadingResult")}{" "}
        </Text>
      </ContainerCustom>
    );
  }

  return (
    <ContainerCustom
      variant="background"
      scrollable={false}
      style={{ flex: 1 }}
    >
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />

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
        <Pressable onPress={() => router.back()}>
          <Icon
            source="arrow-left"
            size={24}
            color={getTextColor(theme, "primary")}
          />
        </Pressable>

        {/* Title */}
        <Text
          style={{
            flex: 1,
            fontSize: DesignSystem.typography.fontSize.xl,
            fontWeight: DesignSystem.typography.fontWeight.bold,
            color: getTextColor(theme, "primary"),
          }}
        >
          Lịch sử bài thi
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {/* Overall Score Card */}
        <OverallScoreCard result={result} theme={theme} />

        {/* Section Score Cards */}
        {result.section_scores &&
          result.section_scores.map((section) => (
            <SectionScoreCard
              key={section.section_id}
              section={section}
              subsections={
                result.sections.find((s) => s.id === section.section_id)
                  ?.subsections || []
              }
              theme={theme}
            />
          ))}

        {/* Question Navigation Cards */}
        {result.sections &&
          result.sections.map((section) => (
            <QuestionNavigationCard
              key={section.id}
              section={section}
              onQuestionPress={(questionId) =>
                setSelectedQuestionId(questionId)
              }
              theme={theme}
            />
          ))}
      </ScrollView>

      {/* Question Detail Modal */}
      {selectedQuestionId !== null && (
        <QuestionDetailModal
          visible={selectedQuestionId !== null}
          onClose={() => setSelectedQuestionId(null)}
          result={result}
          initialQuestionId={selectedQuestionId}
          theme={theme}
        />
      )}
    </ContainerCustom>
  );
}
