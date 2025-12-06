import React from "react";
import { InteractionManager, Pressable, View } from "react-native";

import {
  DesignSystem,
  getBackgroundColor,
  getTextColor,
} from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { Icon, Text } from "react-native-paper";

interface TipsHeaderProps {
  theme: "light" | "dark";
  onBack: () => void;
}

const TipsHeader: React.FC<TipsHeaderProps> = ({ theme, onBack }) => {
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: DesignSystem.spacing.md,
        gap: DesignSystem.spacing.md,
        backgroundColor: getBackgroundColor(theme, "primary"),
        ...DesignSystem.shadows[theme].md,
      }}
    >
      <Pressable
        onPress={() => {
          InteractionManager.runAfterInteractions(() => {
            onBack();
          });
        }}
      >
        <Icon source="arrow-left" size={24} color={textColor} />
      </Pressable>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.xl,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
          flex: 1,
        }}
      >
        {t("tipsTitle")}
      </Text>
    </View>
  );
};

export default TipsHeader;
