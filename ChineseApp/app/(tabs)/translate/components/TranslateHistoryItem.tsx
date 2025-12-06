import { CardCustom } from "@/components/shared/cardCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";
import { deleteTranslateHistory } from "@/services/translate";
import { ITranslateHistory } from "@/types/translate.type";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface TranslateHistoryItemProps {
  item: ITranslateHistory;
  onDelete: (itemId: string) => void;
}

const TranslateHistoryItem: React.FC<TranslateHistoryItemProps> = ({
  item,
  onDelete,
}) => {
  const { theme } = useThemeContext();
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMetadata =
    item.metadata &&
    item.metadata.word_breakdown &&
    item.metadata.word_breakdown.length > 0;

  const getLanguageFlag = (langCode: string) => {
    switch (langCode) {
      case "vn":
      case "vi":
        return "🇻🇳";
      case "zh":
        return "🇨🇳";
      default:
        return "🌐";
    }
  };

  const getLanguageName = (langCode: string) => {
    switch (langCode) {
      case "vn":
      case "vi":
        return "Tiếng Việt";
      case "zh":
        return "中文";
      default:
        return langCode.toUpperCase();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDelete = () => {
    Alert.alert(t("deleteHistory"), t("confirmDelete"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            setIsDeleting(true);
            const response = await deleteTranslateHistory(item.id);
            if (response.success) {
              onDelete(item.id);
              showSnackbar(t("deletedHistory"), "success");
            } else {
              showSnackbar(t("errorDeleting"), "error");
            }
          } catch (error) {
            console.error("Error deleting translation history:", error);
            showSnackbar(t("errorDeleting"), "error");
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  const handleCopy = () => {
    // TODO: Implement copy to clipboard functionality
    console.log("Copy:", item.translated_text);
    showSnackbar(t("copiedToClipboard"), "success");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share:", item);
    showSnackbar(t("shareDeveloping"), "info");
  };

  return (
    <CardCustom
      variant="card"
      style={{
        marginBottom: DesignSystem.spacing.md,
        opacity: isDeleting ? 0.5 : 1,
      }}
    >
      <View style={{ padding: DesignSystem.spacing.md }}>
        {/* Header with languages, AI badge, and delete button */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: DesignSystem.spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 6 }}>
              {getLanguageFlag(item.source_lang)}
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.medium,
                color: getTextColor(theme, "primary"),
              }}
            >
              {getLanguageName(item.source_lang)}
            </Text>
            <Icon
              source="arrow-right"
              size={16}
              color={getTextColor(theme, "primary")}
            />
            <Text style={{ fontSize: 20, marginRight: 6 }}>
              {getLanguageFlag(item.target_lang)}
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.medium,
                color: getTextColor(theme, "primary"),
              }}
            >
              {getLanguageName(item.target_lang)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: DesignSystem.spacing.xs,
            }}
          >
            {item.is_ai_translation && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: getBackgroundColor(theme, "elevated"),
                  paddingHorizontal: DesignSystem.spacing.sm,
                  paddingVertical: DesignSystem.spacing.xs,
                  borderRadius: DesignSystem.borderRadius.full,
                }}
              >
                <Icon
                  source="robot"
                  size={14}
                  color={getTextColor(theme, "primary")}
                />
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.xs,
                    fontWeight: DesignSystem.typography.fontWeight.semibold,
                    color: getTextColor(theme, "primary"),
                    marginLeft: 2,
                  }}
                >
                  AI
                </Text>
              </View>
            )}

            {/* Delete button */}
            <Pressable
              onPress={handleDelete}
              disabled={isDeleting}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  theme === "light"
                    ? "rgba(255, 0, 0, 0.1)"
                    : "rgba(255, 0, 0, 0.2)",
              }}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#FF4444" />
              ) : (
                <Icon source="delete-outline" size={18} color="#FF4444" />
              )}
            </Pressable>
          </View>
        </View>

        {/* Original text */}
        <View style={{ marginVertical: DesignSystem.spacing.xs }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.base,
              lineHeight: 24,
              color: getTextColor(theme, "primary"),
            }}
          >
            {item.source_text}
          </Text>
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            marginVertical: DesignSystem.spacing.sm,
            backgroundColor: getTextColor(theme, "secondary"),
            opacity: 0.3,
          }}
        />

        {/* Translated text */}
        <View style={{ marginVertical: DesignSystem.spacing.xs }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.base,
              lineHeight: 24,
              fontWeight: DesignSystem.typography.fontWeight.medium,
              color: getTextColor(theme, "primary"),
            }}
          >
            {item.translated_text}
          </Text>
        </View>

        {/* Footer with date and actions */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: DesignSystem.spacing.sm,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              source="calendar"
              size={16}
              color={getTextColor(theme, "secondary")}
            />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.xs,
                color: getTextColor(theme, "secondary"),
                marginLeft: 4,
              }}
            >
              {formatDate(item.created_at)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {hasMetadata && (
              <Pressable
                onPress={() => setIsExpanded(!isExpanded)}
                style={{
                  padding: DesignSystem.spacing.xs,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon
                  source={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={getTextColor(theme, "secondary")}
                />
              </Pressable>
            )}
            <Pressable
              onPress={handleCopy}
              style={{
                padding: DesignSystem.spacing.xs,
              }}
            >
              <Icon
                source="content-copy"
                size={20}
                color={getTextColor(theme, "secondary")}
              />
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={{
                padding: DesignSystem.spacing.xs,
              }}
            >
              <Icon
                source="share-variant"
                size={20}
                color={getTextColor(theme, "secondary")}
              />
            </Pressable>
          </View>
        </View>

        {/* Expandable metadata section */}
        {hasMetadata && isExpanded && (
          <View
            style={{
              marginTop: DesignSystem.spacing.md,
              padding: DesignSystem.spacing.sm,
              backgroundColor: getBackgroundColor(theme, "elevated"),
              borderRadius: DesignSystem.borderRadius.md,
              borderWidth: 1,
              borderColor: `${getTextColor(theme, "secondary")}20`,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: getTextColor(theme, "primary"),
                marginBottom: DesignSystem.spacing.sm,
              }}
            >
              Word Breakdown:
            </Text>
            <View>
              {item.metadata?.word_breakdown?.map((word, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: DesignSystem.spacing.md,
                    padding: DesignSystem.spacing.sm,
                    backgroundColor: theme === "light" ? "#f8f9fa" : "#2d2d2d",
                    borderRadius: DesignSystem.borderRadius.sm,
                  }}
                >
                  {/* Word header */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: DesignSystem.spacing.xs,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.lg,
                        fontWeight: DesignSystem.typography.fontWeight.bold,
                        color: getTextColor(theme, "primary"),
                        marginRight: DesignSystem.spacing.sm,
                      }}
                    >
                      {word.analyzed_word}
                    </Text>
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.sm,
                        color: getTextColor(theme, "secondary"),
                        fontStyle: "italic",
                      }}
                    >
                      [{word.pinyin}]
                    </Text>
                  </View>

                  {/* Word type */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: DesignSystem.spacing.xs,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: DesignSystem.typography.fontSize.xs,
                        fontWeight: DesignSystem.typography.fontWeight.semibold,
                        color: getTextColor(theme, "primary"),
                        backgroundColor: getBackgroundColor(theme, "elevated"),
                        paddingHorizontal: DesignSystem.spacing.xs,
                        paddingVertical: 2,
                        borderRadius: DesignSystem.borderRadius.sm,
                      }}
                    >
                      {word.word_type}
                    </Text>
                  </View>

                  {/* Word meaning */}
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.sm,
                      color: getTextColor(theme, "primary"),
                      marginBottom: DesignSystem.spacing.xs,
                      lineHeight: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: DesignSystem.typography.fontWeight.semibold,
                      }}
                    >
                      Nghĩa:{" "}
                    </Text>
                    {word.word_meaning}
                  </Text>

                  {/* Usage note */}
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.sm,
                      color: getTextColor(theme, "secondary"),
                      marginBottom: DesignSystem.spacing.sm,
                      lineHeight: 20,
                      fontStyle: "italic",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: DesignSystem.typography.fontWeight.semibold,
                      }}
                    >
                      Cách dùng:{" "}
                    </Text>
                    {word.usage_note}
                  </Text>

                  {/* Example sentences */}
                  {word.example_sentences &&
                    word.example_sentences.length > 0 && (
                      <View>
                        <Text
                          style={{
                            fontSize: DesignSystem.typography.fontSize.sm,
                            fontWeight: DesignSystem.typography.fontWeight.bold,
                            color: getTextColor(theme, "primary"),
                            marginBottom: DesignSystem.spacing.xs,
                          }}
                        >
                          Ví dụ:
                        </Text>
                        {word.example_sentences
                          .slice(0, 2)
                          .map((example, exampleIndex) => (
                            <View
                              key={exampleIndex}
                              style={{
                                marginBottom: DesignSystem.spacing.xs,
                                paddingLeft: DesignSystem.spacing.sm,
                                borderLeftWidth: 2,
                                borderLeftColor: getTextColor(
                                  theme,
                                  "secondary"
                                ),
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: DesignSystem.typography.fontSize.sm,
                                  color: getTextColor(theme, "primary"),
                                  marginBottom: 2,
                                }}
                              >
                                {example.example_zh}
                              </Text>
                              <Text
                                style={{
                                  fontSize: DesignSystem.typography.fontSize.xs,
                                  color: getTextColor(theme, "secondary"),
                                  fontStyle: "italic",
                                  marginBottom: 2,
                                }}
                              >
                                [{example.pinyin}]
                              </Text>
                              <Text
                                style={{
                                  fontSize: DesignSystem.typography.fontSize.sm,
                                  color: getTextColor(theme, "secondary"),
                                }}
                              >
                                {example.example_vi}
                              </Text>
                            </View>
                          ))}
                      </View>
                    )}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </CardCustom>
  );
};

export default TranslateHistoryItem;
