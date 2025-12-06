import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface WordBreakdownCardProps {
  word: {
    analyzed_word: string;
    word_meaning: string;
    pinyin: string;
    word_type: string;
    usage_note: string;
    example_sentences: {
      example_zh: string;
      example_vi: string;
      pinyin: string;
      context: string;
    }[];
  };
  isExpanded: boolean;
  onToggle: () => void;
  theme: "light" | "dark";
}

const WordBreakdownCard = ({
  word,
  isExpanded,
  onToggle,
  theme,
}: WordBreakdownCardProps) => {
  const { t } = useLanguageContext();
  const [speaking, setSpeaking] = useState(false);

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const cardBackground = getBackgroundColor(theme, "elevated");

  const handleSpeak = async (text: string) => {
    try {
      const isSpeaking = await Speech.isSpeakingAsync();

      if (isSpeaking) {
        await Speech.stop();
        setSpeaking(false);
        return;
      }

      setSpeaking(true);

      await Speech.speak(text, {
        language: "zh", // Chinese
        onDone: () => {
          setSpeaking(false);
        },
        onError: () => {
          setSpeaking(false);
        },
      });
    } catch {
      setSpeaking(false);
    }
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <View
      style={{
        marginBottom: DesignSystem.spacing.md,
        borderRadius: DesignSystem.borderRadius.lg,
        backgroundColor: cardBackground,
        ...DesignSystem.shadows[theme].sm,
        overflow: "hidden",
      }}
    >
      {/* Main word info - always visible */}
      <Pressable onPress={onToggle}>
        <View style={{ padding: DesignSystem.spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              {/* Chinese word with pinyin */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: DesignSystem.spacing.sm,
                  marginBottom: DesignSystem.spacing.xs,
                }}
              >
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.xl,
                    fontWeight: DesignSystem.typography.fontWeight.bold,
                    color: textColor,
                  }}
                >
                  {word.analyzed_word}
                </Text>
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    color: "#4A90E2",
                    fontStyle: "italic",
                  }}
                >
                  [{word.pinyin}]
                </Text>
              </View>

              {/* Vietnamese translation */}
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.base,
                  color: textColor,
                  fontWeight: DesignSystem.typography.fontWeight.medium,
                  marginBottom: DesignSystem.spacing.xs,
                }}
              >
                {word.word_meaning}
              </Text>

              {/* Word type and meaning */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: DesignSystem.spacing.sm,
                  flexWrap: "wrap",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: DesignSystem.spacing.sm,
                    paddingVertical: DesignSystem.spacing.xs,
                    backgroundColor:
                      theme === "light"
                        ? "rgba(76, 175, 80, 0.1)"
                        : "rgba(76, 175, 80, 0.2)",
                    borderRadius: DesignSystem.borderRadius.sm,
                  }}
                >
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.xs,
                      color: "#4CAF50",
                      fontWeight: DesignSystem.typography.fontWeight.medium,
                    }}
                  >
                    {word.word_type}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    color: secondaryTextColor,
                    flex: 1,
                  }}
                >
                  {word.usage_note}
                </Text>
              </View>
            </View>

            {/* Action buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: DesignSystem.spacing.xs,
                marginLeft: DesignSystem.spacing.md,
              }}
            >
              <Pressable
                onPress={() => handleSpeak(word.analyzed_word)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: speaking
                    ? "rgba(76, 175, 80, 0.3)"
                    : theme === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <Icon
                  source={speaking ? "stop-circle" : "volume-high"}
                  size={16}
                  color={speaking ? "#4CAF50" : secondaryTextColor}
                />
              </Pressable>

              <Pressable
                onPress={() => handleCopy(word.analyzed_word)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    theme === "light"
                      ? "rgba(0,0,0,0.05)"
                      : "rgba(255,255,255,0.1)",
                }}
              >
                <Icon
                  source="content-copy"
                  size={16}
                  color={secondaryTextColor}
                />
              </Pressable>

              <Icon
                source={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={secondaryTextColor}
              />
            </View>
          </View>
        </View>
      </Pressable>

      {/* Example sentences - expandable */}
      {isExpanded &&
        word.example_sentences &&
        word.example_sentences.length > 0 && (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor:
                theme === "light"
                  ? "rgba(0,0,0,0.05)"
                  : "rgba(255,255,255,0.05)",
              paddingTop: DesignSystem.spacing.md,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: textColor,
                paddingHorizontal: DesignSystem.spacing.md,
                marginBottom: DesignSystem.spacing.sm,
              }}
            >
              {t("exampleSentences")}
            </Text>

            {word.example_sentences.map((example, index) => (
              <View
                key={index}
                style={{
                  paddingHorizontal: DesignSystem.spacing.md,
                  paddingVertical: DesignSystem.spacing.sm,
                  marginBottom:
                    index === word.example_sentences.length - 1
                      ? DesignSystem.spacing.md
                      : DesignSystem.spacing.xs,
                  marginHorizontal: DesignSystem.spacing.md,
                  backgroundColor:
                    theme === "light"
                      ? "rgba(74, 144, 226, 0.05)"
                      : "rgba(74, 144, 226, 0.1)",
                  borderRadius: DesignSystem.borderRadius.md,
                }}
              >
                {/* Chinese sentence with pinyin */}
                <View style={{ marginBottom: DesignSystem.spacing.xs }}>
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.base,
                      color: textColor,
                      fontWeight: DesignSystem.typography.fontWeight.medium,
                    }}
                  >
                    {example.example_zh}
                  </Text>
                  <Text
                    style={{
                      fontSize: DesignSystem.typography.fontSize.xs,
                      color: "#4A90E2",
                      fontStyle: "italic",
                      marginTop: 2,
                    }}
                  >
                    {example.pinyin}
                  </Text>
                </View>

                {/* Vietnamese translation */}
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    color: secondaryTextColor,
                  }}
                >
                  {example.example_vi}
                </Text>
              </View>
            ))}
          </View>
        )}
    </View>
  );
};

export default WordBreakdownCard;
