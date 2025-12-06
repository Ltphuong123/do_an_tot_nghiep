import React from "react";
import { View } from "react-native";

import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { Icon, Text } from "react-native-paper";

interface EmptyStateProps {
  theme: "light" | "dark";
  level: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ theme, level }) => {
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 80,
      }}
    >
      <CardCustom
        variant="cardElevated"
        padding="lg"
        style={{
          borderRadius: 60,
          marginBottom: DesignSystem.spacing.md,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon source="lightbulb-on-outline" size={48} color="#4A90E2" />
      </CardCustom>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          marginBottom: DesignSystem.spacing.sm,
          color: textColor,
          textAlign: "center",
        }}
      >
        {t("noTipsFound")}
      </Text>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.md,
          color: secondaryTextColor,
          textAlign: "center",
          lineHeight: 20,
          maxWidth: 280,
        }}
      >
        {`${t("noTipsForLevel")
          .split(" ")
          .slice(0, -1)
          .join(" ")} ${level}. ${t("noTipsForLevel")
          .split(" ")
          .slice(-2)
          .join(" ")}`}
      </Text>
    </View>
  );
};

export default EmptyState;
