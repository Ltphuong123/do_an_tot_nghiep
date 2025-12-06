import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
} from "react-native-paper";

const fontConfig = {
  displayLarge: {
    fontFamily: "Inter_400Regular",
    fontWeight: "400",
  },
  displayMedium: {
    fontFamily: "Inter_400Regular",
    fontWeight: "400",
  },
  displaySmall: {
    fontFamily: "Inter_400Regular",
    fontWeight: "400",
  },

  headlineLarge: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  headlineMedium: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  headlineSmall: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },

  titleLarge: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  titleMedium: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  titleSmall: {
    fontFamily: "Inter_400Regular",
    fontWeight: "400",
  },

  bodyLarge: {
    fontFamily: "Inter_400Regular",
    fontWeight: "400",
  },
  bodyMedium: {
    fontFamily: "Inter_400Regular",
    fontWeight: "400",
  },
  bodySmall: {
    fontFamily: "Inter_300Light",
    fontWeight: "300",
  },

  labelLarge: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  labelMedium: {
    fontFamily: "Inter_400Regular",
    fontWeight: "400",
  },
  labelSmall: {
    fontFamily: "Inter_300Light",
    fontWeight: "300",
  },
};

export const getPaperTheme = (mode: "light" | "dark") => {
  const BaseTheme = mode === "dark" ? MD3DarkTheme : MD3LightTheme;

  return {
    ...BaseTheme,
    fonts: configureFonts({ config: fontConfig as any }),
  };
};
