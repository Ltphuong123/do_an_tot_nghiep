import { ContainerCustom } from "@/components/shared/containerCustom";
import TipCard from "@/components/shared/tipCard";
import { DesignSystem } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useExamTypes, useTips } from "@/hooks/useMockTest";
import { useTipsStore } from "@/store/useTipsStore";
import { IExamType } from "@/types/mockTest.type";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import ExamTypeSection from "./components/examTypeSection";
import MockTestHeader from "./components/mockTestHeader";

export default function MockTestScreen() {
  const screenWidth = Dimensions.get("window").width;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();
  const queryClient = useQueryClient();

  // Use React Query hooks
  const { data: examTypes, error: examTypesError } = useExamTypes();
  const { data: tipsData, error: tipsError } = useTips();

  const { tipsStudyStore, setTipsStudyStore } = useTipsStore();
  const StudyTips: string[] = useMemo(
    () => ["HSSK", "HSKK", "TOCFL", "D4"],
    []
  );

  // Filter tips based on study topics
  const filteredTips = useMemo(() => {
    if (!tipsData) return [];
    return tipsData.filter((item) => StudyTips.includes(item.topic));
  }, [tipsData, StudyTips]);

  // Update tips store when data changes
  useEffect(() => {
    if (filteredTips.length > 0) {
      setTipsStudyStore(filteredTips);
    }
  }, [filteredTips, setTipsStudyStore]);

  // Handle errors
  useEffect(() => {
    if (examTypesError) {
      showSnackbar(t("errorLoadingExamTypes"), "error");
    }
  }, [examTypesError, showSnackbar, t]);

  useEffect(() => {
    if (tipsError) {
      showSnackbar(t("errorLoadingTips"), "error");
    }
  }, [tipsError, showSnackbar, t]);

  const handleLeaderboardPress = () => {
    router.push("/mockTest/leaderboard");
  };

  const handleHistoryPress = () => {
    router.replace("/mockTest/history");
  };

  const handleDownloadPress = () => {
    router.push("/mockTest/downloaded");
  };

  const handleSeeAll = (examType: IExamType) => {
    router.push({
      pathname: "/mockTest/seeAllExam" as any,
      params: {
        examType: JSON.stringify(examType),
      },
    });
  };

  const handleRefresh = useCallback(async () => {
    console.log("Refreshing...");
    setIsRefreshing(true);
    try {
      await queryClient.refetchQueries({ queryKey: ["mockTest"] });
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  const handleTipPress = () => {
    router.push("/tips");
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      <MockTestHeader
        onLeaderboardPress={handleLeaderboardPress}
        onHistoryPress={handleHistoryPress}
        onDownloadedPress={handleDownloadPress}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: DesignSystem.spacing.sm,
            paddingTop: DesignSystem.spacing.lg,
          }}
          style={{ width: "100%", paddingBottom: 5 }}
          snapToInterval={screenWidth * 0.85 + 12}
          decelerationRate="fast"
        >
          <View
            style={{
              flexDirection: "row",
              gap: DesignSystem.spacing.md,
              paddingLeft: 10,
            }}
          >
            {tipsStudyStore.map((tip, index) => (
              <TipCard
                key={tip.id}
                tip={tip}
                onPress={() => handleTipPress()}
                width={screenWidth * 0.75}
                height={90}
              />
            ))}
          </View>
        </ScrollView>

        {examTypes?.map((examType) => (
          <ExamTypeSection
            key={examType.id}
            examType={examType}
            onSeeAll={() => handleSeeAll(examType)}
            showSnackbar={showSnackbar}
          />
        ))}
        <View style={{ height: DesignSystem.spacing.lg }} />
      </ScrollView>
    </ContainerCustom>
  );
}
