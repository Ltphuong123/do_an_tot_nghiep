import { CardCustom } from "@/components/shared/cardCustom";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { useLanguageContext } from "@/contexts/languageContext";
import { useThemeContext } from "@/contexts/themeContext";
import { useStreaks } from "@/hooks/useHome";
import { useTranslateTodayCount } from "@/hooks/useTranslate";

import { formatTime } from "@/utils/format_time";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

// --- 1. Định nghĩa Gradient cho từng cấp độ ---
const getStreakGradientColors = (streak: number): string[] => {
  if (streak === 0) return ["#64748B", "#94A3B8"];
  if (streak <= 2) return ["#F97316", "#FDBA74"];
  if (streak <= 4) return ["#EA580C", "#FB923C"];
  if (streak <= 6) return ["#DC2626", "#F87171"];
  if (streak <= 13) return ["#7C3AED", "#C084FC"];
  return ["#9333EA", "#E879F9"];
};

// --- 2. Component GradientFireIcon (Tích hợp số Streak) ---
const GradientFireIcon = ({
  size = 50,
  colors,
  streak,
}: {
  size?: number;
  colors: string[];
  streak: number;
}) => {
  const gradientId = "fireGradient";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={colors[0]} stopOpacity="1" />
          <Stop offset="1" stopColor={colors[1]} stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Ngọn lửa */}
      <Path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.243-2.188.7-3.128C7.2 13.2 8 13.8 8.5 14.5Z"
        fill={`url(#${gradientId})`}
        stroke={`url(#${gradientId})`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0, -2)"
      />

      {/* Số Streak - Áp dụng cùng Gradient với ngọn lửa */}
      <SvgText
        fill={`url(#${gradientId})`} // Dùng Gradient cho màu chữ
        stroke="white" // Viền trắng giữ nguyên để tách biệt với nền tối nếu cần, hoặc có thể bỏ nếu muốn chữ thuần gradient
        strokeWidth="0.5" // Giảm stroke viền trắng xuống một chút để màu gradient bên trong rõ hơn
        fontSize="11"
        fontWeight="bold"
        x="12"
        y="22"
        textAnchor="middle"
      >
        {streak}
      </SvgText>
    </Svg>
  );
};

// --- 3. Component GradientPill ---
const GradientPill = ({
  width,
  height,
  colors,
}: {
  width: number;
  height: number;
  colors: string[];
}) => {
  const gradientId = "pillGradient";
  return (
    <Svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={colors[0]} stopOpacity="1" />
          <Stop offset="1" stopColor={colors[1]} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect
        width={width}
        height={height}
        rx={height / 2}
        fill={`url(#${gradientId})`}
      />
    </Svg>
  );
};

// Icon Check
const CheckIcon = ({ size = 18 }: { size?: number }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13L9 17L19 7"
        stroke="#FFFFFF"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const ITEM_SIZE = 32;
const STREAK_PILL_PADDING = 6;

const PersonalStats = React.memo(function PersonalStats() {
  const { theme } = useThemeContext();
  const textColor = getTextColor(theme, "primary");
  const { t } = useLanguageContext();

  const [containerWidth, setContainerWidth] = useState(0);

  // Use React Query hook
  const { data: streaks } = useStreaks();
  const { data: todayCount } = useTranslateTodayCount();

  const currentStreak = useMemo(() => streaks?.streak || 0, [streaks?.streak]);

  const streakColors = useMemo(
    () =>
      todayCount === 0
        ? ["#64748B", "#94A3B8"]
        : getStreakGradientColors(currentStreak),
    [currentStreak, todayCount]
  );

  const getStreakMessageKey = (streak: number) => {
    if (streak <= 4) return "habitFormed";
    if (streak <= 7) return "diligenceMakesUpForDiligence";
    if (streak <= 14) return "diligenceMakesUpForIntelligence";
    if (streak <= 30) return "diligentBlackCat";
    return "catCultivatesIntoSpirit";
  };

  const getConsecutiveGroups = useMemo(() => {
    if (!streaks?.weekData) return [];
    const groups = [];
    let currentGroup = [];
    for (let i = 0; i < streaks.weekData.length; i++) {
      if (streaks.weekData[i].completed) {
        currentGroup.push(i);
      } else {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      }
    }
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    return groups; // array of arrays of indices
  }, [streaks?.weekData]);

  const calculatePillForGroup = (group: number[]) => {
    if (containerWidth === 0) return null;
    const totalItems = 7;
    const totalGapSpace = containerWidth - totalItems * ITEM_SIZE;
    const singleGapSize = totalGapSpace / (totalItems - 1);

    const startIndex = group[0];
    const numDays = group.length;

    const pillLeft =
      startIndex * (ITEM_SIZE + singleGapSize) - STREAK_PILL_PADDING;
    const pillWidth =
      (numDays - 1) * (ITEM_SIZE + singleGapSize) +
      ITEM_SIZE +
      2 * STREAK_PILL_PADDING;

    return { left: pillLeft, width: pillWidth };
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
        {t("personal")}
      </Text>

      <CardCustom
        variant="card"
        padding="lg"
        style={{
          borderRadius: 24,
          backgroundColor: theme === "dark" ? "#1C1C1E" : "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Header: Icon & Text */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* Container Icon Lửa */}
          <View
            style={{
              position: "relative",
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GradientFireIcon
              size={50}
              colors={streakColors}
              streak={currentStreak}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{ color: textColor, fontWeight: "bold", fontSize: 16 }}
            >
              {t(getStreakMessageKey(currentStreak))}
            </Text>
            <Text
              style={{
                color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {t("youHaveBeenOnline")} {formatTime(streaks?.total_minutes || 0)}
            </Text>
            {todayCount === 0 && (
              <Text
                style={{
                  color: theme === "dark" ? "#F87171" : "#DC2626",
                  fontSize: 12,
                  marginTop: 4,
                  fontWeight: "500",
                }}
              >
                {t("maintainStreak")}
              </Text>
            )}
          </View>
        </View>

        {/* Streak Bar */}
        <View
          style={{ position: "relative" }}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width);
          }}
        >
          {/* Background Pills với Gradient cho mỗi nhóm liền nhau */}
          {getConsecutiveGroups.map((group, idx) => {
            const pill = calculatePillForGroup(group);
            return pill ? (
              <View
                key={idx}
                style={{
                  position: "absolute",
                  left: pill.left,
                  top: 0,
                  zIndex: 0,
                }}
              >
                <GradientPill
                  width={pill.width}
                  height={ITEM_SIZE}
                  colors={streakColors}
                />
              </View>
            ) : null;
          })}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 1,
            }}
          >
            {streaks?.weekData.map((item, index) => {
              const isLastActive =
                item.completed &&
                (!streaks.weekData[index + 1] ||
                  !streaks.weekData[index + 1].completed);

              return (
                <View
                  key={index}
                  style={{ alignItems: "center", gap: 8, width: ITEM_SIZE }}
                >
                  <View
                    style={{
                      width: ITEM_SIZE,
                      height: ITEM_SIZE,
                      borderRadius: ITEM_SIZE / 2,
                      backgroundColor: item.completed
                        ? "transparent"
                        : theme === "dark"
                        ? "#27272A"
                        : "#E5E7EB",

                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item.completed && <CheckIcon size={18} />}
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "500",
                      color: isLastActive
                        ? streakColors[1]
                        : item.completed
                        ? textColor
                        : theme === "dark"
                        ? "#6B7280"
                        : "#9CA3AF",
                    }}
                  >
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </CardCustom>
    </View>
  );
});

export default PersonalStats;
