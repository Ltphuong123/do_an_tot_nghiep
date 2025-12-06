import { ButtonCustom } from "@/components/shared/buttonCustom";
import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-paper";

const CreateLessonsAI = () => {
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  return (
    <View style={{ width: "100%", gap: DesignSystem.spacing.xs }}>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.bold,
          color: textColor,
        }}
      >
        {t("aiLessons")}
      </Text>
      <CardCustom
        variant="card"
        padding="lg"
        style={{
          borderRadius: DesignSystem.borderRadius.xxl,
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.md,
                marginBottom: DesignSystem.spacing.xs,
                color: textColor,
                fontWeight: DesignSystem.typography.fontWeight.semibold,
              }}
            >
              {t("aiLessonsDesc")}
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.base,
                color: secondaryTextColor,
              }}
            >
              {t("unlimitedTopics")}
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.base,
                color: secondaryTextColor,
              }}
            >
              {t("studyWithAI")}
            </Text>
          </View>
          <Icon source="rocket-launch-outline" size={60} color="#ff5e62" />
        </View>
        <ButtonCustom
          title={t("createAILesson")}
          onPress={() => {
            router.push({
              pathname: "/noteOrAi" as any,
              params: {
                activeView: "ai-lesson",
                timestamp: Date.now().toString(),
              },
            });
          }}
          startColors="#0000FF"
          endColors="#800080"
          size="md"
          fullWidth
          style={{ marginTop: DesignSystem.spacing.md }}
          textStyle={{ color: "#fff" }}
        />
      </CardCustom>
    </View>
  );
};

export default CreateLessonsAI;
