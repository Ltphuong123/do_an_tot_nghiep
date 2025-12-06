import { InputCustom } from "@/components/shared/inputCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface NotebookHeaderProps {
  currentView: "notebook" | "ai-lesson";
  onViewChange: (view: "notebook" | "ai-lesson") => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onSync?: () => void;
  isSyncing?: boolean;
}

const NotebookHeader: React.FC<NotebookHeaderProps> = ({
  currentView,
  onViewChange,
  onSearch,
  searchQuery = "",
  onRefresh,
  isRefreshing = false,
  onSync,
  isSyncing = false,
}) => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchToggle = () => {
    if (isSearchVisible) {
      // Exiting search mode - reset everything
      setLocalSearchQuery("");
      onSearch?.("");
    }
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <View
      style={{
        padding: DesignSystem.spacing.md,
        backgroundColor: getBackgroundColor(theme, "primary"),
        ...DesignSystem.shadows[theme].xl,
      }}
    >
      {isSearchVisible ? (
        /* Full Search Mode */
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: DesignSystem.spacing.md,
          }}
        >
          <View style={{ flex: 1 }}>
            <InputCustom
              value={localSearchQuery}
              onChangeText={handleSearchChange}
              placeholder={t("searchNotebooks")}
              leftIcon={
                <Icon
                  source="magnify"
                  size={20}
                  color={getTextColor(theme, "secondary")}
                />
              }
              rightIcon={
                localSearchQuery ? (
                  <Pressable
                    onPress={() => {
                      setLocalSearchQuery("");
                      onSearch?.("");
                    }}
                  >
                    <Icon
                      source="close"
                      size={18}
                      color={getTextColor(theme, "secondary")}
                    />
                  </Pressable>
                ) : null
              }
            />
          </View>
          <Pressable onPress={handleSearchToggle}>
            <Icon source="close" size={20} color={textColor} />
          </Pressable>
        </View>
      ) : (
        /* Normal Mode - Pills + Search Button */
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left-aligned Compact Toggle Pills */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor:
                theme === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              borderRadius: 25,
              padding: 3,
              gap: 2,
            }}
          >
            <Pressable
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                minWidth: 80,
              }}
              onPress={() => onViewChange("notebook")}
            >
              {currentView === "notebook" ? (
                <LinearGradient
                  colors={["#4A90E2", "#357ABD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 20,
                  }}
                />
              ) : null}
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: currentView === "notebook" ? "#FFFFFF" : textColor,
                  fontWeight:
                    currentView === "notebook"
                      ? DesignSystem.typography.fontWeight.semibold
                      : DesignSystem.typography.fontWeight.medium,
                }}
              >
                {t("noteOrAi")}
              </Text>
            </Pressable>

            <Pressable
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                minWidth: 80,
              }}
              onPress={() => onViewChange("ai-lesson")}
            >
              {currentView === "ai-lesson" ? (
                <LinearGradient
                  colors={["#4A90E2", "#357ABD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 20,
                  }}
                />
              ) : null}
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: currentView === "ai-lesson" ? "#FFFFFF" : textColor,
                  fontWeight:
                    currentView === "ai-lesson"
                      ? DesignSystem.typography.fontWeight.semibold
                      : DesignSystem.typography.fontWeight.medium,
                }}
              >
                {t("aiLesson")}
              </Text>
            </Pressable>
          </View>

          {/* Search and Sync Buttons */}
          {currentView === "notebook" ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.sm,
              }}
            >
              <Pressable onPress={onSync} disabled={isSyncing}>
                <Icon
                  source={isSyncing ? "loading" : "sync"}
                  size={20}
                  color={textColor}
                />
              </Pressable>
              <Pressable onPress={handleSearchToggle}>
                <Icon source="magnify" size={20} color={textColor} />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/noteOrAi/historyAiLesson" as any,
                })
              }
            >
              <Icon source="history" size={20} color={textColor} />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

export default NotebookHeader;
