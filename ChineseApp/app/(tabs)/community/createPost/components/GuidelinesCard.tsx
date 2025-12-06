import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import React from "react";
import { Icon, Text } from "react-native-paper";

type Props = {
  theme: "light" | "dark";
};

const GuidelinesCard: React.FC<Props> = ({ theme }) => {
  const textColor = getTextColor(theme, "primary");
  const { t } = useLanguageContext();

  return (
    <CardCustom
      variant="card"
      padding="sm"
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: DesignSystem.spacing.sm,
        backgroundColor:
          theme === "light"
            ? "rgba(74, 144, 226, 0.1)"
            : "rgba(74, 144, 226, 0.2)",
      }}
    >
      <Icon source="information" size={20} color="#4A90E2" />
      <Text
        style={{
          flex: 1,
          fontSize: DesignSystem.typography.fontSize.sm,
          lineHeight: 18,
          color: textColor,
        }}
      >
        {t("guidelinesPost")}
      </Text>
    </CardCustom>
  );
};

export default GuidelinesCard;
