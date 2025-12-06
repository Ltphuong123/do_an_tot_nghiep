import { useLanguageContext } from "@/contexts/languageContext";
import { IResultExam } from "@/types/mockTest.type";
import { calculateResultStats, getTestDuration } from "@/utils/result-helper";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface ResultHeaderProps {
  result: IResultExam;
  theme: string;
}

export default function ResultHeader({ result, theme }: ResultHeaderProps) {
  // Flatten all questions from sections and subsections
  const allQuestions = result.sections.flatMap((section) =>
    section.subsections.flatMap((subsection) =>
      subsection.questions.map((question, index) => ({
        question_id: question.id,
        question_order: question.order || index + 1,
        question_content: question.content,
        options: question.options,
        is_correct: question.is_correct,
        explanation: question.explanation || null,
        user_response: question.user_response,
        correct_answer_text: question.correct_answer_text,
        correct_answers_list: question.correct_answers_list,
      }))
    )
  );

  const { totalQuestions, correctAnswers, percentage } =
    calculateResultStats(allQuestions);
  const isPassed = result.is_passed;
  const { t } = useLanguageContext();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const duration = getTestDuration(result.start_time, result.end_time);

  return (
    <View
      style={{
        padding: 20,
        margin: 16,
        borderRadius: 16,
        backgroundColor: theme === "light" ? "#fff" : "#1f2937",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          gap: 12,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: isPassed
              ? theme === "light"
                ? "#10B981"
                : "#059669"
              : theme === "light"
              ? "#EF4444"
              : "#DC2626",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={isPassed ? "checkmark" : "close"}
            size={24}
            color="white"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: theme === "light" ? "#111827" : "#F9FAFB",
              marginBottom: 4,
            }}
          >
            {result.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: isPassed
                ? theme === "light"
                  ? "#10B981"
                  : "#34D399"
                : theme === "light"
                ? "#EF4444"
                : "#F87171",
              fontWeight: "600",
            }}
          >
            {isPassed ? t("passed") : t("failed")}
          </Text>
        </View>
      </View>

      {/* Score Display */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
          width: "100%",
        }}
      >
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: theme === "light" ? "#3B82F6" : "#60A5FA",
              textAlign: "center",
            }}
          >
            {parseFloat(result.score_total).toFixed(1)}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: theme === "light" ? "#6B7280" : "#9CA3AF",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {t("score")}
          </Text>
        </View>

        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: theme === "light" ? "#10B981" : "#34D399",
              textAlign: "center",
            }}
          >
            {percentage}%
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: theme === "light" ? "#6B7280" : "#9CA3AF",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {t("correctPercentage")}
          </Text>
        </View>

        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: theme === "light" ? "#8B5CF6" : "#A78BFA",
              textAlign: "center",
            }}
          >
            {correctAnswers}/{totalQuestions}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: theme === "light" ? "#6B7280" : "#9CA3AF",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {t("correctQuestions")}
          </Text>
        </View>
      </View>

      {/* Time Info */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: theme === "light" ? "#E5E7EB" : "#374151",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 12,
              color: theme === "light" ? "#6B7280" : "#9CA3AF",
              marginBottom: 4,
            }}
          >
            {t("testDuration")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme === "light" ? "#111827" : "#F9FAFB",
            }}
          >
            {duration}
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontSize: 12,
              color: theme === "light" ? "#6B7280" : "#9CA3AF",
              marginBottom: 4,
            }}
          >
            {t("completedAt")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme === "light" ? "#111827" : "#F9FAFB",
            }}
          >
            {formatTime(result.end_time)}
          </Text>
        </View>
      </View>

      {/* Section Scores */}
      {result.section_scores && result.section_scores.length > 0 && (
        <View
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: theme === "light" ? "#E5E7EB" : "#374151",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: theme === "light" ? "#111827" : "#F9FAFB",
              marginBottom: 12,
            }}
          >
            {t("sectionScores")}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {result.section_scores.map((section, index) => (
              <View
                key={section.section_id}
                style={{
                  flex: 1,
                  minWidth: 120,
                  backgroundColor: theme === "light" ? "#F8FAFC" : "#1F2937",
                  borderRadius: 8,
                  padding: 12,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: theme === "light" ? "#E2E8F0" : "#374151",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: theme === "light" ? "#3B82F6" : "#60A5FA",
                    marginBottom: 4,
                  }}
                >
                  {section.score}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: theme === "light" ? "#6B7280" : "#9CA3AF",
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  {section.section_name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
