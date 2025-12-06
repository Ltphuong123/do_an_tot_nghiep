import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface Props {
  title?: string;
  subtitle?: string;
}

export default function EmptyState({ title, subtitle }: Props) {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  const displayTitle = title || t("noNotebooks");
  const displaySubtitle = subtitle || t("noNotebooksInCategory");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: DesignSystem.spacing.md,
        paddingHorizontal: DesignSystem.spacing.xxxl,
      }}
    >
      <Icon source="notebook-outline" size={64} color={secondaryTextColor} />
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.xl,
          fontWeight: DesignSystem.typography.fontWeight.semibold,
          textAlign: "center",
          color: textColor,
        }}
      >
        {displayTitle}
      </Text>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.md,
          textAlign: "center",
          lineHeight:
            DesignSystem.typography.lineHeight.relaxed *
            DesignSystem.typography.fontSize.md,
          color: secondaryTextColor,
        }}
      >
        {displaySubtitle}
      </Text>
    </View>
  );
}
