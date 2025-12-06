import { DesignSystem } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import React, { useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface TranslateButtonsProps {
  onTranslate: () => void;
  onAITranslate: () => void;
  isLoading?: boolean;
}

const TranslateButtons = ({
  onTranslate,
  onAITranslate,
  isLoading = false,
}: TranslateButtonsProps) => {
  const [normalScale] = useState(new Animated.Value(1));
  const [aiScale] = useState(new Animated.Value(1));
  const { t } = useLanguageContext();

  const TranslateButton = ({
    label,
    icon,
    onPress,
    color,
    isAI = false,
    scaleAnim,
  }: {
    label: string;
    icon: string;
    onPress: () => void;
    color: string;
    isAI?: boolean;
    scaleAnim: Animated.Value;
  }) => {
    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
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
      <Animated.View
        style={{
          flex: 1,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLoading}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: DesignSystem.spacing.sm,
            paddingVertical: DesignSystem.spacing.md,
            paddingHorizontal: DesignSystem.spacing.lg,
            borderRadius: DesignSystem.borderRadius.md,
            backgroundColor: color,
            opacity: isLoading ? 0.6 : 1,
            ...DesignSystem.shadows.light.md,
          }}
        >
          <Icon source={icon as any} size={20} color="#FFFFFF" />
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: DesignSystem.typography.fontSize.base,
              fontWeight: DesignSystem.typography.fontWeight.semibold,
            }}
          >
            {label}
          </Text>
          {isAI && (
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                paddingHorizontal: DesignSystem.spacing.sm,
                paddingVertical: 2,
                borderRadius: DesignSystem.borderRadius.sm,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: DesignSystem.typography.fontSize.xs,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                }}
              >
                {t("ai")}
              </Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: DesignSystem.spacing.md,
        gap: DesignSystem.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: DesignSystem.spacing.md,
        }}
      >
        <TranslateButton
          label={t("translate")}
          icon="translate"
          onPress={onTranslate}
          color="#4A90E2"
          scaleAnim={normalScale}
        />

        <TranslateButton
          label={t("translate") + " " + t("ai")}
          icon="robot"
          onPress={onAITranslate}
          color="#9C27B0"
          isAI={true}
          scaleAnim={aiScale}
        />
      </View>
    </View>
  );
};

export default TranslateButtons;
