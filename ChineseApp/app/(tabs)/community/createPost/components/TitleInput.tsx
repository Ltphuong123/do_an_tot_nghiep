import { InputCustom } from "@/components/shared/inputCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  theme: "light" | "dark";
  title: string;
  setTitle: (t: string) => void;
};

const TitleInput: React.FC<Props> = ({ theme, title, setTitle }) => {
  const textColor = getTextColor(theme, "primary");
  const { t } = useLanguageContext();
  return (
    <View style={{ gap: DesignSystem.spacing.xs }}>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.semibold,
          color: textColor,
        }}
      >
        {t("postTitleLabel")} <Text style={{ color: "#F44336" }}>*</Text>
      </Text>
      <InputCustom
        value={title}
        onChangeText={setTitle}
        placeholder={t("postTitlePlaceholder")}
      />
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.xs,
          textAlign: "right",
          color: getTextColor(theme, "secondary"),
        }}
      >
        {title.length}/100 {t("characters")}
      </Text>
    </View>
  );
};

export default TitleInput;
