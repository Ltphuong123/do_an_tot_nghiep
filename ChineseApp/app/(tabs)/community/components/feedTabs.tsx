import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";

export type FeedTab = "all" | "viewed" | "favorite";

interface FeedTabsProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

const TABS: { key: FeedTab; label: string; icon?: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "viewed", label: "Đã xem" },
  { key: "favorite", label: "Yêu thích" },
];

const FeedTabs: React.FC<FeedTabsProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");

  return (
    <View
      style={{
        zIndex: 10,
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff",
        paddingVertical: DesignSystem.spacing.xs,
        borderRadius: DesignSystem.borderRadius.xxl,
        shadowColor: "#000",
        marginTop: DesignSystem.spacing.md,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: DesignSystem.spacing.md,
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={{
              height: 34,
              paddingHorizontal: DesignSystem.spacing.md,
              borderRadius: 17,
              backgroundColor: isActive
                ? "#3b82f6"
                : theme === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: isActive ? "#FFFFFF" : textColor,
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: isActive
                  ? DesignSystem.typography.fontWeight.semibold
                  : DesignSystem.typography.fontWeight.medium,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default FeedTabs;
