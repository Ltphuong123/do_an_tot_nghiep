import { LeaderboardIcon } from "@/components/icon/TrophyIcon";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface MockTestHeaderProps {
  onLeaderboardPress: () => void;
  onHistoryPress: () => void;
  onDownloadedPress: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function MockTestHeader({
  onLeaderboardPress,
  onHistoryPress,
  onDownloadedPress,
  onRefresh,
  isRefreshing,
}: MockTestHeaderProps) {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: DesignSystem.spacing.md,
        gap: DesignSystem.spacing.md,
        backgroundColor: getBackgroundColor(theme, "primary"),
        ...DesignSystem.shadows[theme].md,
      }}
    >
      {/* Leaderboard */}
      <Pressable
        style={{
          padding: DesignSystem.spacing.sm,
          borderRadius: 19,
          alignItems: "center",
          flexDirection: "row",
          gap: DesignSystem.spacing.sm,
        }}
        onPress={onLeaderboardPress}
      >
        <LeaderboardIcon size={20} theme={theme} />
        <Text>{t("leaderboard")}</Text>
      </Pressable>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.sm,
        }}
      >
        {/* Refresh */}
        <Pressable onPress={onRefresh} disabled={isRefreshing}>
          <Icon
            source={isRefreshing ? "loading" : "refresh"}
            size={22}
            // color="#4CAF50"
            color={getTextColor(theme, "primary")}
          />
        </Pressable>

        {/* Downloaded */}
        <Pressable onPress={onDownloadedPress}>
          <Icon
            source="download-outline"
            size={22}
            color={getTextColor(theme, "primary")}
          />
        </Pressable>
      </View>
    </View>
  );
}
