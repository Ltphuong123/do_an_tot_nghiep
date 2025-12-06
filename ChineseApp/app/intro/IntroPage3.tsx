import { ButtonCustom } from "@/components/shared/buttonCustom";
import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-paper";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface IntroPage3Props {
  isActive: boolean;
  animationCycle: number;
  animDuration: number;
  animStagger: number;
  baseDelay: number;
  onStart: () => void;
  onLogin: () => void;
}

export const IntroPage3: React.FC<IntroPage3Props> = ({
  isActive,
  animationCycle,
  animDuration,
  animStagger,
  baseDelay,
  onStart,
  onLogin,
}) => {
  const slowFadeDown = (delay: number) =>
    FadeInDown.duration(animDuration).delay(delay);
  const slowFadeUp = (delay: number) =>
    FadeInUp.duration(animDuration).delay(delay);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
      }}
    >
      {/* Icon minimal */}
      <Animated.View
        key={`p2-icon-${animationCycle}`}
        entering={isActive ? slowFadeDown(baseDelay) : undefined}
        style={{
          marginBottom: 48,
        }}
      >
        <Icon source="rocket-launch" size={80} color="#fff" />
      </Animated.View>

      {/* Brand */}
      <Animated.Text
        key={`p2-brand-${animationCycle}`}
        entering={isActive ? slowFadeUp(baseDelay + animStagger) : undefined}
        style={{
          fontSize: 48,
          fontWeight: "800",
          marginBottom: 16,
          textAlign: "center",
          color: "#FFFFFF",
          letterSpacing: 4,
        }}
      >
        ECHINSE
      </Animated.Text>

      {/* Title */}
      <Animated.Text
        key={`p2-title-${animationCycle}`}
        entering={isActive ? slowFadeUp(baseDelay + animStagger * 2) : undefined}
        style={{
          fontSize: 18,
          fontWeight: "400",
          marginBottom: 64,
          textAlign: "center",
          color: "#999",
          letterSpacing: 1,
        }}
      >
        Học tiếng Trung thông minh
      </Animated.Text>

      {/* Buttons */}
      <Animated.View
        key={`p2-buttons-${animationCycle}`}
        entering={isActive ? slowFadeUp(baseDelay + animStagger * 3) : undefined}
        style={{ width: "100%", gap: 16 }}
      >
        <ButtonCustom
          title="Bắt đầu"
          onPress={onStart}
          startColors="#fff"
          endColors="#fff"
          textStyle={{ 
            color: "#000", 
            fontSize: 17, 
            fontWeight: "600",
            letterSpacing: 0.5,
          }}
          style={{
            borderRadius: 8,
          }}
        />

        <ButtonCustom
          title="Đã có tài khoản"
          startColors="transparent"
          endColors="transparent"
          onPress={onLogin}
          style={{ 
            width: "100%",
            borderWidth: 1.5,
            borderColor: "#333",
            borderRadius: 8,
          }}
          textStyle={{ 
            color: "#999", 
            fontSize: 17, 
            fontWeight: "500",
            letterSpacing: 0.5,
          }}
        />
      </Animated.View>
    </View>
  );
};
