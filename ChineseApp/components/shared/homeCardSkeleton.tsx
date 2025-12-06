import { DesignSystem, getBackgroundColor } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

// Skeleton placeholder cho home cards khi đang load
export const HomeCardSkeleton: React.FC = () => {
  const { theme } = useThemeContext();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const skeletonColor = theme === "dark" ? "#2a2a2a" : "#e0e0e0";

  return (
    <View
      style={{
        width: "100%",
        padding: DesignSystem.spacing.md,
        borderRadius: DesignSystem.borderRadius.lg,
        backgroundColor: getBackgroundColor(theme, "elevated"),
        ...DesignSystem.shadows[theme].md,
      }}
    >
      {/* Header skeleton */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Animated.View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: skeletonColor,
            opacity,
          }}
        />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Animated.View
            style={{
              width: "60%",
              height: 16,
              borderRadius: 4,
              backgroundColor: skeletonColor,
              opacity,
              marginBottom: 6,
            }}
          />
          <Animated.View
            style={{
              width: "40%",
              height: 12,
              borderRadius: 4,
              backgroundColor: skeletonColor,
              opacity,
            }}
          />
        </View>
      </View>

      {/* Content skeleton */}
      <Animated.View
        style={{
          width: "100%",
          height: 80,
          borderRadius: 8,
          backgroundColor: skeletonColor,
          opacity,
        }}
      />
    </View>
  );
};

// Multiple skeletons cho danh sách cards
export const HomeCardsSkeletonList: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <View style={{ gap: DesignSystem.spacing.md }}>
      {Array.from({ length: count }).map((_, index) => (
        <HomeCardSkeleton key={index} />
      ))}
    </View>
  );
};
