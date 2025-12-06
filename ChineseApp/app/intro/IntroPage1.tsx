import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground } from "react-native";
import { Text } from "react-native-paper";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const CatDark = require("@/assets/images/background1.jpg");

interface IntroPage1Props {
  isActive: boolean;
  animationCycle: number;
  animDuration: number;
  animStagger: number;
  baseDelay: number;
}

export const IntroPage1: React.FC<IntroPage1Props> = ({
  isActive,
  animationCycle,
  animDuration,
  animStagger,
  baseDelay,
}) => {
  const slowFadeDown = (delay: number) =>
    FadeInDown.duration(animDuration).delay(delay);
  const slowFadeUp = (delay: number) =>
    FadeInUp.duration(animDuration).delay(delay);

  const features = [
    "Học tiếng Trung thông minh",
    "Cá nhân hóa theo bạn",
    "Cộng đồng năng động",
  ];

  return (
    <ImageBackground
      source={CatDark}
      resizeMode="cover"
      style={{ 
        flex: 1, 
        width: "100%", 
        backgroundColor: "#000",
        justifyContent: "flex-start" 
      }}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)"]}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <Animated.View
          key={`p0-header-${animationCycle}`}
          entering={isActive ? slowFadeDown(baseDelay) : undefined}
          style={{ marginTop: 100, alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 42,
              fontWeight: "800",
              color: "#FFFFFF",
              letterSpacing: 4,
            }}
          >
            ECHINSE
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View
          key={`p0-lines-${animationCycle}`}
          entering={isActive ? slowFadeUp(baseDelay + animStagger) : undefined}
          style={{ flex: 1, alignItems: "center", marginTop: 70 }}
        >
          {features.map((line, idx) => (
            <Animated.Text
              key={`p0-line-${animationCycle}-${idx}`}
              entering={
                isActive
                  ? slowFadeUp(baseDelay + animStagger * 2 + idx * animStagger)
                  : undefined
              }
              style={{
                fontSize: 18,
                color: "#FFFFFF",
                fontWeight: "600",
                textAlign: "center",
                marginVertical: 4,
              }}
            >
              {line}
            </Animated.Text>
          ))}
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
};
