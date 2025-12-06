import { DesignSystem } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface FilterItem {
  key: string;
  label: string;
  icon: string;
}

interface Props {
  activeFilter: string;
  onChange: (filter: string) => void;
}

export default function FilterChips({ activeFilter, onChange }: Props) {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();

  const textColor = theme === "light" ? "#000" : "#fff"; // fallback — parent components can override styles if needed

  const filters: FilterItem[] = [
    { key: t("personalSection"), label: t("personalSection"), icon: "account" },
    { key: t("freeSection"), label: t("freeSection"), icon: "gift" },
    { key: t("premiumSection"), label: t("premiumSection"), icon: "crown" },
  ];

  return (
    <View
      style={{
        paddingVertical: DesignSystem.spacing.sm,
        marginHorizontal: DesignSystem.spacing.md,
        paddingBottom: DesignSystem.spacing.md,
        marginBottom: DesignSystem.spacing.sm,
      }}
    >
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={filters}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{
          paddingHorizontal: DesignSystem.spacing.md,
          gap: DesignSystem.spacing.xs,
        }}
        renderItem={({ item }) => (
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: DesignSystem.spacing.sm,
              paddingVertical: DesignSystem.spacing.xs,
              borderRadius: 20,
              borderWidth: 1,
              backgroundColor:
                activeFilter === item.key
                  ? "#4A90E2"
                  : theme === "light"
                  ? "rgba(255, 255, 255, 0.95)"
                  : "rgba(30, 30, 30, 0.95)",
              borderColor:
                activeFilter === item.key
                  ? "#4A90E2"
                  : theme === "light"
                  ? "#E5E5E5"
                  : "#2A2A2A",
            }}
            onPress={() => onChange(item.key)}
          >
            <Icon
              source={item.icon}
              size={16}
              color={activeFilter === item.key ? "#FFFFFF" : textColor}
            />
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                fontWeight: DesignSystem.typography.fontWeight.medium,
                color: activeFilter === item.key ? "#FFFFFF" : textColor,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
