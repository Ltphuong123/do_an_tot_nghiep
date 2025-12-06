import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
  getVocabStatusColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Alert, Animated, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface TranslationResultProps {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  onSave?: () => void;
}

const TranslationResult = ({
  sourceText,
  translatedText,
  sourceLang,
  targetLang,
  onSave,
}: TranslationResultProps) => {
  const { theme } = useThemeContext();
  const [targetSpeaking, setTargetSpeaking] = useState(false);

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const cardBackground = getBackgroundColor(theme, "elevated");
  const { t } = useLanguageContext();

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
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isActive
              ? `${color}30`
              : theme === "light"
              ? "rgba(0,0,0,0.05)"
              : "rgba(255,255,255,0.1)",
          }}
        >
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
    <View
      style={{
        padding: DesignSystem.spacing.md,
      }}
    >
      {/* Single Result Card for Translation */}
      <View
        style={{
          borderRadius: DesignSystem.borderRadius.lg,
          padding: DesignSystem.spacing.md,
          backgroundColor: cardBackground,
          ...DesignSystem.shadows[theme].sm,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: DesignSystem.spacing.md,
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
              backgroundColor:
                theme === "light"
                  ? "rgba(74, 144, 226, 0.1)"
                  : "rgba(74, 144, 226, 0.2)",
            }}
          >
            <Icon source="translate" size={14} color="#4A90E2" />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: "#4A90E2",
              }}
            >
              {t("translateTo") + " " + targetLang.toUpperCase()}
            </Text>
          </View>

          {/* Action buttons moved to header */}
          <View
            style={{
              flexDirection: "row",
              gap: DesignSystem.spacing.sm,
            }}
          >
            <ActionButton
              icon={targetSpeaking ? "stop-circle" : "volume-high"}
              onPress={() => handleSpeak(translatedText, targetLang)}
              color="#4CAF50"
              isActive={targetSpeaking}
            />
            <ActionButton
              icon="content-copy"
              onPress={() => handleCopy(translatedText)}
              color="#FF9800"
            />
            {onSave && (
              <ActionButton
                icon="bookmark"
                onPress={onSave}
                color={getVocabStatusColor("yêu thích")}
              />
            )}
          </View>
        </View>

        <ScrollView
          style={{ maxHeight: 200 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.lg,
              lineHeight: 28,
              color: textColor,
              fontWeight: DesignSystem.typography.fontWeight.medium,
            }}
            selectable
          >
            {translatedText}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default TranslationResult;
