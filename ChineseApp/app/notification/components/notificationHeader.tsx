import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface NotificationHeaderProps {
  title: string;
  onMarkAllAsRead?: () => void;
  showMarkAllButton?: boolean;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  title,
  onMarkAllAsRead,
  showMarkAllButton = true,
}) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const router = useRouter();
  const textColor = getTextColor(theme, "primary");

  const handleBack = () => {
    router.back();
  };

  return (
    <View
      style={{
        padding: DesignSystem.spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: getBackgroundColor(theme, "primary"),
        marginBottom: DesignSystem.spacing.md,
        ...DesignSystem.shadows[theme].md,
      }}
    >
      {/* Back Button and Title */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Pressable onPress={handleBack}>
          <Icon source="arrow-left" size={22} color={getTextColor(theme)} />
        </Pressable>

        <Text
          style={{
            fontWeight: DesignSystem.typography.fontWeight.bold,
            fontSize: DesignSystem.typography.fontSize.lg,
            color: textColor,
            marginLeft: DesignSystem.spacing.md,
          }}
        >
          {title}
        </Text>
      </View>

      {/* Mark All as Read Button */}
      {showMarkAllButton && onMarkAllAsRead && (
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: DesignSystem.spacing.sm,
            paddingVertical: DesignSystem.spacing.xs,
            backgroundColor:
              theme === "light"
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(76, 175, 80, 0.2)",
            borderRadius: DesignSystem.borderRadius.md,
          }}
          onPress={onMarkAllAsRead}
        >
          <Icon source="check-all" size={18} color="#4CAF50" />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              color: "#4CAF50",
              fontWeight: DesignSystem.typography.fontWeight.semibold,
              marginLeft: DesignSystem.spacing.xs,
            }}
          >
            {t("markAllAsRead")}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default NotificationHeader;
