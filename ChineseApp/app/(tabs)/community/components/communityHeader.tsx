import { LeaderboardIcon } from "@/components/icon/TrophyIcon";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useUnreadNotificationCount } from "@/hooks/useNotification";
import { INotification } from "@/types/notification.type";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface CommunityHeaderProps {
  onLeaderboardPress: () => void;
  onNotificationPress?: (notification: INotification) => void;
  onFilterPress: () => void;
  onSearchPress: () => void;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  onLeaderboardPress,
  onNotificationPress,
  onFilterPress,
  onSearchPress,
}) => {
  const { theme } = useThemeContext();
  const router = useRouter();
  const textColor = getTextColor(theme, "primary");
  const { t } = useLanguageContext();

  const { data } = useUnreadNotificationCount();
  const unreadCount = data?.data.count || 0;
  // const unreadCount = 3;
  console.log("Unread notification count:", unreadCount);

  const handleNotificationPress = () => {
    router.push("/notification" as any);
  };

  const iconColor = theme === "dark" ? "#E5E7EB" : "#374151";

  return (
    <View
      style={{
        padding: DesignSystem.spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: getBackgroundColor(theme, "primary"),
        ...DesignSystem.shadows[theme].sm,
      }}
    >
      {/* Leaderboard Button */}
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
        onPress={onLeaderboardPress}
      >
        <LeaderboardIcon size={20} theme={theme} />
        <Text
          style={{
            fontWeight: DesignSystem.typography.fontWeight.bold,
            fontSize: DesignSystem.typography.fontSize.base,
            color: textColor,
          }}
        >
          {t("leaderboard")}
        </Text>
      </Pressable>

      {/* Right Icons Group */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {/* Search Icon */}
        <Pressable
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={onSearchPress}
        >
          <Icon source="magnify" size={22} color={iconColor} />
        </Pressable>

        {/* Filter Icon */}
        <Pressable
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={onFilterPress}
        >
          <Icon source="filter-variant" size={22} color={iconColor} />
        </Pressable>

        {/* Notification Icon with Badge */}
        <Pressable
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          onPress={handleNotificationPress}
        >
          <Icon source="bell-outline" size={22} color={iconColor} />
          {unreadCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "#ef4444",
                borderRadius: 8,
                minWidth: 16,
                height: 16,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontWeight: "700",
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default CommunityHeader;
