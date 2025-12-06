import { useLanguageContext } from "@/contexts/languageContext";
import { IOption } from "@/types/mockTest.type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";

interface OrderingQuestionProps {
  options: IOption[];
  selectedAnswer?: string | string[] | null;
  onAnswerSelect: (answer: string) => void;
  colors: any;
}

const OrderingQuestion: React.FC<OrderingQuestionProps> = React.memo(
  ({ options, selectedAnswer, onAnswerSelect, colors }) => {
    const { t } = useLanguageContext();

    // Derive selectedOrder from selectedAnswer
    const selectedOrder = React.useMemo(() => {
      if (typeof selectedAnswer === "string" && selectedAnswer) {
        try {
          // Try to reconstruct the order from content string
          const selectedContent = selectedAnswer;
          const selectedIds: string[] = [];

          // Try to match each option's content in the selected answer
          options.forEach((opt) => {
            if (selectedContent.includes(opt.content || "")) {
              selectedIds.push(opt.id);
            }
          });

          return selectedIds.length > 0 ? selectedIds : [];
        } catch {
          return [];
        }
      }
      return [];
    }, [selectedAnswer, options]);

    // Handle selecting an option
    const handleSelectOption = React.useCallback(
      (optionId: string) => {
        // Check if already selected
        if (selectedOrder.includes(optionId)) {
          return; // Do nothing if already selected
        }

        const newOrder = [...selectedOrder, optionId];

        // Convert IDs to content and join them
        const contentString = newOrder
          .map((id) => {
            const option = options.find((o) => o.id === id);
            return option?.content || "";
          })
          .join("");

        onAnswerSelect(contentString);
      },
      [selectedOrder, options, onAnswerSelect]
    );

    // Handle removing an option from selected order
    const handleRemoveOption = React.useCallback(
      (optionId: string) => {
        const newOrder = selectedOrder.filter((id) => id !== optionId);

        // Convert IDs to content and join them
        const contentString = newOrder
          .map((id) => {
            const option = options.find((o) => o.id === id);
            return option?.content || "";
          })
          .join("");

        onAnswerSelect(contentString);
      },
      [selectedOrder, options, onAnswerSelect]
    );

    // Determine if this is word ordering or sentence ordering
    const isWordOrdering = options.every(
      (opt) => opt.label === null || opt.label === ""
    );
    const instructionText = isWordOrdering
      ? t("chooseWordsCorrectOrder")
      : t("chooseSentencesCorrectOrder");

    // Check if an option is already selected
    const isOptionSelected = (optionId: string) => {
      return selectedOrder.includes(optionId);
    };

    return (
      <View style={{ marginTop: 8 }}>
        <Text
          style={{
            fontSize: 14,
            color: colors.text,
            marginBottom: 12,
            opacity: 0.8,
          }}
        >
          {instructionText}
        </Text>

        {/* Answer Area - Display selected options */}
        <View
          style={{
            minHeight: 60,
            padding: 12,
            marginBottom: 16,
            borderRadius: 10,
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: colors.primary,
            backgroundColor: colors.optionBg,
          }}
        >
          {selectedOrder.length === 0 ? (
            <Text
              style={{
                fontSize: 14,
                color: colors.text,
                opacity: 0.5,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {isWordOrdering
                ? t("chooseWordsCreateAnswer")
                : t("chooseSentencesOrder")}
            </Text>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {selectedOrder.map((optionId, index) => {
                const option = options.find((o) => o.id === optionId);
                if (!option) return null;

                return (
                  <View
                    key={optionId}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6,
                      paddingLeft: 12,
                      paddingRight: 8,
                      borderRadius: 20,
                      backgroundColor: colors.primary,
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: colors.onPrimary,
                      }}
                    >
                      {index + 1}. {option.content}
                    </Text>
                    <Pressable
                      onPress={() => handleRemoveOption(optionId)}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={colors.onPrimary}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Options Area - Display available options to select */}
        <Text
          style={{
            fontSize: 14,
            color: colors.text,
            marginBottom: 8,
            opacity: 0.8,
          }}
        >
          {isWordOrdering ? t("wordsLabel") : t("sentencesLabel")}
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {options.map((option) => {
            const isSelected = isOptionSelected(option.id);

            return (
              <Pressable
                key={option.id}
                onPress={() => !isSelected && handleSelectOption(option.id)}
                disabled={isSelected}
                style={({ pressed }) => ({
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.border : colors.primary,
                  backgroundColor: isSelected
                    ? colors.border
                    : pressed
                    ? colors.primaryDark
                    : colors.optionBg,
                  opacity: isSelected ? 0.4 : 1,
                })}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: isSelected ? colors.text : colors.text,
                    fontWeight: isSelected ? "400" : "500",
                  }}
                >
                  {option.content}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }
);

OrderingQuestion.displayName = "OrderingQuestion";

export default OrderingQuestion;
