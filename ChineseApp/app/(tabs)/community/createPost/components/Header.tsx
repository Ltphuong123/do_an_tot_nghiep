import { ButtonCustom } from "@/components/shared/buttonCustom";
import {
  DesignSystem,
  getBackgroundColor,
  getColorAtived,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

type Props = {
  theme: "light" | "dark";
  onBack: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  loading?: boolean;
};

const Header: React.FC<Props> = ({
  theme,
  onBack,
  onSubmit,
  canSubmit,
  loading = false,
}) => {
  const textColor = getTextColor(theme, "primary");
  const { t } = useLanguageContext();

  return (
    <View
      style={{
        padding: DesignSystem.spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: getBackgroundColor(theme, "primary"),
        ...DesignSystem.shadows[theme].md,
      }}
    >
      <Pressable onPress={onBack}>
        <Icon source="arrow-left" size={24} color={textColor} />
      </Pressable>

      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.xl,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
        }}
      >
        {t("createPostTitle")}
      </Text>

      <ButtonCustom
        title={t("publish")}
        onPress={onSubmit}
        size="sm"
        disabled={!canSubmit}
        loading={loading}
        startColors={getColorAtived(theme)}
        endColors={getColorAtived(theme)}
        textStyle={{ color: "#fff" }}
      />
    </View>
  );
};

export default Header;
