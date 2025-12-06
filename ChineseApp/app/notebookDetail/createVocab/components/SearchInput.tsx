import { InputCustom } from "@/components/shared/inputCustom";
import { getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import React from "react";
import { ViewStyle } from "react-native";
import { Icon } from "react-native-paper";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
}) => {
  const { theme } = useThemeContext();
  const secondaryTextColor = getTextColor(theme, "secondary");
  const { t } = useLanguageContext();

  return (
    <InputCustom
      placeholder={placeholder || t("searchVocabulary")}
      value={value}
      onChangeText={onChangeText}
      leftIcon={<Icon source="magnify" size={20} color={secondaryTextColor} />}
      style={style}
    />
  );
};
