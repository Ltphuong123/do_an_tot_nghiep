import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface NotebookCardProps {
  id: string;
  name: string;
  wordCount: number;
  isPremium?: boolean;
  isLocked?: boolean;
  isDeleteIcon?: boolean;
  onPress: () => void;
  onDelete: () => void;
}

const NotebookCard: React.FC<NotebookCardProps> = ({
  name,
  wordCount,
  isPremium = false,
  isLocked = false,
  isDeleteIcon = false,
  onPress,
  onDelete,
}) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();

  const getIconName = () => {
    if (isLocked) return "lock";
    if (isPremium) return "star";
    return "notebook";
  };

  const getIconColor = () => {
    if (isLocked) return "#9E9E9E";
    if (isPremium) return "#FFD700";
    return "#4A90E2";
  };

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  return (
    <Pressable
      style={{
        width: 300,
        marginRight: DesignSystem.spacing.sm,
        opacity: isLocked ? 0.6 : 1,
      }}
      onPress={onPress}
      disabled={isLocked}
    >
      <CardCustom
        variant="card"
        padding="md"
        style={{
          borderRadius: DesignSystem.borderRadius.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: DesignSystem.spacing.md,
            gap: DesignSystem.spacing.sm,
          }}
        >
          <Icon
            source={getIconName() as any}
            size={24}
            color={getIconColor()}
          />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              fontWeight: DesignSystem.typography.fontWeight.semibold,
              color: textColor,
            }}
            numberOfLines={2}
          >
            {name}
          </Text>
          {isDeleteIcon && (
            <View style={{ marginLeft: "auto" }}>
              <Pressable onPress={onDelete}>
                <Icon source="delete" size={20} color="#D32F2F" />
              </Pressable>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 4,
            gap: DesignSystem.spacing.sm,
          }}
        >
          <Icon source="text-box" size={14} color={secondaryTextColor} />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.xs,
              color: secondaryTextColor,
            }}
          >
            {wordCount} {t("words")}{" "}
          </Text>
        </View>

        {isPremium && !isLocked && (
          <View
            style={{
              position: "absolute",
              top: DesignSystem.spacing.xs,
              right: DesignSystem.spacing.xs,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "rgba(255, 215, 0, 0.15)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon source="crown" size={12} color="#FFD700" />
          </View>
        )}
      </CardCustom>
    </Pressable>
  );
};

export default NotebookCard;
