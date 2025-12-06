import { AutoImage } from "@/components/shared/imageCustomer";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface QuestionOptionsProps {
  question: any;
  theme: string;
}

export default function QuestionOptions({
  question,
  theme,
}: QuestionOptionsProps) {
  const isLocalAsset = (v: any) => typeof v === "number";

  const normalizeSelectionToIds = (
    sel?: string | string[] | null
  ): string[] => {
    if (!sel) return [];
    if (Array.isArray(sel)) return sel.filter((s) => !!s);
    if (typeof sel === "string") {
      return sel.includes(",")
        ? sel.split(",").map((s) => s.trim())
        : [sel.trim()];
    }
    return [];
  };

  const selectedIds = normalizeSelectionToIds(question.user_response);

  return (
    <>
      {question.options &&
        question.options.map((option: any) => {
          const isSelected = selectedIds.includes(option.id || "");
          const isCorrectOption = !!option.is_correct;

          let backgroundColor: string | undefined = undefined;
          let textColor = getTextColor(theme as "light" | "dark", "primary");

          if (isCorrectOption) {
            backgroundColor = "#10B981"; // green
            textColor = "#FFFFFF";
          } else if (isSelected && !isCorrectOption) {
            backgroundColor = "#EF4444"; // red for wrong selected
            textColor = "#FFFFFF";
          }

          return (
            <View
              key={option.id}
              style={{
                padding: DesignSystem.spacing.sm,
                marginBottom: DesignSystem.spacing.xs,
                backgroundColor,
                borderRadius: DesignSystem.borderRadius.md,
                borderWidth: 1,
                borderColor: isSelected
                  ? isCorrectOption
                    ? "#10B981"
                    : "#EF4444"
                  : getTextColor(theme as "light" | "dark", "secondary") + "33",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: textColor,
                    flex: 1,
                  }}
                >
                  {option.label}. {option.content}
                </Text>
                {option.image_url && (
                  <AutoImage
                    source={
                      isLocalAsset(option.image_url)
                        ? (option.image_url as any)
                        : { uri: option.image_url as string }
                    }
                    maxWidthPercent={0.3}
                  />
                )}
              </View>
            </View>
          );
        })}
    </>
  );
}
