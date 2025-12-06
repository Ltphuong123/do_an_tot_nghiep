import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.05)",
      }}
    >
      <Text style={{ fontSize: 14, color: secondaryTextColor }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: "600", color: textColor }}>
        {value}
      </Text>
    </View>
  );
};

interface VocabDetailsCardProps {
  wordTypes?: string[];
  levels?: string[];
  status: string;
  notes?: string;
}

export const VocabDetailsCard: React.FC<VocabDetailsCardProps> = ({
  wordTypes,
  levels,
  status,
  notes,
}) => {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  return (
    <CardCustom
      variant="card"
      padding="md"
      style={{
        borderRadius: DesignSystem.borderRadius.lg,
        marginBottom: DesignSystem.spacing.xl,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
          marginBottom: DesignSystem.spacing.md,
        }}
      >
        {t("notebookDetailsTitle")}
      </Text>

      <InfoRow
        label={t("wordType")}
        value={wordTypes ? wordTypes.join(", ") : "Chưa phân loại"}
      />
      <InfoRow
        label={t("level")}
        value={levels ? levels.join(", ") : "Chưa phân cấp"}
      />
      <InfoRow
        label={t("status")}
        value={status.charAt(0).toUpperCase() + status.slice(1)}
      />

      {notes && (
        <View style={{ marginTop: 12, paddingTop: 12 }}>
          <Text style={{ fontSize: 14, color: secondaryTextColor }}>
            {t("note")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              marginTop: 8,
              color: textColor,
            }}
          >
            {notes}
          </Text>
        </View>
      )}
    </CardCustom>
  );
};
