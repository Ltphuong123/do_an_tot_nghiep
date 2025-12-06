import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useTranslateTodayCount } from "@/hooks/useTranslate";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const UtilitiesSection = React.memo(function UtilitiesSection() {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const { t } = useLanguageContext();

  // Use React Query hook
  const { data: dailyTranslation } = useTranslateTodayCount();

  const handleHistoryPress = () => {
    router.push("/translate/translateHistory" as any);
  };

  const handleVocabularyPress = () => {
    router.replace({
      pathname: "/noteOrAi" as any,
      params: { activeView: "notebook", timestamp: Date.now().toString() },
    });
  };

  return (
    <View style={{ width: "100%", gap: DesignSystem.spacing.xs }}>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.lg,
          fontWeight: DesignSystem.typography.fontWeight.semibold,
          color: textColor,
          marginBottom: DesignSystem.spacing.xs,
        }}
      >
        {t("utilities")}
      </Text>

      {/* Grid 2 cột giống example */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* Card lớn bên trái - Hôm nay đã tra */}
        <CardCustom
          variant="card"
          padding="md"
          style={{
            flex: 1,
            borderRadius: 24,
            backgroundColor: theme === "dark" ? "#1C1C1E" : "#FFFFFF",
            height: 160,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View>
              <Text
                style={{
                  color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                {t("searyToday")}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}
              >
                <Text
                  style={{ fontSize: 36, fontWeight: "bold", color: textColor }}
                >
                  {dailyTranslation || 0}
                </Text>
                <Text style={{ fontSize: 14, color: textColor }}>
                  {t("words")}
                </Text>
              </View>
              <View style={{ marginTop: 4 }}>
                <Text
                  style={{ fontSize: 12, fontWeight: "bold", color: "#EF4444" }}
                >
                  {dailyTranslation === 0 ? "-" : "+"}
                  {dailyTranslation || 0}%
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: theme === "dark" ? "#6B7280" : "#9CA3AF",
                  }}
                >
                  {t("comparedToYesterday")}
                </Text>
              </View>
            </View>
          </View>

          {/* Cat Image - thay panda */}
          <View
            style={{
              position: "absolute",
              bottom: -8,
              right: -8,
              width: 96,
              height: 96,
            }}
          >
            <Icon
              source="cat"
              size={96}
              color={
                theme === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.6)"
              }
            />
          </View>
        </CardCustom>

        {/* Cột phải - 2 cards nhỏ */}
        <View style={{ flex: 1, gap: 12, height: 160 }}>
          {/* Card Lịch sử */}
          <Pressable
            onPress={handleHistoryPress}
            style={{
              flex: 1,
              backgroundColor: theme === "dark" ? "#1C1C1E" : "#FFFFFF",
              borderRadius: 24,
              padding: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Text
              style={{
                color: theme === "dark" ? "#FCA5A5" : "#EF4444",
                fontWeight: "600",
                fontSize: 14,
                zIndex: 10,
              }}
            >
              {t("history")}
            </Text>
            <View
              style={{
                position: "absolute",
                right: -8,
                bottom: -16,
                transform: [{ rotate: "-12deg" }],
                opacity: 0.8,
              }}
            >
              <Icon source="history" size={56} color="#F87171" />
            </View>
          </Pressable>

          {/* Card Từ vựng */}
          <Pressable
            onPress={handleVocabularyPress}
            style={{
              flex: 1,
              backgroundColor: theme === "dark" ? "#1C1C1E" : "#FFFFFF",
              borderRadius: 24,
              padding: 16,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Text
              style={{
                color: theme === "dark" ? "#BFDBFE" : "#3B82F6",
                fontWeight: "600",
                fontSize: 14,
                zIndex: 10,
              }}
            >
              {t("vocabulary")}
            </Text>
            <View
              style={{
                position: "absolute",
                right: -8,
                bottom: -16,
                transform: [{ rotate: "-12deg" }],
                opacity: 0.8,
              }}
            >
              <Icon source="book-open-page-variant" size={56} color="#60A5FA" />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

export default UtilitiesSection;
