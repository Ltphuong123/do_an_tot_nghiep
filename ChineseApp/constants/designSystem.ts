/**
 * Design System - Hệ thống thiết kế đồng nhất cho EChinese App
 * - Dark mode: Warm colors (màu nóng)
 * - Light mode: Cool colors (màu lạnh)
 * - Sử dụng gradient để tạo độ sâu và hiện đại
 */

import { Dimensions } from "react-native";

export const DesignSystem = {
  window: Dimensions.get("window"),
  // ============ GRADIENT COLORS ============
  gradients: {
    light: {
      // Primary gradients - Cool colors (xanh dương, tím nhạt)
      primary: ["#667eea", "#764ba2"],
      primarySoft: ["#a8c0ff", "#3f2b96"],
      secondary: ["#667eea", "#f093fb"],
      accent: ["#4facfe", "#00f2fe"],
      success: ["#11998e", "#38ef7d"],
      warning: ["#f093fb", "#f5576c"],
      error: ["#f5576c", "#e84393"],

      // Background gradients
      background: ["#fbfbfc", "#e9ecef"],
      card: ["#ffffff", "#f5f7fa"],
      cardElevated: ["#f5f7fa", "#eef1f7"],
      // Neutral gradients
      neutral: ["#adb5bd", "#868e96"],
      neutralLight: ["#fbfbfc", "#e9ecef"],
    },
    dark: {
      // Primary gradients - Warm colors (cam, đỏ, vàng)
      primary: ["#f093fb", "#f5576c"],
      primarySoft: ["#fa709a", "#fee140"],
      secondary: ["#ff9a56", "#ff6a88"],
      accent: ["#ffecd2", "#fcb69f"],
      success: ["#56ab2f", "#a8e063"],
      warning: ["#f2994a", "#f2c94c"],
      error: ["#eb3349", "#f45c43"],

      // Background gradients
      // background: ["#0f0c29", "#302b63"],
      background: ["#0f0f1e", "#1a1a2e"],
      card: ["#1f1f3a", "#252542"],
      cardElevated: ["#2a2a4a", "#353560"],

      // Neutral gradients
      neutral: ["#495057", "#343a40"],
      neutralLight: ["#2d3436", "#1e272e"],
    },
  },

  // ============ SOLID COLORS ============
  colors: {
    light: {
      text: {
        primary: "#1a1a1a",
        secondary: "#4a5568",
        tertiary: "#718096",
        disabled: "#a0aec0",
        inverse: "#ffffff",
      },
      background: {
        primary: "#fff",
        secondary: "#e5ebf1ff",
        tertiary: "#edf2f7",
        elevated: "#ffffff",
      },
      border: {
        light: "#e2e8f0",
        medium: "#cbd5e0",
        dark: "#a0aec0",
      },
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    dark: {
      text: {
        primary: "#f8fafc", // trắng nhẹ
        secondary: "#cbd5e0", // xám nhạt hơn
        tertiary: "#94a3b8", // xám lam nhẹ
        disabled: "#64748b", // xám tối (nhưng không quá đậm)
        inverse: "#0f0f1e",
      },
      background: {
        primary: "#141414",
        secondary: "#1a1a2e",
        tertiary: "#25253e",
        elevated: "#2a2a4a",
      },
      border: {
        light: "#2d3748",
        medium: "#4a5568",
        dark: "#718096",
      },
      overlay: "rgba(0, 0, 0, 0.7)",
    },
  },

  // ============ SPACING ============
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },

  // ============ BORDER RADIUS ============
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  // ============ TYPOGRAPHY ============
  typography: {
    fontSize: {
      xs: 10,
      sm: 12,
      base: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
      display: 36,
    },
    fontWeight: {
      light: "300" as const,
      regular: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
      extrabold: "800" as const,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  // ============ SHADOWS ============
  shadows: {
    light: {
      sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
      },
      lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
      },
      xl: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 10,
      },
    },
    dark: {
      sm: {
        shadowColor: "#ffffff77",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: "#ffffff77",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
      },
      lg: {
        shadowColor: "#ffffff77",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 6,
      },
      xl: {
        shadowColor: "#ffffff77",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 10,
      },
    },
  },

  // ============ ANIMATION ============
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    },
  },

  // ============ LAYOUT ============
  layout: {
    containerMaxWidth: 1200,
    containerPadding: 16,
    headerHeight: 60,
    tabBarHeight: 60,
  },
};

// ============ HELPER FUNCTIONS ============

/**
 * Tạo style cho LinearGradient
 */
export const createGradientStyle = (gradientColors: string[], style?: any) => ({
  colors: gradientColors,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  style: style,
});

/**
 * Get theme-specific values
 */
export const getThemeValue = <T>(
  theme: "light" | "dark",
  lightValue: T,
  darkValue: T
): T => {
  return theme === "light" ? lightValue : darkValue;
};

/**
 * Get gradient colors based on theme
 */
export const getGradient = (
  theme: "light" | "dark",
  type: keyof typeof DesignSystem.gradients.light
): string[] => {
  return DesignSystem.gradients[theme][type];
};

/**
 * Get text color based on theme
 */
export const getTextColor = (
  theme: "light" | "dark",
  variant: keyof typeof DesignSystem.colors.light.text = "primary"
): string => {
  return DesignSystem.colors[theme].text[variant];
};

/**
 * Get background color based on theme
 */
export const getBackgroundColor = (
  theme: "light" | "dark",
  variant: keyof typeof DesignSystem.colors.light.background = "primary"
): string => {
  return DesignSystem.colors[theme].background[variant];
};

export const getCardColor = (
  theme: "light" | "dark",
  variant: "default" | "elevated" = "default"
): string => {
  if (variant === "elevated") {
    return DesignSystem.colors[theme].background.elevated;
  }
  return DesignSystem.colors[theme].background.primary;
};

/**
 * Get border color based on theme
 */
export const getBorderColor = (
  theme: "light" | "dark",
  variant: keyof typeof DesignSystem.colors.light.border = "medium"
): string => {
  return DesignSystem.colors[theme].border[variant];
};

/**
 * Get shadow style based on theme
 */
export const getShadow = (
  theme: "light" | "dark",
  size: keyof typeof DesignSystem.shadows.light = "md"
) => {
  return DesignSystem.shadows[theme][size];
};

/**
 * Get solid color for components based on theme and variant
 */
export const getSolidColor = (
  theme: "light" | "dark",
  variant:
    | "background"
    | "card"
    | "cardElevated"
    | "primary"
    | "secondary"
    | "success"
    | "successLight"
    | "error"
    | "errorLight"
    | "neutral"
): string => {
  switch (variant) {
    case "background":
      return theme === "light" ? "#F0F1F5" : "#0A0A0A";
    case "card":
      return theme === "light" ? "#ffffff" : "#141414";
    case "cardElevated":
      return theme === "light" ? "#F2F2F2" : "#1F1F1F";
    case "primary":
      return theme === "light" ? "#667eea" : "#f093fb";
    case "secondary":
      return theme === "light" ? "#a8c0ff" : "#ff9a56";
    case "success":
      // main success
      return theme === "light" ? "#38ef7d" : "#56ab2f";
    case "successLight":
      // light background for correct answer
      return theme === "light" ? "#e6f9ef" : "#21321a";
    case "error":
      // main error
      return theme === "light" ? "#f5576c" : "#eb3349";
    case "errorLight":
      // light background for wrong answer
      return theme === "light" ? "#fdecea" : "#3a1f22";
    case "neutral":
      return theme === "light" ? "#f5f7fa" : "#2d3436";
    default:
      return theme === "light" ? "#ffffff" : "#1f1f3a";
  }
};

export const getIconColor = (
  theme: string,
  type: "primary" | "star" | "success" | "error" | "neutral"
) => {
  const colors = {
    primary: theme === "light" ? "#007AFF" : "#82B1FF",
    star: theme === "light" ? "#FFD700" : "#FFEB3B",
    success: theme === "light" ? "#4CAF50" : "#81C784",
    error: theme === "light" ? "#F44336" : "#E57373",
    neutral: theme === "light" ? "#9E9E9E" : "#BDBDBD",
  };
  return colors[type] || colors.neutral;
};

// ============ VOCAB STATUS COLORS ============
/**
 * Màu sắc chung cho trạng thái của từ vựng
 * Được thiết kế để nhất quán trên toàn ứng dụng
 */
export const VocabStatusColors = {
  "Đã thuộc": "#4CAF50", // Xanh lá - thành công
  "Chưa thuộc": "#FF9800", // Cam - cần học
  "Không chắc": "#9E9E9E", // Xám - không chắc chắn
  "Yêu thích": "#FF4081", // Hồng - yêu thích
  // Các key thường dùng trong code
  "đã thuộc": "#4CAF50",
  "chưa thuộc": "#FF9800",
  "không chắc": "#9E9E9E",
  "yêu thích": "#FF4081",
} as const;

/**
 * Get vocab status color
 */
export const getVocabStatusColor = (status: string): string => {
  return (
    VocabStatusColors[status as keyof typeof VocabStatusColors] ||
    VocabStatusColors["không chắc"]
  );
};

/**
 * Get vocab status color with opacity for background
 */
export const getVocabStatusColorWithOpacity = (
  status: string,
  opacity: number = 0.2
): string => {
  const color = getVocabStatusColor(status);
  const rgb = hexToRgb(color);
  if (rgb) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }
  return `${color}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0")}`;
};

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (
  hex: string
): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const getColorAtived = (theme: "light" | "dark") => {
  return theme === "light" ? "#2C416D" : "#42578B";
};

export const getColorConfirm = (theme: "light" | "dark") => {
  return theme === "light" ? "#2c416d" : "#42578b";
};

export const getColorCancel = (theme: "light" | "dark") => {
  return theme === "light" ? "#f2f2f2" : "#1f1f1f";
};

export const getColorModalBackground = (theme: "light" | "dark") => {
  return theme === "light" ? "#fff" : "#141414";
};

// Export default
export default DesignSystem;
