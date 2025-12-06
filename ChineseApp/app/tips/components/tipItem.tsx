import React from "react";
import { View } from "react-native";

import HtmlRenderer from "@/components/shared/htmlRenderer";
import { DesignSystem, getTextColor } from "@/constants/designSystem";
import { ITip } from "@/types/tips.type";
import { getTipContent } from "@/utils/tipContentHelper";
import { Text } from "react-native-paper";

interface TipItemProps {
  tip: ITip;
  isExpanded: boolean;
  onToggle: () => void;
  theme: "light" | "dark";
}

const TipItem: React.FC<TipItemProps> = ({
  tip,
  isExpanded,
  onToggle,
  theme,
}) => {
  const textColor = getTextColor(theme, "primary");

  return (
    <View style={{ padding: 16 }}>
      {/* Nội dung tip - luôn hiển thị */}
      <View>
        <HtmlRenderer
          htmlContent={getTipContent(tip)}
          theme={theme}
          fontSize={15}
          textAlign="justify"
        />
        {tip.answer ? (
          <View
            style={{
              marginTop: 14,
              padding: 14,
              backgroundColor:
                theme === "light"
                  ? "rgba(74, 144, 226, 0.05)"
                  : "rgba(74, 144, 226, 0.1)",
              borderRadius: DesignSystem.borderRadius.md,
              borderLeftWidth: 4,
              borderLeftColor: "#4A90E2",
            }}
          >
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.sm,
                color: "#4A90E2",
                fontWeight: DesignSystem.typography.fontWeight.bold,
                marginBottom: DesignSystem.spacing.sm,
              }}
            >
              💡 Gợi ý
            </Text>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.md,
                color: textColor,
                lineHeight: 20,
              }}
            >
              {tip.answer}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default TipItem;

// Old expanded version (keeping for reference)
/*
const TipItemExpanded: React.FC<TipItemProps> = ({
  tip,
  isExpanded,
  onToggle,
  theme,
}) => {
  const animatedHeight = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);

  const textColor = getTextColor(theme, "primary");
  const secondaryTextColor = getTextColor(theme, "secondary");

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 320,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, animatedHeight]);

  const contentHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(measuredHeight + 40, 0)],
  });

  const iconRotation = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handlePressIn = () =>
    Animated.spring(scaleValue, {
      toValue: 0.985,
      useNativeDriver: true,
    }).start();
  const handlePressOut = () =>
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }],
        marginVertical: DesignSystem.spacing.sm,
      }}
    >
      <CardCustom
        variant={"card"}
        style={{
          borderRadius: DesignSystem.borderRadius.lg,
          overflow: "hidden",
        }}
      >
        <Pressable
          onPress={onToggle}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            padding: 18,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, marginRight: DesignSystem.spacing.sm }}>
            <Text
              style={{
                fontSize: DesignSystem.typography.fontSize.lg,
                fontWeight: DesignSystem.typography.fontWeight.bold,
                color: textColor,
                marginBottom: 6,
              }}
            >
              {tip.topic}
            </Text>
          </View>

          <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
            <Icon source="chevron-down" size={24} color={secondaryTextColor} />
          </Animated.View>
        </Pressable>

*/
