import { DesignSystem } from "@/constants/designSystem";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Text } from "react-native-paper";

interface ButtonCustomProps {
  title: string;
  onPress: () => void;
  startColors: string;
  endColors: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const ButtonCustom: React.FC<ButtonCustomProps> = ({
  title,
  onPress,
  startColors,
  endColors,
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
}) => {
  const gradientColors = [startColors, endColors] as [
    string,
    string,
    ...string[]
  ];

  const sizeStyles = {
    sm: {
      paddingVertical: DesignSystem.spacing.sm,
      paddingHorizontal: DesignSystem.spacing.md,
      fontSize: DesignSystem.typography.fontSize.sm,
    },
    md: {
      paddingVertical: DesignSystem.spacing.md,
      paddingHorizontal: DesignSystem.spacing.lg,
      fontSize: DesignSystem.typography.fontSize.base,
    },
    lg: {
      paddingVertical: DesignSystem.spacing.lg,
      paddingHorizontal: DesignSystem.spacing.xl,
      fontSize: DesignSystem.typography.fontSize.md,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          width: fullWidth ? "100%" : "auto",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          borderRadius: DesignSystem.borderRadius.md,
          gap: DesignSystem.spacing.sm,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            {icon}
            <Text
              style={[
                {
                  fontSize: currentSize.fontSize,
                  fontWeight: DesignSystem.typography.fontWeight.semibold,
                  textAlign: "center",
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
};
