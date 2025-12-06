import { getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React, { useCallback, useMemo } from "react";
import { FlatList, Modal, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface QuestionNavigationProps {
  visible: boolean;
  onClose: () => void;
  totalQuestions: number;
  currentQuestionIndex: number;
  questionIds: string[];
  answeredQuestions: Record<string, string | string[]>;
  onQuestionSelect: (index: number) => void;
  // Optional continuous question numbers (global across exam). If provided,
  // buttons will show these numbers instead of local 1..N numbering.
  questionNumbers?: number[];
}

const QuestionNavigation = React.memo(
  ({
    visible,
    onClose,
    totalQuestions,
    currentQuestionIndex,
    questionIds,
    answeredQuestions,
    onQuestionSelect,
    questionNumbers,
  }: QuestionNavigationProps) => {
    const { theme } = useThemeContext();
    const { t } = useLanguageContext();
    const textColor = getTextColor(theme, "primary");
    const secondaryTextColor = getTextColor(theme, "secondary");
    const bgColor = theme === "dark" ? "#0f0f1e" : "#ffffff";

    const renderQuestionButton = useCallback(
      (item: { index: number }) => {
        const index = item.index;
        const questionId = questionIds[index];
        const isCurrent = index === currentQuestionIndex;
        const isAnswered =
          questionId && answeredQuestions[questionId] !== undefined;

        let buttonColor = theme === "dark" ? "#2a2a4a" : "#e9ecef";
        let textButtonColor = secondaryTextColor;

        // Nếu câu hỏi hiện tại
        if (isCurrent) {
          buttonColor = theme === "dark" ? "#4a4aff" : "#2196F3";
          textButtonColor = "#ffffff";
        }
        // Nếu đã trả lời
        else if (isAnswered) {
          buttonColor = theme === "dark" ? "#2d5016" : "#C8E6C9";
          textButtonColor = theme === "dark" ? "#81c784" : "#2E7D32";
        }

        return (
          <Pressable
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              backgroundColor: buttonColor,
              margin: 6,
            }}
            onPress={() => {
              onQuestionSelect(index);
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: textButtonColor,
              }}
            >
              {questionNumbers && questionNumbers[index]
                ? questionNumbers[index]
                : index + 1}
            </Text>
          </Pressable>
        );
      },
      [
        questionIds,
        currentQuestionIndex,
        answeredQuestions,
        theme,
        secondaryTextColor,
        questionNumbers,
        onQuestionSelect,
      ]
    );

    const data = useMemo(
      () => Array.from({ length: totalQuestions }, (_, index) => ({ index })),
      [totalQuestions]
    );

    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingBottom: 40,
              height: "80%",
              backgroundColor: bgColor,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: textColor,
                }}
              >
                {t("chooseQuestion")}
              </Text>
              <Pressable onPress={onClose} style={{ padding: 4 }}>
                <Icon source="close" size={24} color={textColor} />
              </Pressable>
            </View>

            {/* Legend */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                paddingHorizontal: 20,
                paddingBottom: 16,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    backgroundColor: theme === "dark" ? "#4a4aff" : "#2196F3",
                  }}
                />
                <Text style={{ fontSize: 12, color: secondaryTextColor }}>
                  {t("current")}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    backgroundColor: theme === "dark" ? "#2d5016" : "#C8E6C9",
                  }}
                />
                <Text style={{ fontSize: 12, color: secondaryTextColor }}>
                  {t("done")}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    backgroundColor: theme === "dark" ? "#2a2a4a" : "#e9ecef",
                  }}
                />
                <Text style={{ fontSize: 12, color: secondaryTextColor }}>
                  {t("notDone")}
                </Text>
              </View>
            </View>

            {/* Danh sách câu hỏi */}
            <FlatList
              data={data}
              renderItem={renderQuestionButton}
              keyExtractor={(item) => item.index.toString()}
              numColumns={6}
              contentContainerStyle={{
                paddingBottom: 20,
                justifyContent: "center",
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    );
  }
);

QuestionNavigation.displayName = "QuestionNavigation";

export default QuestionNavigation;
