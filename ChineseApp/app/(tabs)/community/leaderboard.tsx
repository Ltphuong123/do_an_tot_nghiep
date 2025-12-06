import AvatarCustom from "@/components/shared/avatarCustom";
import { ContainerCustom } from "@/components/shared/containerCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { getCommunityLeaderboard } from "@/services/post";
import { ICommunityLeaderboard } from "@/types/post.type";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
import { Icon, Text } from "react-native-paper";

const LeaderboardScreen = () => {
  const { theme } = useThemeContext();
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState<
    (ICommunityLeaderboard & { rank: number })[]
  >([]);
  const [loading, setLoading] = useState(false);

  const textColor = getTextColor(theme, "primary");
  const subTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  const handleFetchData = async () => {
    try {
      setLoading(true);
      const response = await getCommunityLeaderboard();
      if (response.success) {
        // Thêm rank cho dữ liệu dựa trên thứ tự community_points
        const sortedData = response.data
          .sort((a, b) => b.community_points - a.community_points)
          .map((item, index) => ({
            ...item,
            rank: index + 1,
          }));
        setLeaderboardData(sortedData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const renderLeaderboardItem = ({
    item,
    index,
  }: {
    item: ICommunityLeaderboard & { rank: number };
    index: number;
  }) => {
    const rank = index + 1;

    return (
      <LinearGradient
        key={index}
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
              color: rank <= 3 ? "#fff" : textColor,
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
                color: textColor,
                fontSize: DesignSystem.typography.fontSize.base,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                marginBottom: 2,
              }}
            >
              {item.user_name}
            </Text>

            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.xs,
                fontWeight: DesignSystem.typography.fontWeight.medium,
                color: "#F59E0B",
              }}
            >
              {item.community_points}
            </Text>
          </View>

          {/* Avatar */}
          <AvatarCustom avatar={item.user_avatar} size={32} />
        </View>
      </LinearGradient>
    );
  };

  return (
    <ContainerCustom>
      {/* Header */}
      <View
        style={{
          padding: DesignSystem.spacing.md,
          paddingBottom: DesignSystem.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          gap: DesignSystem.spacing.md,
          backgroundColor: getBackgroundColor(theme, "primary"),
          ...DesignSystem.shadows[theme].md,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Icon source="arrow-left" size={24} color={textColor} />
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: DesignSystem.typography.fontSize.xl,
            fontWeight: DesignSystem.typography.fontWeight.bold,
            color: textColor,
            marginRight: 40,
          }}
        >
          {t("leaderboard")}
        </Text>
      </View>

      {/* Leaderboard List */}
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: DesignSystem.spacing.xl,
          }}
        >
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.md,
              color: subTextColor,
              marginTop: DesignSystem.spacing.md,
            }}
          >
            Đang tải bảng xếp hạng...{" "}
          </Text>
        </View>
      ) : (
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => item.user_id}
          renderItem={renderLeaderboardItem}
          contentContainerStyle={{
            padding: DesignSystem.spacing.md,
            gap: DesignSystem.spacing.sm,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleFetchData}
              colors={["#4A90E2"]}
              tintColor="#4A90E2"
            />
          }
        />
      )}
    </ContainerCustom>
  );
};

export default LeaderboardScreen;
