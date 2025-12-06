import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { IResultExam } from "@/types/mockTest.type";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import Svg, { Circle } from "react-native-svg";

interface OverallScoreCardProps {
  result: IResultExam;
  theme: string;
}

export default function OverallScoreCard({
  result,
  theme,
}: OverallScoreCardProps) {
  const { t } = useLanguageContext();

  const totalQuestions = result.total_questions;
  const scoreTotal = parseFloat(result.score_total);
  const percentage =
    totalQuestions > 0 ? (scoreTotal / totalQuestions) * 100 : 0;
  const isPassed = result.is_passed;

  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <CardCustom
      variant="card"
      padding="md"
      style={{
        margin: DesignSystem.spacing.md,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Circular Progress */}

        <View
          style={{
            alignItems: "center",
            marginRight: DesignSystem.spacing.lg,
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.xl,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: getTextColor(theme as "light" | "dark", "primary"),
              textAlign: "center",
              marginBottom: DesignSystem.spacing.sm,
            }}
          >
            {result.name}
          </Text>
          <View style={{ position: "relative" }}>
            <Svg
              width={radius * 2 + strokeWidth}
              height={radius * 2 + strokeWidth}
            >
              <Circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                stroke={theme === "light" ? "#E5E7EB" : "#374151"}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                stroke={isPassed ? "#10B981" : "#EF4444"}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${radius + strokeWidth / 2} ${
                  radius + strokeWidth / 2
                })`}
              />
            </Svg>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xl,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: getTextColor(theme as "light" | "dark", "primary"),
                }}
              >
                {percentage.toFixed(1)}%
              </Text>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: isPassed ? "#10B981" : "#EF4444",
                  fontWeight: DesignSystem.typography.fontWeight.medium,
                }}
              >
                {isPassed ? t("passed") : t("failed")}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Side Info */}
        <View style={{ flex: 1, marginTop: DesignSystem.spacing.lg }}>
          <View
            style={{
              marginBottom: DesignSystem.spacing.sm,
              flexDirection: "row",
              alignItems: "center",
              gap: DesignSystem.spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: getTextColor(theme as "light" | "dark", "secondary"),
              }}
            >
              {t("totalQuestions")}:
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: getTextColor(theme as "light" | "dark", "primary"),
              }}
            >
              {totalQuestions}
            </Text>
          </View>

          <View
            style={{
              marginBottom: DesignSystem.spacing.sm,
              flexDirection: "row",
              gap: DesignSystem.spacing.xs,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: getTextColor(theme as "light" | "dark", "secondary"),
              }}
            >
              {t("score")}:
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: getTextColor(theme as "light" | "dark", "primary"),
              }}
            >
              {scoreTotal.toFixed(1)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: DesignSystem.spacing.xs,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: getTextColor(theme as "light" | "dark", "secondary"),
              }}
            >
              {t("time")}:
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: getTextColor(theme as "light" | "dark", "primary"),
              }}
            >
              {`${result.total_time_minutes}:00`}
            </Text>
          </View>
        </View>
      </View>
    </CardCustom>
  );
}
