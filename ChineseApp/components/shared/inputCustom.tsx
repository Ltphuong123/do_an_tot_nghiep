import {
  DesignSystem,
  getBackgroundColor,
  getBorderColor,
  getTextColor,
} from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import {
  TextInput as RNTextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "react-native-paper";

interface InputCustomProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  editable?: boolean;
}

export const InputCustom: React.FC<InputCustomProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  error,
  label,
  style,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  onFocus,
  onBlur,
  editable = true,
}) => {
  const { theme } = useThemeContext();

  const textColor = getTextColor(theme, "primary");
  const backgroundColor = getBackgroundColor(theme, "primary");
  const borderColor = error ? "#ef4444" : getBorderColor(theme, "medium");
  const placeholderColor = getTextColor(theme, "tertiary");

  return (
    <View style={[{ width: "100%" }, style]}>
      {label && (
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.sm,
            fontWeight: DesignSystem.typography.fontWeight.medium,
            color: textColor,
            marginBottom: DesignSystem.spacing.xs,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          backgroundColor: backgroundColor,
          borderRadius: DesignSystem.borderRadius.md,
          borderWidth: 1,
          borderColor: borderColor,
          paddingHorizontal: DesignSystem.spacing.md,
          paddingVertical: multiline
            ? DesignSystem.spacing.md
            : DesignSystem.spacing.sm,
          gap: DesignSystem.spacing.sm,
        }}
      >
        {leftIcon && (
          <View style={{ marginTop: multiline ? 4 : 0 }}>{leftIcon}</View>
        )}

        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={editable}
          style={[
            {
              flex: 1,
              fontSize: DesignSystem.typography.fontSize.base,
              color: textColor,
              paddingVertical: 0,
              minHeight: multiline ? 80 : undefined,
              textAlignVertical: multiline ? "top" : "center",
            },
            inputStyle,
          ]}
        />

        {rightIcon && (
          <View style={{ marginTop: multiline ? 4 : 0 }}>{rightIcon}</View>
        )}
      </View>

      {error && (
        <Text
          style={{
            fontSize: DesignSystem.typography.fontSize.xs,
            color: "#ef4444",
            marginTop: DesignSystem.spacing.xs,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
