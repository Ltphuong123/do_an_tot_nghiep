import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface Props {
  title?: string;
}

export default function Header({ title = "Tất cả sổ tay" }: Props) {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");

  return (
    <View
      style={{
        padding: DesignSystem.spacing.md,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: getBackgroundColor(theme, "primary"),
        ...DesignSystem.shadows[theme].md,
        marginBottom: DesignSystem.spacing.sm,
      }}
    >
      <Pressable
        onPress={() => {
          router.replace("/noteOrAi" as any);
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon source="arrow-left" size={24} color={textColor} />
      </Pressable>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.xl,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
