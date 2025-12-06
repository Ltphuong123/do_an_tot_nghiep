import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { IUser } from "@/types/user.type";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import InfoRow from "./infoRow";

interface ContactInfoCardProps {
  profile: IUser;
  theme: "light" | "dark";
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  profile,
  theme,
}) => {
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");

  return (
    <CardCustom
      variant="card"
      padding="lg"
      style={{
        borderRadius: DesignSystem.borderRadius.xl,
        marginBottom: DesignSystem.spacing.lg,
      }}
    >
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
          marginBottom: DesignSystem.spacing.md,
        }}
      >
        {t("contactInfo")}
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor:
            theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      <InfoRow
        icon="email"
        label={t("email")}
        value={profile.email || t("notLinked")}
        iconColor="#4A90E2"
        theme={theme}
      />

      <View
        style={{
          height: 1,
          backgroundColor:
            theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      <InfoRow
        icon="crown"
        label={t("version")}
        value={profile.subscription.name || t("free")}
        iconColor="#FFD700"
        theme={theme}
      />

      <View
        style={{
          height: 1,
          backgroundColor:
            theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          marginVertical: DesignSystem.spacing.md,
        }}
      />

      <InfoRow
        icon="identifier"
        label={t("id")}
        value={profile.id}
        iconColor="#9C27B0"
        theme={theme}
      />

      <View
        style={{
          height: 1,
          backgroundColor:
            theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
          marginVertical: DesignSystem.spacing.md,
        }}
      />
    </CardCustom>
  );
};

export default ContactInfoCard;
