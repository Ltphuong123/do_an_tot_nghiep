import { AnimationConfig } from "./animation";
import { Colors } from "./theme";

/**
 * Centralized navigation configuration
 * Giúp tránh duplicate code và đảm bảo consistency
 */

export const NavigationConfig = {
  // Base screen options áp dụng cho tất cả screens
  base: (theme: "light" | "dark") => ({
    headerShown: false,
    contentStyle: {
      backgroundColor: Colors[theme].background,
    },
  }),

  // Tab layout options
  tab: {
    ...AnimationConfig.tab,
    tabBarStyle: (theme: "light" | "dark", hideTab: boolean) =>
      hideTab
        ? false
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
    tabBarActiveTintColor: (theme: "light" | "dark") =>
      theme === "dark" ? "#fff" : "#000",
    tabBarInactiveTintColor: (theme: "light" | "dark") =>
      Colors[theme].tabIconDefault,
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: "700" as const,
      letterSpacing: 0.2,
    },
    sceneStyle: (theme: "light" | "dark") => ({
      backgroundColor: Colors[theme].background,
    }),
  },

  // Stack layout options
  stack: (theme: "light" | "dark") => ({
    ...AnimationConfig.stack.slideFromRight,
    contentStyle: {
      backgroundColor: Colors[theme].background,
    },
  }),

  // Special animations cho một số screens
  special: {
    fade: {
      ...AnimationConfig.stack.fade,
    },
  },
} as const;
