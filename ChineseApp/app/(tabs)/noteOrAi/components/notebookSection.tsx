import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { INoteBook } from "@/types/notebook.type";
import { IUser } from "@/types/user.type";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import NotebookCard from "./notebookCard";

interface NotebookSectionProps {
  title: string;
  notebooks: INoteBook[];
  onSeeAll?: boolean;
  onNotebookPress: (notebook: INoteBook) => void;
  onCreateNew?: () => void;
  showCreateButton?: boolean;
  onConfirmDelete?: (notebookId: string) => void;
  user?: IUser;
  iconDelete?: boolean;
  isLoading?: boolean;
}

const NotebookSection = ({
  title,
  notebooks,
  onSeeAll,
  onNotebookPress,
  onCreateNew,
  showCreateButton = false,
  onConfirmDelete,
  user,
  iconDelete = false,
  isLoading = false,
}: NotebookSectionProps) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();

  const getTitleIcon = () => {
    if (title === t("personalSection")) return "account";
    if (title === t("freeSection")) return "gift";
    if (title === t("premiumSection")) return "crown";
    return "notebook";
  };

  const getTitleColor = () => {
    if (title === t("personalSection")) return "#4A90E2";
    if (title === t("freeSection")) return "#4CAF50";
    if (title === t("premiumSection")) return "#FFD700";
    return "#4A90E2";
  };

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  return (
    <View style={{ marginVertical: DesignSystem.spacing.sm }}>
      {/* Section Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: DesignSystem.spacing.md,
          marginBottom: DesignSystem.spacing.sm,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.sm,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                theme === "light"
                  ? `${getTitleColor()}15`
                  : `${getTitleColor()}25`,
            }}
          >
            <Icon
              source={getTitleIcon() as any}
              size={18}
              color={getTitleColor()}
            />
          </View>
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.lg,
              fontWeight: DesignSystem.typography.fontWeight.bold,
              color: textColor,
            }}
          >
            {title}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.sm,
          }}
        >
          {showCreateButton && onCreateNew && (
            <Pressable
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor:
                  theme === "light"
                    ? "rgba(74, 144, 226, 0.1)"
                    : "rgba(74, 144, 226, 0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={onCreateNew}
            >
              <Icon source="plus" size={18} color="#4A90E2" />
            </Pressable>
          )}

          {onSeeAll && notebooks.length > 0 && (
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: DesignSystem.spacing.sm,
                paddingVertical: 6,
                borderRadius: DesignSystem.spacing.md,
                backgroundColor:
                  theme === "light"
                    ? "rgba(74, 144, 226, 0.1)"
                    : "rgba(74, 144, 226, 0.2)",
              }}
              onPress={() => {
                router.push({
                  pathname: "/noteOrAi/seeAllNoteBook" as any,
                  params: {
                    title: title,
                  },
                });
              }}
            >
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xs,
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                  color: "#4A90E2",
                }}
              >
                {t("seeAllNotebooks")}
              </Text>
              <Icon source="chevron-right" size={16} color="#4A90E2" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Notebooks List */}
      {isLoading ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 40,
            paddingHorizontal: DesignSystem.spacing.md,
          }}
        >
          <ActivityIndicator size="large" />
          <Text
            style={{
              color: textColor,
              marginTop: 8,
              fontSize: DesignSystem.typography.fontSize.sm,
            }}
          >
            {t("loadingNotebooks")}
          </Text>
        </View>
      ) : notebooks.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: DesignSystem.spacing.md,
            paddingVertical: 4,
          }}
        >
          {notebooks.map((notebook) => (
            <NotebookCard
              key={notebook.id}
              id={notebook.id}
              name={notebook.name}
              wordCount={notebook.vocab_count}
              isPremium={notebook.is_premium}
              isLocked={
                notebook.is_premium &&
                user?.subscription.name === "Gói Mặc Định"
              }
              isDeleteIcon={iconDelete}
              onPress={() => onNotebookPress(notebook)}
              onDelete={() =>
                onConfirmDelete ? onConfirmDelete(notebook.id) : undefined
              }
            />
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 40,
            gap: DesignSystem.spacing.sm,
          }}
        >
          <Icon
            source="notebook-outline"
            size={40}
            color={secondaryTextColor}
          />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.sm,
              color: secondaryTextColor,
            }}
          >
            {showCreateButton ? t("noNotebooksCreate") : t("noNotebooks")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default NotebookSection;
