import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

export interface ILeaderboardUser {
  user_id: string;
  user_name: string;
  user_avatar: string;
  user_level: string;
  max_score: string;
  badge_level: number;
  badge_name: string;
  badge_icon: string;
  badge_min_points: number;
}

interface LeaderboardListProps {
  data: ILeaderboardUser[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function LeaderboardList({
  data,
  loading,
  refreshing,
  onRefresh,
}: LeaderboardListProps) {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();

  if (loading) {
    return (
      <View
        style={{
          padding: DesignSystem.spacing.xl,
          alignItems: "center",
        }}
      >
        <ActivityIndicator animating size={36} color="#4A90E2" />
        <Text
          style={{
            color: getTextColor(theme, "secondary"),
            marginTop: DesignSystem.spacing.sm,
            fontSize: DesignSystem.typography.fontSize.sm,
          }}
        >
          {t("loadingLeaderboard")}{" "}
        </Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View
        style={{
          padding: DesignSystem.spacing.xl,
          alignItems: "center",
        }}
      >
        <Icon
          source="trophy-outline"
          size={96}
          color={getTextColor(theme, "secondary")}
        />
        <Text
          style={{
            color: getTextColor(theme, "primary"),
            marginTop: DesignSystem.spacing.md,
            fontWeight: DesignSystem.typography.fontWeight.semibold,
            fontSize: DesignSystem.typography.fontSize.md,
          }}
        >
          {t("noData")}
        </Text>
        <Text
          style={{
            color: getTextColor(theme, "secondary"),
            marginTop: DesignSystem.spacing.xs,
            fontSize: DesignSystem.typography.fontSize.sm,
            textAlign: "center",
          }}
        >
          {t("selectTestForLeaderboard")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#4A90E2"
        />
      }
      contentContainerStyle={{ paddingBottom: DesignSystem.spacing.lg }}
    >
      {data.map((user, index) => {
        const rank = index + 1;

        return (
          <LinearGradient
            key={user.user_id}
            colors={
              theme === "dark"
                ? [
                    "rgba(147, 51, 234, 0.2)",
                    "rgba(59, 130, 246, 0.15)",
                    "rgba(16, 185, 129, 0.1)",
                  ]
                : [
                    "rgba(236, 72, 153, 0.12)",
                    "rgba(59, 130, 246, 0.1)",
                    "rgba(245, 158, 11, 0.08)",
                  ]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: DesignSystem.spacing.md,
              paddingHorizontal: DesignSystem.spacing.md,
              borderRadius: DesignSystem.borderRadius.xxl,
              marginBottom: DesignSystem.spacing.sm,
            }}
          >
            {/* Rank Number */}
            <View
              style={{
                width: 32,
                height: 32,
                justifyContent: "center",
                alignItems: "center",
                marginRight: DesignSystem.spacing.md,
                borderRadius: 16,
                backgroundColor:
                  rank <= 3
                    ? rank === 1
                      ? "#FFD700"
                      : rank === 2
                      ? "#C0C0C0"
                      : "#CD7F32"
                    : theme === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
              }}
            >
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: rank <= 3 ? "#fff" : getTextColor(theme, "primary"),
                }}
              >
                {rank}
              </Text>
            </View>

            {/* User Info */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginRight: DesignSystem.spacing.md,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: getTextColor(theme, "primary"),
                    fontSize: DesignSystem.typography.fontSize.base,
                    fontWeight: DesignSystem.typography.fontWeight.bold,
                    marginBottom: 2,
                  }}
                >
                  {user.user_name}
                </Text>

                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.xs,
                    fontWeight: DesignSystem.typography.fontWeight.medium,
                    color: "#F59E0B",
                  }}
                >
                  {parseFloat(user.max_score).toFixed(1)}
                </Text>
              </View>

              {/* Avatar */}
              <Image
                source={{
                  uri:
                    user.user_avatar ||
                    "https://i.pravatar.cc/150?img=" + (index + 1),
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: getBackgroundColor(theme, "secondary"),
                }}
              />
            </View>
          </LinearGradient>
        );
      })}
    </ScrollView>
  );
}
