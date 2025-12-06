import { AnimationConfig } from "@/constants/animation";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface AnimatedTabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
  focused?: boolean;
}

export function AnimatedTabIcon({
  name,
  color,
  size = 24,
  focused = false,
}: AnimatedTabIconProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Animation khi icon được focus
      Animated.parallel([
        // Scale pulse nhẹ
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.15,
            useNativeDriver: true,
            tension: AnimationConfig.spring.tension.medium,
            friction: AnimationConfig.spring.friction.low,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: AnimationConfig.spring.tension.low,
            friction: AnimationConfig.spring.friction.medium,
          }),
        ]),
        // Rotate nhẹ cho hiệu ứng đẹp
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: AnimationConfig.duration.fast,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: AnimationConfig.duration.fast,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // Reset về trạng thái ban đầu
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: AnimationConfig.spring.tension.medium,
          friction: AnimationConfig.spring.friction.medium,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: AnimationConfig.duration.instant,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused, scaleAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "5deg"],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { rotate }],
      }}
    >
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}
