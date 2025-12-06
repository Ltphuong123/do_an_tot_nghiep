import { Tabs, usePathname } from "expo-router";
import React, { useEffect } from "react";

import { AnimatedTabIcon } from "@/components/animated-tab-icon";
import { HapticTab } from "@/components/haptic-tab";
import { AnimationConfig } from "@/constants/animation";
import { Colors } from "@/constants/theme";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useUnreadNotificationCount } from "@/hooks/useNotification";
import { useUser } from "@/hooks/useUser";
import { useTitleTranslateOrAi } from "@/store/useTitleNoteOrAi";

export default function TabLayout() {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const { title } = useTitleTranslateOrAi();
  const pathname = usePathname();
  const { refreshUserFromAPI, isLoggedIn } = useUser();

  const { data } = useUnreadNotificationCount();
  const unreadCount = data?.data.count || 0;
  const hideTab = !(
    pathname === "/home" ||
    pathname === "/translate" ||
    pathname === "/mockTest" ||
    pathname === "/noteOrAi" ||
    pathname === "/community"
  );

  // Refresh user data when app starts
  useEffect(() => {
    if (isLoggedIn) {
      refreshUserFromAPI();
    }
  }, [isLoggedIn, refreshUserFromAPI]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme === "dark" ? "#fff" : "#000",
        tabBarInactiveTintColor: Colors[theme].tabIconDefault,
        tabBarStyle: hideTab
          ? { display: "none" }
          : {
              backgroundColor: Colors[theme].background,
              borderTopWidth: 0.5,
              borderTopColor:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              height: 60,
              paddingTop: 8,
              paddingBottom: 8,
              ...(theme === "dark"
                ? AnimationConfig.shadow.dark.large
                : AnimationConfig.shadow.light.large),
            },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.2,
        },
        animation: AnimationConfig.tab.animation,
        lazy: AnimationConfig.tab.lazy,
        sceneStyle: {
          backgroundColor: Colors[theme].background,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("home"),
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="home"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="translate"
        options={{
          title: t("translate"),
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="language"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mockTest"
        options={{
          title: t("mockTest"),
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="clipboard"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="noteOrAi"
        options={{
          title: title === "notebook" ? t("noteOrAi") : t("aiLesson"),
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="book"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: t("community"),
          tabBarBadge:
            unreadCount > 0
              ? unreadCount > 99
                ? "99+"
                : unreadCount.toString()
              : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme === "dark" ? "#FF6B6B" : "#FF4444",
            color: "#fff",
            fontSize: 10,
            fontWeight: "bold",
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            textAlign: "center",
            lineHeight: 14,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="people"
              size={size}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
