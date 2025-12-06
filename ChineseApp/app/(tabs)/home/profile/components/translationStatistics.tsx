import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useTranslateStats } from "@/hooks/useTranslate";
import { StatisticCardProps } from "@/types/profile.type";
import React, { useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const TranslationStatistic = () => {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  const [scaleAnim] = useState(new Animated.Value(1));
  const { t } = useLanguageContext();

  // Use React Query hook
  const { data: statisticsData } = useTranslateStats();

  const StatisticCard = ({
    icon,
    label,
    value,
    color,
    trend,
  }: StatisticCardProps) => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        gap: DesignSystem.spacing.md,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: DesignSystem.borderRadius.md,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme === "light" ? `${color}20` : `${color}30`,
        }}
      >
        <Icon source={icon as any} size={24} color={color} />
      </View>
      <Text
        style={{
          fontSize: DesignSystem.typography.fontSize.xs,
          color: secondaryTextColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {label}-{value}{" "}
      </Text>
    </View>
  );

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        marginTop: DesignSystem.spacing.lg,
      }}
    >
      {statisticsData && (
        <CardCustom variant="card">
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: DesignSystem.spacing.lg,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: DesignSystem.spacing.sm,
              }}
            >
              <Icon source="chart-line" size={24} color={textColor} />
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.lg,
                  fontWeight: DesignSystem.typography.fontWeight.bold,
                  color: textColor,
                }}
              >
                {t("translationStatistics")}
              </Text>
            </View>
            <Pressable
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor:
                  theme === "light"
                    ? "rgba(74, 144, 226, 0.1)"
                    : "rgba(74, 144, 226, 0.2)",
              }}
              onPress={() => console.log("Show info")}
            >
              <Icon
                source="information-outline"
                size={18}
                color={secondaryTextColor}
              />
            </Pressable>
          </View>

          {/* Statistics Cards in Row */}
          <View
            style={{
              flexDirection: "row",
              gap: DesignSystem.spacing.md,
              marginBottom: DesignSystem.spacing.lg,
            }}
          >
            <View style={{ flex: 1 }}>
              <StatisticCard
                icon="calendar-today"
                label={t("today")}
                value={statisticsData?.today || 0}
                color="#4A90E2"
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatisticCard
                icon="calendar-week"
                label={t("thisWeek")}
                value={statisticsData?.week || 0}
                color="#FF9800"
              />
            </View>
            <View style={{ flex: 1 }}>
              <StatisticCard
                icon="calendar-month"
                label={t("thisMonth")}
                value={statisticsData?.month || 0}
                color="#4CAF50"
              />
            </View>
          </View>
        </CardCustom>
      )}
    </Animated.View>
  );
};

export default TranslationStatistic;
