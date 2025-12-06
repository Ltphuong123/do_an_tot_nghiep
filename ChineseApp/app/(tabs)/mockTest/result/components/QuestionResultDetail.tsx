import { useLanguageContext } from "@/contexts/languageContext";
import { IQuestionResult } from "@/types/mockTest.type";
import { stripHtml } from "@/utils/result-helper";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

interface QuestionResultDetailProps {
  question: IQuestionResult;
  questionIndex: number;
  theme: string;
}

export default function QuestionResultDetail({
  question,
  questionIndex,
  theme,
}: QuestionResultDetailProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguageContext();

  const isCorrect = question.is_correct === true;
  const hasOptions = question.options && question.options.length > 0;

  const getOptionStyle = (option: any) => {
    const isUserSelected = option.id === question.user_response;
    const isCorrectOption = option.is_correct;

    let backgroundColor = theme === "light" ? "#F9FAFB" : "#374151";
    let borderColor = theme === "light" ? "#E5E7EB" : "#4B5563";

    if (isCorrectOption) {
      backgroundColor = theme === "light" ? "#DCFCE7" : "#065F46";
      borderColor = theme === "light" ? "#16A34A" : "#10B981";
    } else if (isUserSelected && !isCorrectOption) {
      backgroundColor = theme === "light" ? "#FEE2E2" : "#7F1D1D";
      borderColor = theme === "light" ? "#DC2626" : "#EF4444";
    }

    return { backgroundColor, borderColor };
  };

  return (
    <View
      style={{
        marginBottom: 12,
        backgroundColor: theme === "light" ? "#FAFAFA" : "#2D3748",
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: theme === "light" ? "#E5E7EB" : "#4B5563",
      }}
    >
      {/* Question Header */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          backgroundColor: theme === "light" ? "#F8FAFC" : "#1A202C",
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: isCorrect
              ? theme === "light"
                ? "#10B981"
                : "#059669"
              : theme === "light"
              ? "#EF4444"
              : "#DC2626",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
          }}
        >
          <Ionicons
            name={isCorrect ? "checkmark" : "close"}
            size={16}
            color="white"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: theme === "light" ? "#111827" : "#F9FAFB",
            }}
          >
            {t("question")} {questionIndex + 1}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: isCorrect
                ? theme === "light"
                  ? "#10B981"
                  : "#34D399"
                : question.is_correct === false
                ? theme === "light"
                  ? "#EF4444"
                  : "#F87171"
                : theme === "light"
                ? "#F59E0B"
                : "#FCD34D",
              fontWeight: "500",
              marginTop: 2,
            }}
          >
            {isCorrect
              ? t("correct")
              : question.is_correct === false
              ? t("wrong")
              : t("notAnswered")}
          </Text>
        </View>

        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={theme === "light" ? "#6B7280" : "#9CA3AF"}
        />
      </TouchableOpacity>

      {/* Question Details */}
      {isExpanded && (
        <View style={{ padding: 12 }}>
          {/* Question Content */}
          {question.question_content && (
            <View
              style={{
                marginBottom: 12,
                padding: 10,
                backgroundColor: theme === "light" ? "#EEF2FF" : "#1E293B",
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: theme === "light" ? "#6B7280" : "#9CA3AF",
                  marginBottom: 4,
                  fontWeight: "600",
                }}
              >
                {t("questionContent")}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: theme === "light" ? "#374151" : "#D1D5DB",
                  lineHeight: 20,
                }}
              >
                {stripHtml(question.question_content)}
              </Text>
            </View>
          )}

          {/* Options for Multiple Choice */}
          {hasOptions && (
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: theme === "light" ? "#6B7280" : "#9CA3AF",
                  marginBottom: 8,
                  fontWeight: "600",
                }}
              >
                {t("options")}
              </Text>
              {question.options!.map((option: any) => {
                const optionStyle = getOptionStyle(option);
                const isUserSelected = option.id === question.user_response;
                const isCorrectOption = option.is_correct;

                return (
                  <View
                    key={option.id}
                    style={{
                      ...optionStyle,
                      borderWidth: 2,
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 8,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: isCorrectOption
                          ? theme === "light"
                            ? "#16A34A"
                            : "#10B981"
                          : isUserSelected && !isCorrectOption
                          ? theme === "light"
                            ? "#DC2626"
                            : "#EF4444"
                          : "transparent",
                        borderWidth: 2,
                        borderColor: isCorrectOption
                          ? theme === "light"
                            ? "#16A34A"
                            : "#10B981"
                          : isUserSelected && !isCorrectOption
                          ? theme === "light"
                            ? "#DC2626"
                            : "#EF4444"
                          : theme === "light"
                          ? "#D1D5DB"
                          : "#6B7280",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      {option.label && (
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "bold",
                            color:
                              isCorrectOption ||
                              (isUserSelected && !isCorrectOption)
                                ? "white"
                                : theme === "light"
                                ? "#6B7280"
                                : "#9CA3AF",
                          }}
                        >
                          {option.label}
                        </Text>
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      {option.content && (
                        <Text
                          style={{
                            fontSize: 14,
                            color: isCorrectOption
                              ? theme === "light"
                                ? "#166534"
                                : "#A7F3D0"
                              : isUserSelected && !isCorrectOption
                              ? theme === "light"
                                ? "#991B1B"
                                : "#FCA5A5"
                              : theme === "light"
                              ? "#374151"
                              : "#D1D5DB",
                            fontWeight:
                              isCorrectOption || isUserSelected
                                ? "600"
                                : "normal",
                          }}
                        >
                          {option.content}
                        </Text>
                      )}
                    </View>

                    <View style={{ marginLeft: 8, alignItems: "center" }}>
                      {isUserSelected && (
                        <View style={{ marginBottom: 4 }}>
                          <Ionicons
                            name="person"
                            size={18}
                            color={
                              isCorrectOption
                                ? theme === "light"
                                  ? "#16A34A"
                                  : "#10B981"
                                : theme === "light"
                                ? "#DC2626"
                                : "#EF4444"
                            }
                          />
                          <Text
                            style={{
                              fontSize: 9,
                              color: isCorrectOption
                                ? theme === "light"
                                  ? "#16A34A"
                                  : "#10B981"
                                : theme === "light"
                                ? "#DC2626"
                                : "#EF4444",
                              textAlign: "center",
                            }}
                          >
                            {t("you")}
                          </Text>
                        </View>
                      )}

                      {isCorrectOption && (
                        <View>
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color={theme === "light" ? "#16A34A" : "#10B981"}
                          />
                          <Text
                            style={{
                              fontSize: 9,
                              color: theme === "light" ? "#16A34A" : "#10B981",
                              textAlign: "center",
                            }}
                          >
                            {t("correct")}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* User Answer for Text/Audio Questions (when no options) */}
          {question.user_response && !hasOptions && (
            <View
              style={{
                padding: 12,
                backgroundColor: theme === "light" ? "#FEF3C7" : "#78350F",
                borderRadius: 8,
                marginBottom: 12,
                borderLeftWidth: 4,
                borderLeftColor: theme === "light" ? "#F59E0B" : "#FCD34D",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: theme === "light" ? "#92400E" : "#FCD34D",
                  marginBottom: 4,
                  fontWeight: "600",
                }}
              >
                {t("yourAnswer")}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: theme === "light" ? "#92400E" : "#FEF3C7",
                  fontWeight: "500",
                }}
              >
                {Array.isArray(question.user_response)
                  ? question.user_response.join(", ")
                  : question.user_response}
              </Text>
            </View>
          )}

          {/* Correct Answers List (for text input questions) */}
          {question.correct_answers_list &&
            question.correct_answers_list.length > 0 && (
              <View
                style={{
                  padding: 12,
                  backgroundColor: theme === "light" ? "#DCFCE7" : "#065F46",
                  borderRadius: 8,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: theme === "light" ? "#16A34A" : "#10B981",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: theme === "light" ? "#166534" : "#34D399",
                    marginBottom: 6,
                    fontWeight: "600",
                  }}
                >
                  {t("correctAnswer")}
                </Text>
                {question.correct_answers_list.map(
                  (answer: string, index: number) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom:
                          index < question.correct_answers_list!.length - 1
                            ? 6
                            : 0,
                      }}
                    >
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor:
                            theme === "light" ? "#166534" : "#34D399",
                          marginRight: 8,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          color: theme === "light" ? "#166534" : "#A7F3D0",
                          fontWeight: "500",
                          flex: 1,
                        }}
                      >
                        {answer}
                      </Text>
                    </View>
                  )
                )}
              </View>
            )}

          {/* Explanation */}
          {question.explanation && (
            <View
              style={{
                padding: 12,
                backgroundColor: theme === "light" ? "#EFF6FF" : "#1E3A8A",
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: theme === "light" ? "#3B82F6" : "#60A5FA",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name="bulb"
                  size={18}
                  color={theme === "light" ? "#1E40AF" : "#93C5FD"}
                />
                <Text
                  style={{
                    fontSize: 13,
                    color: theme === "light" ? "#1E40AF" : "#93C5FD",
                    marginLeft: 8,
                    fontWeight: "700",
                  }}
                >
                  {t("detailedExplanation")}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: theme === "light" ? "#1E40AF" : "#DBEAFE",
                  lineHeight: 20,
                }}
              >
                {stripHtml(question.explanation.content)}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
