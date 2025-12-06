import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useStreaks } from "@/hooks/useHome";
import { formatTime } from "@/utils/format_time";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, Animated as RNAnimated, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import Reanimated from "react-native-reanimated";

export default function ChartSection() {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");
  const tintColor = theme === "light" ? "#4A90E2" : "#FF6B9D";

  const screenWidth = Dimensions.get("window").width;
  const { t } = useLanguageContext();
  const isFocused = useIsFocused();

  // Use React Query hook
  const { data: streak } = useStreaks();

  const [animationStarted, setAnimationStarted] = useState(false);

  const [animValues] = useState<Record<number, RNAnimated.Value>>(() => {
    const map: Record<number, RNAnimated.Value> = {};
    for (let i = 0; i < 7; i++) map[i] = new RNAnimated.Value(0);
    return map;
  });

  useEffect(() => {
    if (!isFocused) {
      setAnimationStarted(false);
      Object.values(animValues).forEach((v) => v.setValue(0));
      return;
    }

    if (!animationStarted) {
      setAnimationStarted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, animationStarted]);

  useEffect(() => {
    const days = streak?.weekData || [];
    for (let i = 0; i < days.length; i++) {
      if (!animValues[i]) animValues[i] = new RNAnimated.Value(0);
    }

    if (!isFocused) {
      Object.values(animValues).forEach((v) => v.setValue(0));
      return;
    }

    const animations = days.map((d, i) =>
      RNAnimated.timing(animValues[i], {
        toValue: d.minutes,
        duration: 600,
        useNativeDriver: false,
      })
    );

    RNAnimated.stagger(80, animations).start();
  }, [streak, isFocused, animValues]);

  const maxMinutes = Math.max(
    ...(streak?.weekData.map((d) => d.minutes) || [0]),
    1
  );

  const formatMinutes = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      }
      return `${hours}h${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const renderBarChart = () => {
    const barWidth = (screenWidth - 80) / 7;
    const maxBarHeight = 100;
    return (
      <Reanimated.View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          height: maxBarHeight + 40,
        }}
      >
        {streak?.weekData.map((day, index) => {
          const barHeight = (day.minutes / maxMinutes) * maxBarHeight;
          const anim = animValues[index];
          const animatedHeight = anim
            ? (anim as any).interpolate({
                inputRange: [0, maxMinutes],
                outputRange: [6, barHeight],
              })
            : barHeight;

          return (
            <View key={index} style={{ alignItems: "center", flex: 1, gap: 8 }}>
              <View
                style={{
                  height: maxBarHeight,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <RNAnimated.View
                  style={{
                    width: barWidth * 0.6,
                    height: animatedHeight,
                    backgroundColor: day.isToday
                      ? tintColor
                      : day.completed
                      ? theme === "light"
                        ? "#4CAF50"
                        : "#66BB6A"
                      : theme === "light"
                      ? "#E0E0E0"
                      : "#424242",
                    borderRadius: DesignSystem.borderRadius.sm,
                    ...DesignSystem.shadows[theme].sm,
                  }}
                />
              </View>

              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.xs,
                  color: day.isToday ? tintColor : secondaryTextColor,
                  fontWeight: day.isToday
                    ? DesignSystem.typography.fontWeight.bold
                    : DesignSystem.typography.fontWeight.medium,
                  textAlign: "center",
                }}
              >
                {day.day}
              </Text>

              <Text
                style={{
                  fontSize: 8,
                  color: secondaryTextColor,
                }}
              >
                {formatMinutes(day.minutes)}{" "}
              </Text>
            </View>
          );
        })}
      </Reanimated.View>
    );
  };

  return (
    <View
      style={{
        width: "100%",
        marginTop: DesignSystem.spacing.lg,
      }}
    >
      <CardCustom variant="card">
        <View style={{ padding: DesignSystem.spacing.sm }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: DesignSystem.spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
              }}
            >
              {t("activityReportChart")}
            </Text>
            <Icon source="chart-bar" size={24} color={tintColor} />
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: DesignSystem.spacing.xs,
                }}
              >
                <Icon source="fire" size={20} color="#FF6B35" />
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.xl,
                    fontWeight: DesignSystem.typography.fontWeight.bold,
                    marginLeft: DesignSystem.spacing.xs,
                    color: textColor,
                  }}
                >
                  {streak?.streak}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                }}
              >
                {t("activityTimeline")}
              </Text>
            </View>

            <View
              style={{
                width: 1,
                backgroundColor:
                  theme === "light"
                    ? "rgba(0,0,0,0.1)"
                    : "rgba(255,255,255,0.1)",
                marginHorizontal: DesignSystem.spacing.lg,
              }}
            />

            <View style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: DesignSystem.spacing.xs,
                }}
              >
                <Icon source="clock" size={20} color={tintColor} />
                <Text
                  style={{
                    fontSize: DesignSystem.typography.fontSize.xl,
                    fontWeight: DesignSystem.typography.fontWeight.bold,
                    marginLeft: DesignSystem.spacing.xs,
                    color: textColor,
                  }}
                >
                  {formatTime(streak?.total_minutes || 0)}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: DesignSystem.typography.fontSize.sm,
                  color: secondaryTextColor,
                }}
              >
                {t("thisWeek")}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: DesignSystem.typography.fontSize.md,
              fontWeight: DesignSystem.typography.fontWeight.semibold,
              color: textColor,
              marginVertical: DesignSystem.spacing.xl,
            }}
          >
            {t("dailyActivity")}
          </Text>

          {renderBarChart()}
        </View>
      </CardCustom>
    </View>
  );
}
