import { DesignSystem, getBackgroundColor } from "@/constants/designSystem";
import { useThemeContext } from "@/contexts/themeContext";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, View } from "react-native";

const screenWidth = Dimensions.get("window").width;

// Skeleton cho Exam Card
export const ExamCardSkeleton: React.FC = () => {
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
        width: screenWidth * 0.42,
        marginRight: DesignSystem.spacing.md,
        borderRadius: DesignSystem.borderRadius.lg,
        backgroundColor: getBackgroundColor(theme, "elevated"),
        ...DesignSystem.shadows[theme].md,
        overflow: "hidden",
      }}
    >
      {/* Image skeleton */}
      <Animated.View
        style={{
          width: "100%",
          height: 120,
          backgroundColor: skeletonColor,
          opacity,
        }}
      />
      
      {/* Content skeleton */}
      <View style={{ padding: 12 }}>
        <Animated.View
          style={{
            width: "80%",
            height: 14,
            borderRadius: 4,
            backgroundColor: skeletonColor,
            opacity,
            marginBottom: 8,
          }}
        />
        <Animated.View
          style={{
            width: "60%",
            height: 12,
            borderRadius: 4,
            backgroundColor: skeletonColor,
            opacity,
          }}
        />
      </View>
    </View>
  );
};

// Skeleton cho Tip Card
export const TipCardSkeleton: React.FC = () => {
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
    <Animated.View
      style={{
        width: screenWidth * 0.85,
        height: 150,
        borderRadius: DesignSystem.borderRadius.lg,
        backgroundColor: skeletonColor,
        opacity,
        marginRight: DesignSystem.spacing.md,
      }}
    />
  );
};

// Skeleton cho Exam Type Section
export const ExamTypeSectionSkeleton: React.FC = () => {
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
    <View style={{ paddingHorizontal: DesignSystem.spacing.md, marginBottom: 24 }}>
      {/* Section title */}
      <Animated.View
        style={{
          width: 150,
          height: 20,
          borderRadius: 4,
          backgroundColor: skeletonColor,
          opacity,
          marginBottom: 16,
        }}
      />

      {/* Exam cards row */}
      <View style={{ flexDirection: "row" }}>
        <ExamCardSkeleton />
        <ExamCardSkeleton />
      </View>
    </View>
  );
};

// Full MockTest screen skeleton
export const MockTestSkeletonList: React.FC = () => {
  return (
    <View>
      {/* Tips section */}
      <View
        style={{
          paddingHorizontal: DesignSystem.spacing.sm,
          paddingTop: DesignSystem.spacing.lg,
          marginBottom: 24,
        }}
      >
        <View style={{ flexDirection: "row", gap: DesignSystem.spacing.md }}>
          <TipCardSkeleton />
          <TipCardSkeleton />
        </View>
      </View>

      {/* Exam sections */}
      <ExamTypeSectionSkeleton />
      <ExamTypeSectionSkeleton />
      <ExamTypeSectionSkeleton />
    </View>
  );
};
