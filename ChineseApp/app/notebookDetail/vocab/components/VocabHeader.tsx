import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface VocabHeaderProps {
  onDelete?: () => void;
  deleteDisable: boolean;
}

export const VocabHeader: React.FC<VocabHeaderProps> = ({
  onDelete,
  deleteDisable,
}) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View
      style={{
        padding: DesignSystem.spacing.md,
        flexDirection: "row",
        alignItems: "center",
        gap: DesignSystem.spacing.sm,
        ...DesignSystem.shadows[theme].md,
        backgroundColor: getBackgroundColor(theme, "primary"),
      }}
    >
      <Pressable onPress={handleGoBack}>
        <Icon
          source="arrow-left"
          size={24}
          color={theme === "light" ? "#000" : "#FFF"}
        />
      </Pressable>

      <Text
        style={{
          flex: 1,
          fontSize: DesignSystem.typography.fontSize.xl,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
        }}
      >
        {t("vocabDetails")}
      </Text>

      {onDelete && !deleteDisable && (
        <Pressable onPress={onDelete}>
          <Icon source="delete" size={25} color="#D32F2F" />
        </Pressable>
      )}
    </View>
  );
};
