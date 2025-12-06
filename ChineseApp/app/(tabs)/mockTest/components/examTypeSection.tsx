import ConfirmModal from "@/components/shared/confirmModal";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { useExamLevels, useMockTests } from "@/hooks/useMockTest";
import { IExam, IExamLevel, IExamType } from "@/types/mockTest.type";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import LevelTabs from "./levelTabs";
import TestCard from "./testCard";

interface ExamTypeSectionProps {
  examType: IExamType;
  onSeeAll: () => void;
  showSnackbar: (message: string, type: "info" | "error" | "success") => void;
}

export default function ExamTypeSection({
  examType,
  onSeeAll,
  showSnackbar,
}: ExamTypeSectionProps) {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const { modalState, showConfirm, hideConfirm, handleConfirm } =
    useConfirmModal();
  const [selectedLevel, setSelectedLevel] = useState<IExamLevel | undefined>();

  // Use React Query hooks
  const { data: examLevels } = useExamLevels(examType.id);
  const { data: tests, isLoading: testsLoading } = useMockTests(
    examType.id,
    selectedLevel?.id
  );

  console.log(
    "Tests for",
    examType.name,
    "and level",
    selectedLevel?.name,
    ":",
    tests
  );

  // Set default selected level when examLevels load
  useEffect(() => {
    if (examLevels && examLevels.length > 0 && !selectedLevel) {
      setSelectedLevel(examLevels[0]);
    }
  }, [examLevels, selectedLevel]);

  const handleTestPress = (test: IExam) => {
    showConfirm({
      title: t("startTest"),
      message: t("confirmStartTest") + test.name + "?",
      confirmText: t("start"),
      cancelText: t("cancel"),
      icon: "play-circle",
      iconColor: "#4CAF50",
      onConfirm: () => {
        router.push({
          pathname: `/mockTest/takeTest/[id]`,
          params: { id: test.id, test: JSON.stringify(test) },
        });
      },
    });
  };

  const handleLevelSelect = useCallback((level: IExamLevel) => {
    setSelectedLevel(level);
  }, []);

  return (
    <>
      <View style={{ marginVertical: DesignSystem.spacing.sm }}>
        {/* Section Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: DesignSystem.spacing.md,
            marginBottom: DesignSystem.spacing.xs,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: DesignSystem.spacing.sm,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  theme === "light"
                    ? "rgba(74, 144, 226, 0.1)"
                    : "rgba(74, 144, 226, 0.2)",
              }}
            >
              <Icon source="certificate" size={20} color="#4A90E2" />
            </View>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
              }}
            >
              {examType.name}
            </Text>
          </View>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingHorizontal: DesignSystem.spacing.sm,
              paddingVertical: DesignSystem.spacing.xs,
              borderRadius: DesignSystem.borderRadius.full,
              backgroundColor:
                theme === "light"
                  ? "rgba(74, 144, 226, 0.1)"
                  : "rgba(74, 144, 226, 0.2)",
            }}
            onPress={onSeeAll}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: "#4A90E2",
              }}
            >
              {t("seeAll")}
            </Text>
            <Icon source="chevron-right" size={18} color="#4A90E2" />
          </Pressable>
        </View>

        {/* Level Tabs */}
        <LevelTabs
          levels={examLevels || []}
          selectedLevel={selectedLevel}
          onSelectLevel={handleLevelSelect}
        />

        {testsLoading ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
              paddingHorizontal: DesignSystem.spacing.md,
            }}
          >
            <ActivityIndicator size="large" />
            <Text
              style={{
                color: getTextColor(theme, "primary"),
                marginTop: 8,
                fontSize: DesignSystem.typography.fontSize.sm,
              }}
            >
              {t("loadingTests")}
            </Text>
          </View>
        ) : tests && tests.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: DesignSystem.spacing.md,
              paddingVertical: DesignSystem.spacing.xs,
            }}
          >
            {tests.map((test) => (
              <TestCard
                key={test.id}
                title={test.name}
                questionCount={test.total_questions}
                duration={test.total_time_minutes}
                exam={test}
                onPress={() => handleTestPress(test)}
              />
            ))}
          </ScrollView>
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 40,
              gap: DesignSystem.spacing.sm,
            }}
          >
            <Icon
              source="alert-circle-outline"
              size={40}
              color={secondaryTextColor}
            />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: secondaryTextColor,
              }}
            >
              {t("noTestsForLevel")}
            </Text>
          </View>
        )}
      </View>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={modalState.visible}
        onRequestClose={hideConfirm}
        onConfirm={handleConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        icon={modalState.icon}
        iconColor={modalState.iconColor}
        variant="confirm"
      />
    </>
  );
}
