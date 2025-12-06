import { CardCustom } from "@/components/shared/cardCustom";
import {
  DesignSystem,
  getTextColor,
  getVocabStatusColor,
  getVocabStatusColorWithOpacity,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { INoteBookVocabItem } from "@/types/notebook.type";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import { Alert, Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface VocabCardProps {
  item: INoteBookVocabItem;
  onPress: (item: INoteBookVocabItem) => void;
}

const VocabCard = ({ item, onPress }: VocabCardProps) => {
  const { t } = useLanguageContext();
  const { theme } = useThemeContext();
  const [speaking, setSpeaking] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  const handleSpeak = async (e: any) => {
    e.stopPropagation();
    try {
      const isSpeaking = await Speech.isSpeakingAsync();

      if (isSpeaking) {
        await Speech.stop();
        setSpeaking(false);
        return;
      }

      setSpeaking(true);
      await Speech.speak(item.hanzi, {
        language: "zh-CN",
        onDone: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    } catch {
      Alert.alert(t("soundError"), t("cannotPlayAudio"));
      setSpeaking(false);
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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

  const getStatusColor = (status: string) => {
    return getVocabStatusColor(status);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={() => onPress(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          marginHorizontal: DesignSystem.spacing.md,
          marginBottom: DesignSystem.spacing.sm,
        }}
      >
        <CardCustom
          variant="card"
          padding="md"
          style={{
            borderRadius: DesignSystem.borderRadius.lg,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: DesignSystem.spacing.sm,
            }}
          >
            <View style={{ flex: 1, marginRight: DesignSystem.spacing.sm }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: textColor,
                  marginBottom: 4,
                }}
                numberOfLines={1}
              >
                {item.hanzi}
              </Text>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                  marginBottom: 6,
                }}
                numberOfLines={1}
              >
                {item.pinyin}
              </Text>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.base,
                  color: textColor,
                  lineHeight:
                    DesignSystem.typography.fontSize.base *
                    DesignSystem.typography.lineHeight.normal,
                }}
                numberOfLines={2}
              >
                {item.meaning}
              </Text>
            </View>

            <Pressable
              onPress={handleSpeak}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: speaking
                  ? "rgba(76, 175, 80, 0.2)"
                  : theme === "light"
                  ? "rgba(74, 144, 226, 0.1)"
                  : "rgba(74, 144, 226, 0.2)",
              }}
            >
              <Icon
                source={speaking ? "stop-circle" : "volume-high"}
                size={24}
                color={speaking ? "#4CAF50" : "#4A90E2"}
              />
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: DesignSystem.spacing.sm,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: DesignSystem.spacing.sm,
                paddingVertical: 6,
                borderRadius: DesignSystem.borderRadius.md,
                backgroundColor: getVocabStatusColorWithOpacity(item.status),
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: getStatusColor(item.status),
                }}
              />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xs,
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                  color: getStatusColor(item.status),
                }}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: DesignSystem.borderRadius.md,
                backgroundColor:
                  theme === "light"
                    ? "rgba(156, 39, 176, 0.1)"
                    : "rgba(156, 39, 176, 0.2)",
              }}
            >
              <Icon source="school" size={12} color="#9C27B0" />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                  color: "#9C27B0",
                }}
              >
                {item.level}
              </Text>
            </View>
          </View>
        </CardCustom>
      </Pressable>
    </Animated.View>
  );
};

export default VocabCard;
