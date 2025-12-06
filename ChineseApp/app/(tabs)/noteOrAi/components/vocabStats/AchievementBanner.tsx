import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { CuteBlackCatIcon } from "./CuteBlackCatIcon";

interface AchievementBannerProps {
  memorizedCount: number;
  theme: "dark" | "light";
}

export const getAchievementTitle = (count: number): string => {
  if (count >= 4000) return "Mèo Toàn Trí";
  if (count >= 3500) return "Mèo Đại Trưởng Lão";
  if (count >= 3000) return "Mèo Bậc Thầy";
  if (count >= 2500) return "Mèo Tinh Thông";
  if (count >= 2000) return "Mèo Lĩnh Hội";
  if (count >= 1500) return "Mèo Uyên Bác";
  if (count >= 1000) return "Mèo Học Giả";
  if (count >= 800) return "Mèo Lão Luyện";
  if (count >= 500) return "Mèo Thông Thái";
  if (count >= 200) return "Mèo Cần Mẫn";
  if (count >= 100) return "Mèo Siêng Năng";
  if (count >= 50) return "Mèo Tân Binh";
  return "Mèo Tập Sự";
};

export const AchievementBanner: React.FC<AchievementBannerProps> = ({
  memorizedCount,
  theme,
}) => {
  return (
    <View
      style={{
        marginHorizontal: 12,
        marginBottom: 12,
        borderRadius: 16,
        height: 60,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <LinearGradient
        colors={
          theme === "dark" ? ["#1e3a8a", "#3b82f6"] : ["#E0E7FF", "#EEF2FF"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "800",
              color: theme === "dark" ? "#fff" : "#4338CA",
              lineHeight: 40,
            }}
          >
            {memorizedCount}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: theme === "dark" ? "rgba(255,255,255,0.9)" : "#4338CA",
            }}
          >
            {getAchievementTitle(memorizedCount)}
          </Text>
        </View>
        <View style={{ marginRight: 8 }}>
          <CuteBlackCatIcon level={memorizedCount} />
        </View>
      </LinearGradient>
    </View>
  );
};
