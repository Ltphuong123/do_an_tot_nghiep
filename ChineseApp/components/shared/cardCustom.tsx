import {
  DesignSystem,
  getBorderColor,
  getShadow,
  getSolidColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

interface CardCustomProps {
  children: ReactNode;
  variant?: "card" | "cardElevated" | "primary" | "secondary";
  style?: ViewStyle;
  padding?: keyof typeof DesignSystem.spacing;
  borderRadius?: keyof typeof DesignSystem.borderRadius;
  shadow?: keyof typeof DesignSystem.shadows.light;
}

export const CardCustom: React.FC<CardCustomProps> = ({
  children,
  variant = "card",
  style,
  padding = "md",
  borderRadius = "lg",
  shadow,
}) => {
  const { theme } = useThemeContext();
  const backgroundColor = getSolidColor(theme, variant);
  const borderColor = getBorderColor(theme, "light");

  return (
    <View
      style={[
        {
          padding: DesignSystem.spacing[padding],
          borderRadius: DesignSystem.borderRadius[borderRadius],
          backgroundColor,
          // Thêm border nhẹ để tăng độ tương phản
          borderWidth: theme === "light" ? 1 : 0.5,
          borderColor,
        },
        // apply shadow if provided
        shadow ? getShadow(theme, shadow) : {},
        style,
      ]}
    >
      {children}
    </View>
  );
};
