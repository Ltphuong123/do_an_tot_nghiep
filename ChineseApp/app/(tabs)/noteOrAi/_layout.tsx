import { Colors } from "@/constants/theme";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { Stack } from "expo-router";
import React from "react";

export default function NotebookLayout() {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
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
          title: t("notebookTitle"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="seeAllNotebook"
        options={{
          title: t("seeAllTitle"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="aiLessonResult"
        options={{
          title: t("aiLessonResultTitle"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="aiLessonRevision"
        options={{
          title: t("aiLessonRevisionTitle"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="historyAiLesson"
        options={{
          title: t("historyAiLessonTitle"),
          headerShown: false,
        }}
      />
    </Stack>
  );
}
