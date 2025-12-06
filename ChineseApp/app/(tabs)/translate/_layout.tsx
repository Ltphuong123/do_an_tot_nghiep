import { NavigationConfig } from "@/constants/navigation";
import { useThemeContext } from "@/contexts/themeContext";
import { Stack } from "expo-router";
import React from "react";

export default function TranslateLayout() {
  const { theme } = useThemeContext();
  return (
    <Stack
      screenOptions={{
        ...NavigationConfig.stack(theme),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Dịch thuật",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="translateHistory"
        options={{
          title: "Lịch sử dịch",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
