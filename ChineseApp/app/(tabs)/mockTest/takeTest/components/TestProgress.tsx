/**
 * Test Progress Component
 * Hiển thị tiến trình làm bài: số câu đã làm, progress bar, số câu đánh dấu
 */

import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

interface TestProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestionNumber?: number; // Add optional prop for current question number
}

const TestProgress = React.memo(
  ({
    currentQuestionIndex,
    totalQuestions,
    currentQuestionNumber,
  }: TestProgressProps) => {
    const { theme } = useThemeContext();
    const secondaryTextColor = getTextColor(theme, "secondary");

    // Use the current question number if provided, otherwise fall back to index + 1
    const displayQuestionNumber =
      currentQuestionNumber !== undefined
        ? currentQuestionNumber
        : currentQuestionIndex + 1;

    // Calculate progress based on the actual question number, not the section index
    const prosgress = Math.round(
      (displayQuestionNumber / totalQuestions) * 100
    );
    const progress = prosgress > 100 ? 100 : prosgress;
    // const answeredCount = getAnsweredCount(answers);
    // const markedCount = getMarkedCount(answers);

    const gradientColors = DesignSystem.gradients[theme].primary;

    return (
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarBackground,
              { backgroundColor: theme === "dark" ? "#1a1a2e" : "#e9ecef" },
            ]}
          >
            <LinearGradient
              colors={[gradientColors[0], gradientColors[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={[styles.progressText, { color: secondaryTextColor }]}>
            {displayQuestionNumber}/{totalQuestions}
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "right",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

TestProgress.displayName = "TestProgress";

export default TestProgress;
