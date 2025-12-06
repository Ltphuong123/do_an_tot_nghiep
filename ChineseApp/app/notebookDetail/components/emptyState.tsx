import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  const { t } = useLanguageContext();
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: DesignSystem.spacing.md,
      }}
    >
      <CardCustom
        variant="cardElevated"
        padding="xl"
        style={{
          borderRadius: DesignSystem.borderRadius.xxl,
          alignItems: "center",
          gap: DesignSystem.spacing.md,
        }}
      >
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
              theme === "light"
                ? "rgba(74, 144, 226, 0.1)"
                : "rgba(74, 144, 226, 0.2)",
          }}
        >
          <Icon source="book-outline" size={64} color="#4A90E2" />
        </View>
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.lg,
            fontWeight: DesignSystem.typography.fontWeight.semibold,
            color: textColor,
            textAlign: "center",
          }}
        >
          {message || t("emptyNotebookMsg")}
        </Text>
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            color: secondaryTextColor,
            textAlign: "center",
          }}
        >
          {t("addVocabToNotebook")}
        </Text>
      </CardCustom>
    </View>
  );
};

export default EmptyState;
