import { AnimationConfig } from "@/constants/animation";
import { Colors } from "@/constants/theme";
import { useThemeContext } from "@/contexts/themeContext";
import { Stack } from "expo-router";
import React from "react";

export default function MockTestLayout() {
  const { theme } = useThemeContext();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: Colors[theme].background,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Thi thử",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="leaderboard"
        options={{
          title: "Bảng xếp hạng",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: "Lịch sử",
          headerShown: false,
          ...AnimationConfig.stack.fade,
        }}
      />
      <Stack.Screen
        name="downloaded"
        options={{
          title: "Bài thi đã tải",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="takeTest"
        options={{
          title: "Làm bài thi",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: "Kết quả",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="seeAllExam"
        options={{
          title: "Tất cả bài thi",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
