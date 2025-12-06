import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { INoteBook } from "@/types/notebook.type";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface NotebookListItemProps {
  notebook: INoteBook;
  onPress: (notebook: INoteBook) => void;
  isDeleteIcon?: boolean;
  onDeletePress?: (notebookId: string) => void;
}

export default function NotebookListItem({
  notebook,
  onPress,
  isDeleteIcon,
  onDeletePress,
}: NotebookListItemProps) {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();

  const getIconName = () => {
    if (notebook.is_premium) return "crown";
    if (notebook.user_id) return "account";
    return "gift";
  };

  const getIconColor = () => {
    if (notebook.is_premium) return "#FFD700";
    if (notebook.user_id) return "#4A90E2";
    return "#4CAF50";
  };

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  return (
    <Pressable
      style={{ marginBottom: DesignSystem.spacing.xs }}
      onPress={() => onPress(notebook)}
    >
      <CardCustom
        variant="card"
        padding="md"
        style={{
          borderRadius: DesignSystem.borderRadius.md,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: "center",
            alignItems: "center",
            marginRight: DesignSystem.spacing.md,
            backgroundColor:
              theme === "light" ? `${getIconColor()}15` : `${getIconColor()}25`,
          }}
        >
          <Icon source={getIconName()} size={24} color={getIconColor()} />
        </View>

        <View
          style={{
            flex: 1,
            gap: DesignSystem.spacing.xs,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: DesignSystem.spacing.sm,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: DesignSystem.typography.fontSize.md,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
                color: textColor,
                lineHeight:
                  DesignSystem.typography.lineHeight.normal *
                  DesignSystem.typography.fontSize.md,
              }}
              numberOfLines={2}
            >
              {notebook.name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: DesignSystem.spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon source="text-box" size={16} color={secondaryTextColor} />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                }}
              >
                {notebook.vocab_count} {t("vocabularyCount")}
              </Text>
            </View>

            {notebook.created_at && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icon source="calendar" size={16} color={secondaryTextColor} />
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.sm,
                    color: secondaryTextColor,
                  }}
                >
                  {new Date(notebook.created_at).toLocaleDateString("vi-VN")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {isDeleteIcon ? (
          <Pressable onPress={() => onDeletePress?.(notebook.id)}>
            <Icon source="delete" size={20} color="#D32F2F" />
          </Pressable>
        ) : null}
      </CardCustom>
    </Pressable>
  );
}
