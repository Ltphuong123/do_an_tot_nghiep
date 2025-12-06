import { IOption } from "@/types/mockTest.type";
import React from "react";
import { Image, Pressable, View } from "react-native";
import { Text } from "react-native-paper";

interface MultipleChoiceQuestionProps {
  options: IOption[];
  selectedAnswer?: string | string[] | null;
  // onAnswerSelect trả label (string cho single, string[] cho multiple)
  onAnswerSelect: (option: string | string[]) => void;
  allowMultiple?: boolean;
  colors: any;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> =
  React.memo(
    ({
      options,
      selectedAnswer,
      onAnswerSelect,
      allowMultiple = false,
      colors,
    }) => {
      // Helper: convert selectedAnswer to array of IDs
      const normalizeSelectionToIds = (
        sel?: string | string[] | null
      ): string[] => {
        if (!sel) return [];
        const parts = Array.isArray(sel)
          ? sel
          : typeof sel === "string"
          ? sel.includes(",")
            ? sel.split(",").map((s) => s.trim())
            : [sel]
          : [];

        return parts.filter(
          (s): s is string => typeof s === "string" && s !== ""
        );
      };

      const idsSelected = normalizeSelectionToIds(selectedAnswer);

      const isSelected = (option: IOption) => {
        return idsSelected.includes(option.id || "");
      };

      const handleOptionPress = (option: IOption) => {
        console.log(
          "Option pressed:",
          option,
          "Current selection:",
          selectedAnswer
        );

        const optionId = option.id?.trim();
        if (!optionId) {
          return;
        }

        if (allowMultiple) {
          // Get current selected IDs
          const currentIds = Array.isArray(selectedAnswer)
            ? selectedAnswer
            : typeof selectedAnswer === "string" && selectedAnswer
            ? selectedAnswer.split(",").map((s) => s.trim())
            : [];

          const exists = currentIds.includes(optionId);
          const newSelection = exists
            ? currentIds.filter((id) => id !== optionId)
            : [...currentIds, optionId];

          // Send array of IDs
          onAnswerSelect(newSelection);
        } else {
          // Send single ID
          onAnswerSelect(optionId);
        }
      };

      return (
        <View style={{ marginTop: 8 }}>
          {options.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => handleOptionPress(option)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                marginBottom: 10,
                borderRadius: 10,
                borderWidth: isSelected(option) ? 2 : 1,
                backgroundColor: isSelected(option)
                  ? colors.primary
                  : colors.card || colors.optionBg,
                borderColor: isSelected(option)
                  ? colors.primary
                  : colors.border,
                shadowColor: isSelected(option) ? colors.primary : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected(option) ? 0.3 : 0.1,
                shadowRadius: 4,
                elevation: isSelected(option) ? 4 : 2,
                opacity: pressed ? 0.9 : 1,
                gap: 12,
              })}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isSelected(option)
                    ? colors.primaryDark || colors.primary
                    : colors.primary || "#1565D8",
                  borderWidth: isSelected(option) ? 2 : 0,
                  borderColor: isSelected(option)
                    ? colors.onPrimary
                    : "transparent",
                }}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    color: isSelected(option) ? colors.onPrimary : "#FFFFFF",
                    fontSize: 14,
                  }}
                >
                  {option.label}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                {option.content && (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      lineHeight: 22,
                      color: isSelected(option)
                        ? colors.onPrimary
                        : colors.text,
                    }}
                  >
                    {option.content}
                  </Text>
                )}

                {option.image_url && (
                  <Image
                    source={{ uri: option.image_url }}
                    style={{
                      width: "100%",
                      height: 150,
                      marginTop: 8,
                      borderRadius: 8,
                    }}
                    resizeMode="contain"
                  />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      );
    }
  );

MultipleChoiceQuestion.displayName = "MultipleChoiceQuestion";

export default MultipleChoiceQuestion;
