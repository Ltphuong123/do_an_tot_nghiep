import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { ISection } from "@/types/mockTest.type";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

interface QuestionNavigationCardProps {
  section: ISection;
  onQuestionPress: (questionId: string) => void;
  theme: string;
}

export default function QuestionNavigationCard({
  section,
  onQuestionPress,
  theme,
}: QuestionNavigationCardProps) {
  return (
    <CardCustom
      variant="card"
      padding="md"
      style={{
        margin: DesignSystem.spacing.md,
        marginBottom: 0,
      }}
    >
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: getTextColor(theme as "light" | "dark", "primary"),
          marginBottom: DesignSystem.spacing.md,
        }}
      >
        {section.name}
      </Text>

      {section.subsections.map((subsection) => (
        <View
          key={subsection.id}
          style={{ marginBottom: DesignSystem.spacing.md }}
        >
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.md,
              fontWeight: DesignSystem.typography.fontWeight.medium,
              color: getTextColor(theme as "light" | "dark", "primary"),
              marginBottom: DesignSystem.spacing.sm,
            }}
          >
            {subsection.name}
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: DesignSystem.spacing.md,
            }}
          >
            {subsection.questions.map((question) => {
              const isCorrect = question.is_correct === true;

              return (
                <TouchableOpacity
                  key={question.id}
                  onPress={() => onQuestionPress(question.id)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isCorrect ? "#10B981" : "#EF4444",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.sm,
                      fontWeight: DesignSystem.typography.fontWeight.bold,
                      color: "#FFFFFF",
                    }}
                  >
                    {(question.order ?? 0) + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </CardCustom>
  );
}
