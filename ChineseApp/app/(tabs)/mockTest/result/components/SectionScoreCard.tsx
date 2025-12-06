import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { ISubsection } from "@/types/mockTest.type";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon, ProgressBar, Text } from "react-native-paper";

interface SectionScoreCardProps {
  section: {
    score: number;
    section_id: string;
    section_name: string;
    correct_count: number;
    total_questions: number;
  };
  subsections: ISubsection[];
  theme: string;
}

export default function SectionScoreCard({
  section,
  subsections,
  theme,
}: SectionScoreCardProps) {
  const [expanded, setExpanded] = useState(false);

  const percentage =
    section.total_questions > 0
      ? (section.correct_count / section.total_questions) * 100
      : 0;

  return (
    <CardCustom
      variant="card"
      padding="md"
      style={{
        margin: DesignSystem.spacing.md,
        marginBottom: 0,
      }}
    >
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.lg,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: getTextColor(theme as "light" | "dark", "primary"),
            }}
          >
            {section.section_name} ({section.correct_count}/
            {section.total_questions})
          </Text>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.md,
              color: getTextColor(theme as "light" | "dark", "secondary"),
            }}
          >
            {percentage.toFixed(1)}%
          </Text>
          <ProgressBar
            progress={percentage / 100}
            color={getTextColor(theme as "light" | "dark", "primary")}
            style={{ marginTop: DesignSystem.spacing.xs }}
          />
        </View>
        <Icon
          source={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={getTextColor(theme as "light" | "dark", "secondary")}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={{ marginTop: DesignSystem.spacing.md }}>
          {subsections.map((subsection) => {
            const subsectionQuestions = subsection.questions || [];
            const correctCount = subsectionQuestions.filter(
              (q) => q.is_correct === true
            ).length;
            const subPercentage =
              subsectionQuestions.length > 0
                ? (correctCount / subsectionQuestions.length) * 100
                : 0;

            return (
              <View
                key={subsection.id}
                style={{
                  marginBottom: DesignSystem.spacing.sm,
                  padding: DesignSystem.spacing.sm,
                  backgroundColor: theme === "light" ? "#F8FAFC" : "#1F2937",
                  borderRadius: DesignSystem.borderRadius.md,
                }}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.md,
                    fontWeight: DesignSystem.typography.fontWeight.medium,
                    color: getTextColor(theme as "light" | "dark", "primary"),
                  }}
                >
                  {subsection.name} ({correctCount}/{subsectionQuestions.length}
                  )
                </Text>
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    color: getTextColor(theme as "light" | "dark", "secondary"),
                  }}
                >
                  {subPercentage.toFixed(1)}%
                </Text>
                <ProgressBar
                  progress={subPercentage / 100}
                  color={getTextColor(theme as "light" | "dark", "primary")}
                  style={{ marginTop: DesignSystem.spacing.xs }}
                />
              </View>
            );
          })}
        </View>
      )}
    </CardCustom>
  );
}
