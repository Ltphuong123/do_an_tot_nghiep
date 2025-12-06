/**
 * Test Bottom Actions Component
 * Hiển thị nút đánh dấu, previous, next, submit
 */

import { ButtonCustom } from "@/components/shared/buttonCustom";
import DesignSystem, { getColorAtived } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { View } from "react-native";

interface TestBottomActionsProps {
  currentQuestion: number;
  sectionTotalQuestions: number;
  currentSection: number;
  totalSections: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const TestBottomActions = React.memo(
  ({
    currentQuestion,
    sectionTotalQuestions,
    currentSection,
    totalSections,
    isSubmitting,
    onPrevious,
    onNext,
    onSubmit,
  }: TestBottomActionsProps) => {
    const { theme } = useThemeContext();
    const { t } = useLanguageContext();
    // Check if we're at the last question of the current section
    const isLastQuestionInSection =
      currentQuestion === sectionTotalQuestions - 1;
    // Check if we're at the last section
    const isLastSection = currentSection === totalSections - 1;
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          padding: DesignSystem.spacing.md,
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 0, 0, 0.05)",
          justifyContent: "space-between",
        }}
      >
        <ButtonCustom
          title={t("previousQuestion")}
          onPress={onPrevious}
          size="sm"
          disabled={currentQuestion === 0}
          startColors={getColorAtived(theme)}
          endColors={getColorAtived(theme)}
          textStyle={{ color: "#fff" }}
        />

        {/* Next or Submit Button */}
        {isLastQuestionInSection && isLastSection ? (
          <ButtonCustom
            title={isSubmitting ? t("submitting") : t("submitTestBottom")}
            onPress={onSubmit}
            size="sm"
            startColors={getColorAtived(theme)}
            endColors={getColorAtived(theme)}
            disabled={isSubmitting}
            textStyle={{ color: "#fff" }}
          />
        ) : (
          <ButtonCustom
            title={
              isLastQuestionInSection ? t("nextSection") : t("nextQuestion")
            }
            onPress={onNext}
            size="sm"
            disabled={false}
            startColors={getColorAtived(theme)}
            endColors={getColorAtived(theme)}
            textStyle={{ color: "#fff" }}
          />
        )}
      </View>
    );
  }
);

TestBottomActions.displayName = "TestBottomActions";

export default TestBottomActions;
