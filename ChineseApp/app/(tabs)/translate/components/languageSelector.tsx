import {
  DesignSystem,
  getSolidColor,
  getTextColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import React, { useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  sourceLanguage: Language;
  targetLanguage: Language;
  onSwapPress: () => void;
  isKeyboardOpen?: boolean;
}

const LanguageSelector = ({
  sourceLanguage,
  targetLanguage,
  onSwapPress,
  isKeyboardOpen = false,
}: LanguageSelectorProps) => {
  const { theme } = useThemeContext();
  const [swapRotation] = useState(new Animated.Value(0));

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const cardBackground = getSolidColor(theme, "card");

  const handleSwap = () => {
    Animated.sequence([
      Animated.timing(swapRotation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(swapRotation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
    onSwapPress();
  };

  const rotateInterpolate = swapRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const LanguageButton = ({ language }: { language: Language }) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: cardBackground,
          paddingVertical: DesignSystem.spacing.sm,
          paddingHorizontal: DesignSystem.spacing.sm,
          borderRadius: DesignSystem.borderRadius.md,
          gap: DesignSystem.spacing.sm,
          ...DesignSystem.shadows[theme].sm,
        }}
      >
        <Text style={{ fontSize: 24 }}>{language.flag}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.base,
              fontWeight: DesignSystem.typography.fontWeight.semibold,
              color: textColor,
            }}
            numberOfLines={1}
          >
            {language.name}
          </Text>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.xs,
              color: secondaryTextColor,
              marginTop: 2,
            }}
          >
            {language.code.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: DesignSystem.spacing.md,
        backgroundColor: isKeyboardOpen ? "transparent" : undefined,
        paddingVertical: isKeyboardOpen
          ? DesignSystem.spacing.sm
          : DesignSystem.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: DesignSystem.spacing.md,
        }}
      >
        <LanguageButton language={sourceLanguage} />

        <Pressable
          onPress={handleSwap}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Icon
              source="swap-horizontal"
              size={24}
              color={getTextColor(theme, "primary")}
            />
          </Animated.View>
        </Pressable>

        <LanguageButton language={targetLanguage} />
      </View>
    </View>
  );
};

export default LanguageSelector;
