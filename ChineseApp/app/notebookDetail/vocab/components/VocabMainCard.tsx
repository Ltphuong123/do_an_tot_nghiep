import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Alert, Pressable } from "react-native";
import { Icon, Text } from "react-native-paper";

interface VocabMainCardProps {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export const VocabMainCard: React.FC<VocabMainCardProps> = ({
  hanzi,
  pinyin,
  meaning,
}) => {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const [speaking, setSpeaking] = useState(false);
  const { t } = useLanguageContext();

  const handleSpeak = async () => {
    try {
      const isSpeaking = await Speech.isSpeakingAsync();

      if (isSpeaking) {
        await Speech.stop();
        setSpeaking(false);
        return;
      }

      setSpeaking(true);
      await Speech.speak(hanzi, {
        language: "zh-CN",
        onDone: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    } catch {
      Alert.alert("Lỗi", "Không thể phát âm thanh");
      setSpeaking(false);
    }
  };

  return (
    <CardCustom
      variant="card"
      padding="lg"
      style={{
        borderRadius: DesignSystem.borderRadius.xl,
        alignItems: "center",
        marginBottom: DesignSystem.spacing.md,
      }}
    >
      <Text
        style={{
          fontSize: 48,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
          marginBottom: 8,
        }}
      >
        {hanzi}{" "}
      </Text>
      <Text
        style={{
          fontSize: 18,
          color: "#4A90E2",
          marginBottom: 12,
        }}
      >
        {pinyin}{" "}
      </Text>
      <Text
        style={{
          fontSize: 20,
          color: textColor,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        {meaning}{" "}
      </Text>

      <Pressable
        onPress={handleSpeak}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 24,
          backgroundColor: speaking
            ? "rgba(76, 175, 80, 0.2)"
            : "rgba(74, 144, 226, 0.2)",
        }}
      >
        <Icon
          source={speaking ? "stop-circle" : "volume-high"}
          size={28}
          color={speaking ? "#4CAF50" : "#4A90E2"}
        />
      </Pressable>
    </CardCustom>
  );
};
