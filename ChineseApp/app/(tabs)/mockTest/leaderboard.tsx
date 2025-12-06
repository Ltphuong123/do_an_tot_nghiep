import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import {
  useExamLevels,
  useExamTypes,
  useLeaderboardByExamLevel,
} from "@/hooks/useMockTest";
import { IExamLevel, IExamType } from "@/types/mockTest.type";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import ExamSelector from "./components/ExamSelector";
import LeaderboardList, {
  ILeaderboardUser,
} from "./components/LeaderboardList";

export default function LeaderboardScreen() {
  const { theme } = useThemeContext();

  // States for selections
  const [selectedExamType, setSelectedExamType] = useState<IExamType | null>(
    null
  );
  const [selectedExamLevel, setSelectedExamLevel] = useState<IExamLevel | null>(
    null
  );
  const [showExamTypeMenu, setShowExamTypeMenu] = useState(false);

  const { t } = useLanguageContext();

  // Use React Query hooks
  const { data: examTypes } = useExamTypes();
  const { data: examLevels, isLoading: isLoadingLevels } = useExamLevels(
    selectedExamType?.id || ""
  );
  const {
    data: leaderboardData,
    isLoading: isLoadingLeaderboard,
    isFetching: isRefreshing,
    refetch: refetchLeaderboard,
  } = useLeaderboardByExamLevel(selectedExamLevel?.id || "");

  // Auto-select first exam type
  useEffect(() => {
    if (examTypes && examTypes.length > 0 && !selectedExamType) {
      setSelectedExamType(examTypes[0]);
    }
  }, [examTypes, selectedExamType]);

  // Auto-select first exam level when exam type changes
  useEffect(() => {
    if (examLevels && examLevels.length > 0 && !selectedExamLevel) {
      setSelectedExamLevel(examLevels[0]);
    } else if (!examLevels || examLevels.length === 0) {
      setSelectedExamLevel(null);
    }
  }, [examLevels, selectedExamLevel]);

  // Map leaderboard data to component interface
  const mappedLeaderboardData: ILeaderboardUser[] = leaderboardData
    ? leaderboardData.map((item: any) => ({
        user_id: item.user_id,
        user_name: item.user_name,
        user_avatar: item.avatar_url,
        user_level: item.exam_level_name,
        max_score: item.total_score,
        badge_level: 0, // Not available in this API
        badge_name: "",
        badge_icon: "",
        badge_min_points: 0,
      }))
    : [];

  // Handlers
  const handleSelectExamType = (examType: IExamType) => {
    setSelectedExamType(examType);
    // Reset dependent selections
    setSelectedExamLevel(null);
  };

  const handleSelectExamLevel = (level: IExamLevel) => {
    setSelectedExamLevel(level);
  };

  const handleRefresh = () => {
    refetchLeaderboard();
  };

  return (
    <ContainerCustom variant="background" scrollable={false}>
      {/* Header */}
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
        {/* Back Button */}
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
          {t("leaderboard")}
        </Text>

        {/* Refresh Button */}
        <Pressable onPress={handleRefresh} disabled={!selectedExamLevel}>
          <Icon
            source="refresh"
            size={20}
            color={getTextColor(theme, "secondary")}
          />
        </Pressable>
      </View>

      {/* Content */}
      <View style={{ flex: 1, padding: DesignSystem.spacing.md }}>
        {/* Exam Selector */}
        <ExamSelector
          examTypes={examTypes || []}
          selectedExamType={selectedExamType}
          onSelectExamType={handleSelectExamType}
          examLevels={examLevels || []}
          selectedExamLevel={selectedExamLevel}
          onSelectExamLevel={handleSelectExamLevel}
          showExamTypeMenu={showExamTypeMenu}
          setShowExamTypeMenu={setShowExamTypeMenu}
          isLoadingLevels={isLoadingLevels}
        />

        {/* Leaderboard */}
        <LeaderboardList
          data={mappedLeaderboardData}
          loading={isLoadingLeaderboard}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </ContainerCustom>
  );
}
