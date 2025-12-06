import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { TranslationData } from "@/types/translate.type";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Alert, Animated, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import WordBreakdownCard from "./wordBreakdownCard";

interface AiTranslationResultProps {
  data: TranslationData;
  targetLang: string;
  onSave?: () => void;
}

const AiTranslationResult = ({
  data,
  targetLang,
  onSave,
}: AiTranslationResultProps) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [targetSpeaking, setTargetSpeaking] = useState(false);
  const [expandedWords, setExpandedWords] = useState<Set<number>>(new Set());

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const cardBackground = getBackgroundColor(theme, "elevated");

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const handleSpeak = async (text: string, lang: string) => {
    try {
      const isSpeaking = await Speech.isSpeakingAsync();

      if (isSpeaking) {
        await Speech.stop();
        setTargetSpeaking(false);
        return;
      }

      setTargetSpeaking(true);

      await Speech.speak(text, {
        language: lang,
        onDone: () => {
          setTargetSpeaking(false);
        },
        onError: () => {
          setTargetSpeaking(false);
        },
      });
    } catch {
      Alert.alert(t("error"), t("speechError"));
      setTargetSpeaking(false);
    }
  };

  const toggleWordExpansion = (index: number) => {
    const newExpanded = new Set(expandedWords);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedWords(newExpanded);
  };

  const ActionButton = ({
    icon,
    onPress,
    color,
    isActive = false,
  }: {
    icon: string;
    onPress: () => void;
    color: string;
    isActive?: boolean;
  }) => {
    const [scaleAnim] = useState(new Animated.Value(1));

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable>
          <Icon
            source={icon}
            size={20}
            color={isActive ? color : secondaryTextColor}
          />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: DesignSystem.spacing.xl }}
    >
      {/* Main Translation Result */}
      <View
        style={{
          margin: DesignSystem.spacing.md,
          borderRadius: DesignSystem.borderRadius.lg,
          backgroundColor: cardBackground,
          ...DesignSystem.shadows[theme].sm,
        }}
      >
        {/* Header with AI Badge */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: DesignSystem.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor:
              theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: DesignSystem.spacing.sm,
              paddingHorizontal: DesignSystem.spacing.sm,
              paddingVertical: DesignSystem.spacing.xs,
              borderRadius: DesignSystem.borderRadius.md,
              backgroundColor: "rgba(139, 69, 234, 0.1)",
            }}
          >
            <Icon source="robot" size={14} color="#8B45EA" />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: "#8B45EA",
              }}
            >
              {t("aiTranslation")}
            </Text>
          </View>

          {/* Action buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: DesignSystem.spacing.sm,
            }}
          >
            <ActionButton
              icon={targetSpeaking ? "stop-circle" : "volume-high"}
              onPress={() => handleSpeak(data.translated_text, targetLang)}
              color="#4CAF50"
              isActive={targetSpeaking}
            />
            <ActionButton
              icon="content-copy"
              onPress={() => handleCopy(data.translated_text)}
              color="#FF9800"
            />
            {onSave && (
              <ActionButton icon="bookmark" onPress={onSave} color="#9C27B0" />
            )}
          </View>
        </View>

        {/* Translation Text */}
        <View style={{ padding: DesignSystem.spacing.md }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.lg,
              lineHeight: 28,
              color: textColor,
              fontWeight: DesignSystem.typography.fontWeight.medium,
            }}
            selectable
          >
            {data.translated_text}
          </Text>
        </View>
      </View>

      {/* Word Breakdown Section */}
      {data.word_breakdown && data.word_breakdown.length > 0 && (
        <View
          style={{
            margin: DesignSystem.spacing.md,
            marginTop: 0,
          }}
        >
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.lg,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: textColor,
              marginBottom: DesignSystem.spacing.md,
              paddingHorizontal: DesignSystem.spacing.sm,
            }}
          >
            {t("wordBreakdown")}
          </Text>

          {data.word_breakdown.map((word, index) => (
            <WordBreakdownCard
              key={index}
              word={word}
              isExpanded={expandedWords.has(index)}
              onToggle={() => toggleWordExpansion(index)}
              theme={theme}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default AiTranslationResult;
