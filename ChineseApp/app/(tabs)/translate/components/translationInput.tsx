import MicButton from "@/components/shared/micButton";
import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useSnackbar } from "@/contexts/snackbarContext";
import { useThemeContext } from "@/contexts/themeContext";

import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Icon } from "react-native-paper";

interface TranslationInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onClear: () => void;
  language?: string;
  onFullScreenMode?: () => void;
}

const TranslationInput = ({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onClear,
  language,
  onFullScreenMode,
}: TranslationInputProps) => {
  const { theme } = useThemeContext();
  const [isFocused, setIsFocused] = useState(false);
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const cardBackground = getBackgroundColor(theme, "elevated");
  const { showSnackbar } = useSnackbar();
  const { t } = useLanguageContext();

  const handleFocus = () => {
    if (onFullScreenMode) {
      onFullScreenMode();
    } else {
      setIsFocused(true);
      onFocus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
  };

  return (
    <View style={{ padding: DesignSystem.spacing.md }}>
      <View
        style={{
          borderRadius: DesignSystem.borderRadius.lg,
          borderWidth: 2,
          borderColor: isFocused ? "#4A90E2" : "transparent",
          minHeight: 50,
          padding: DesignSystem.spacing.md,
          backgroundColor: cardBackground,
          ...DesignSystem.shadows[theme].sm,
        }}
      >
        <TextInput
          style={{
            fontSize: DesignSystem.typography.fontSize.md,
            lineHeight: 24,
            height: 100,
            color: textColor,
          }}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={t("enterText")}
          placeholderTextColor={secondaryTextColor}
          multiline
          textAlignVertical="top"
        />

        {value.length > 0 && (
          <Pressable
            onPress={onClear}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 28,
              height: 28,
              borderRadius: 14,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)",
            }}
          >
            <Icon source="close-circle" size={20} color={secondaryTextColor} />
          </Pressable>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: DesignSystem.spacing.md,
        }}
      >
        <MicButton
          theme={theme}
          onChangeText={(text) => {
            onChangeText(text);
            if (onFullScreenMode) {
              onFullScreenMode();
            }
          }}
          showSnackbar={showSnackbar}
          language={language}
        />
      </View>
    </View>
  );
};

export default TranslationInput;
